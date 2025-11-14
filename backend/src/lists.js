import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "./middleware/auth.js";

const prisma = new PrismaClient();
const listRouter = express.Router();

listRouter.post("/boards/:id/lists", authMiddleware, async (req, res) => {
  try {
    const boardId = Number(req.params.id);
    const { name } = req.body;

    if (!name || !name.trim())
      return res.status(400).json({ error: "List name is required" });

    // Check if user has access to this board
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: { members: true, lists: true },
    });

    if (!board) return res.status(404).json({ error: "Board not found" });

    const userId = req.userId;
    const membership = board.members.find((m) => m.userId === userId);
    const isAdmin = board.ownerId === userId || membership?.role === "admin";

    if (!isAdmin && !membership)
      return res.status(403).json({ error: "Not authorized to add list" });

    const nextPosition =
      board.lists.length > 0
        ? Math.max(...board.lists.map((l) => l.position)) + 1
        : 1;

    const list = await prisma.list.create({
      data: {
        title: name.trim(),
        position: nextPosition,
        board: { connect: { id: boardId } },
      },
    });

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create list" });
  }
});

export default listRouter;