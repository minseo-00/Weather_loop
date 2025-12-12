import express from "express";
import { db, testConnection } from "./db/connection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./src/auth.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.FRONTEND_URL
    ].filter(Boolean),
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
    console.log("DB 연결 확인됨");
  })
  .catch((err) => {
    console.warn('DB 연결 실패 - DB 기능 사용 불가 (Spotify 기능은 정상 작동)')
    console.error(err.message)
  })
  .finally(() => {
    app.listen(3001, () => {
      console.log("서버 실행 중 on http://localhost:3001");
    });
  })
