import express from "express";
import { db } from "./db/connection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./src/auth.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

// 테스트용 DB 라우터
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1+1 as result");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB 연결 실패" });
  }
});

// 로그인/회원가입 라우터
app.use("/auth", authRouter);

// 서버 실행 (항상 마지막에)
app.listen(3001, () => {
  console.log("서버 실행 중");
});
