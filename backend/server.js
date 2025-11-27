import express from "express";
import { db } from "./db/connection.js";

const app = express();

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1+1 as rusult");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB 연결 실패" });
  }
});

app.listen(3001, () => {
  console.log("서버 실행 중");
});
