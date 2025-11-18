import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "./middleware/auth.js";

const prisma = new PrismaClient();
const cardRouter = express.Router();

cardRouter.get("/:cardId", authMiddleware, async (req, res) => {
  try {
    const cardId = Number(req.params.cardId);

    const card = await prisma.card.get({
      where: { id: cardId },
    });

    res.json(card)
  } catch {
    console.error(err);
    res.status(500).json({ error: "failed to fetch card" })
  }
});

cardRouter.delete("/:cardId", authMiddleware, async (req, res) => {
  try {
    const cardId = Number(req.params.cardId);

    await prisma.card.delete({
      where: { id: cardId },
    });

    res.json({ message: "Card deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete card" });
  }
});

cardRouter.patch("/:cardId", authMiddleware, async (req, res) => {
  try {
    const cardId = Number(req.params.cardId);
    const { title, description } = req.body;

    const card = await prisma.card.update({
      where: { id: cardId },
      data: {
        title: title ?? undefined,
        description: description ?? undefined,
      },
    });

    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update card" });
  }
});

export default cardRouter;