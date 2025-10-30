import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import router from "./src/auth.js";
import { authMiddleware } from "./src/middleware/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

app.get("/ping", (req, res) => res.json({ message: "pong" }));

// Test: create board
app.post("/boards", authMiddleware, async (req, res) => {
  const board = await prisma.board.create({
    data: {
      name: req.body.name,
      owner: { connect: { id: req.userId } },
    },
  });
  res.json(board);
});

app.get("/boards", async (req, res) => {
  const userId = req.query.userId;
  const boards = await prisma.board.findMany({ where: { ownerId: Number(userId) } });
  res.json(boards);
});

app.use("/auth", router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
prisma.board.deleteMany({});