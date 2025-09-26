import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

app.get("/ping", (req, res) => res.json({ message: "pong" }));

// Test: create board
app.post("/boards", async (req, res) => {
  const board = await prisma.board.create({
    data: { name: req.body.name },
  });
  res.json(board);
});

app.get("/boards", async (req, res) => {
  const boards = await prisma.board.findMany();
  res.json(boards);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
