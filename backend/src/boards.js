import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "./middleware/auth.js";

const prisma = new PrismaClient();
const boardRouter = express.Router();

boardRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: "Board name is required" });
    }

    // Step 1 — create the board (owner only)
    const board = await prisma.board.create({
      data: {
        name,
        description: description || null,
        owner: { connect: { id: req.userId } },
      },
    });

    // Step 2 — add the owner as a BoardMember (role: admin)
    await prisma.boardMember.create({
      data: {
        userId: req.userId,
        boardId: board.id,
        role: "admin",
      },
    });

    // Step 3 — handle optional invited members
    if (Array.isArray(members) && members.length > 0) {
      const foundUsers = await prisma.user.findMany({
        where: { email: { in: members.map((m) => m.trim()) } },
        select: { id: true },
      });

      const boardMembersData = foundUsers.map((u) => ({
        userId: u.id,
        boardId: board.id,
        role: "member",
      }));

      if (boardMembersData.length > 0) {
        await prisma.boardMember.createMany({
          data: boardMembersData,
          skipDuplicates: true,
        });
      }
    }

    // Step 4 — return the board with all members
    const fullBoard = await prisma.board.findUnique({
      where: { id: board.id },
      include: {
        members: {
          include: { user: { select: { id: true, email: true, name: true } } },
        },
        owner: { select: { id: true, email: true, name: true } },
      },
    });

    res.status(201).json(fullBoard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create board" });
  }
});


boardRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch boards where the user is either the owner or a member
    const boards = await prisma.board.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        owner: {
          select: { id: true, email: true, name: true },
        },
        members: {
          include: {
            user: { select: { id: true, email: true, name: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Map boards to include the current user’s role
    const result = boards.map((board) => {
      // Find the current user's membership entry
      const membership = board.members.find((m) => m.userId === userId);

      return {
        id: board.id,
        name: board.name,
        description: board.description,
        owner: board.owner,
        members: board.members.map((m) => ({
          id: m.user.id,
          email: m.user.email,
          name: m.user.name,
          role: m.role,
        })),
        role: board.ownerId === userId ? "admin" : membership?.role || "member",
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
});

boardRouter.delete("/:id", authMiddleware, async (req, res) => {
  const boardId = Number(req.params.id);
  const userId = req.userId;

  try {
    // Verify that the user is admin for this board
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: { owner: true, members: true },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Determine user role
    const membership = board.members.find((m) => m.userId === userId);
    const isAdmin = board.ownerId === userId || membership?.role === "admin";

    if (!isAdmin) {
      return res.status(403).json({ error: "You are not allowed to delete this board" });
    }

    // Delete related BoardMembers first
    await prisma.boardMember.deleteMany({
      where: { boardId },
    });

    // Then delete the board itself
    await prisma.board.delete({
      where: { id: boardId },
    });

    res.json({ message: "Board deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete board" });
  }
}); 

boardRouter.get("/:id", authMiddleware, async (req, res) => {
  try {
    const boardId = Number(req.params.id);
    const userId = req.userId;

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        owner: { select: { id: true, email: true, name: true } },
        members: {
          include: {
            user: { select: { id: true, email: true, name: true } },
          },
        },
        lists: {
          include: {
            // cards: true (when you implement them)
          },
        },
      },
    });

    if (!board) return res.status(404).json({ error: "Board not found" });

    // Check access
    const membership = board.members.find((m) => m.userId === userId);
    const isAdmin = board.ownerId === userId || membership?.role === "admin";

    if (!isAdmin && !membership) {
      return res.status(403).json({ error: "You are not allowed to view this board" });
    }

    // Include user role in the response
    const role = isAdmin ? "admin" : membership?.role || "member";

    res.json({ ...board, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch board" });
  }
});

boardRouter.post("/:id/lists", authMiddleware, async (req, res) => {
  try {
    const boardId = Number(req.params.id);
    const { name } = req.body;

    if (!name || !name.trim())
      return res.status(400).json({ error: "List name is required" });

    // Check if user has access to this board
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: { members: true },
    });

    if (!board) return res.status(404).json({ error: "Board not found" });

    const userId = req.userId;
    const membership = board.members.find((m) => m.userId === userId);
    const isAdmin = board.ownerId === userId || membership?.role === "admin";

    if (!isAdmin && !membership)
      return res.status(403).json({ error: "Not authorized to add list" });

    const list = await prisma.list.create({
      data: {
        name,
        board: { connect: { id: boardId } },
      },
    });

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create list" });
  }
});

export default boardRouter;