import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "./middleware/auth.js";

const prisma = new PrismaClient();
const listRouter = express.Router();

listRouter.patch("/:listId", authMiddleware, async (req, res) => {
  try {
    const listId = Number(req.params.listId);
    const { title } = req.body;

    if (!title || !title.trim())
      return res.status(400).json({ error: "Title required" });

    const list = await prisma.list.update({
      where: { id: listId },
      data: { title: title.trim() },
    });

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not rename list" });
  }
});

listRouter.patch("/:listId/move", authMiddleware, async (req, res) => {
  try {
    const listId = Number(req.params.listId);
    const { direction } = req.body; // "left" | "right"

    const list = await prisma.list.findUnique({ where: { id: listId } });
    if (!list) return res.status(404).json({ error: "List not found" });

    // Find adjacent list
    const swapWith = await prisma.list.findFirst({
      where: {
        boardId: list.boardId,
        position:
          direction === "left" ? list.position - 1 : list.position + 1,
      },
    });

    if (!swapWith) {
      return res.status(400).json({ error: "Cannot move list in that direction" });
    }

    // Swap positions
    await prisma.$transaction([
      prisma.list.update({
        where: { id: list.id },
        data: { position: swapWith.position },
      }),
      prisma.list.update({
        where: { id: swapWith.id },
        data: { position: list.position },
      }),
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not move list" });
  }
});

listRouter.delete("/:listId", authMiddleware, async (req, res) => {
  try {
    const listId = Number(req.params.listId);

    // Delete cards first (Prisma can do cascading but let's be explicit)
    await prisma.card.deleteMany({ where: { listId } });

    // Delete list
    await prisma.list.delete({ where: { id: listId } });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete list" });
  }
});

listRouter.post("/:id/cards", authMiddleware, async (req, res) => {
  try {
    const listId = Number(req.params.id);
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Card title is required" });
    }

    // Check list exists
    const list = await prisma.list.findUnique({
      where: { id: listId },
    });
    if (!list) return res.status(404).json({ error: "List not found" });

    // Get next position
    const count = await prisma.card.count({ where: { listId } });

    const card = await prisma.card.create({
      data: {
        title: title.trim(),
        listId,
        position: count,
      },
    });

    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create card" });
  }
});


export default listRouter;
