import express from "express";
const app = express();
// 루트 경로 헬스체크 또는 안내 메시지
app.get("/", (req, res) => {
  res.send("Weather_loop 백엔드 서버가 정상적으로 실행 중입니다.");
});
import { db, testConnection } from "./db/connection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./src/auth.js";
import bookmarkRouter from "./src/bookmark.js";
import dotenv from "dotenv";
import axios from "axios";

import diaryRouter from "./src/diary.js";

dotenv.config();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://refringent-bioecological-keisha.ngrok-free.dev"
    ],
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


// 북마크 API 라우터
app.use("/api/bookmark", bookmarkRouter);

// 다이어리 API 라우터
app.use("/api/diary", diaryRouter);

// 날씨 정보 API 엔드포인트
app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: "위도와 경도를 입력하세요." });
  }
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("날씨 API 에러:", error.response?.data || error.message || error);
    res.status(500).json({ error: "날씨 정보를 가져오지 못했습니다." });
  }
});

// 서버 실행 (항상 마지막에)
// Start server only after DB connection test
testConnection()
  .then(() => {
    app.listen(3001, () => {
      console.log("서버 실행 중 (DB 연결 확인됨, 포트 3001)");
    });
  })
  .catch((err) => {
    console.error('시작 중 DB 연결 실패 — 서버를 시작하지 않습니다.')
    console.error(err)
    process.exit(1)
  })
