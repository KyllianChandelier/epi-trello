import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRouter from "./auth.js";
import boardRouter from "./boards.js";
import listRouter from "./lists.js";

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

app.get("/ping", (req, res) => res.json({ message: "pong" }));

// Test: create board

app.use("/boards", boardRouter);
app.use("/auth", authRouter);
app.use("/", listRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
prisma.board.deleteMany({});