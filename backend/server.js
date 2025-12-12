import express from "express";
import { db, testConnection } from "./db/connection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./src/auth.js";
import dotenv from "dotenv";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://oversad-nikole-peatier.ngrok-free.dev"
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

// ============ 북마크 API ============

// 북마크 추가
app.post("/api/bookmark/add", async (req, res) => {
  const { user_id, spotify_id, music_name, artist, preview_img } = req.body;
  
  if (!user_id || !spotify_id) {
    return res.status(400).json({ error: "user_id와 spotify_id가 필요합니다." });
  }

  try {
    // 1. music 테이블에 해당 곡이 있는지 확인
    const [existingMusic] = await db.query(
      "SELECT music_id FROM music WHERE spotify_id = ?",
      [spotify_id]
    );

    let music_id;
    if (existingMusic.length > 0) {
      music_id = existingMusic[0].music_id;
    } else {
      // 2. music 테이블에 곡 추가
      const [insertMusic] = await db.query(
        "INSERT INTO music (spotify_id, music_name, artist, preview_img) VALUES (?, ?, ?, ?)",
        [spotify_id, music_name || "Unknown", artist || "Unknown", preview_img || null]
      );
      music_id = insertMusic.insertId;
    }

    // 3. 이미 북마크되어 있는지 확인
    const [existingBookmark] = await db.query(
      "SELECT bookmark_id FROM bookmark WHERE user_id = ? AND music_id = ?",
      [user_id, music_id]
    );

    if (existingBookmark.length > 0) {
      return res.json({ ok: true, message: "이미 북마크에 추가된 곡입니다.", bookmark_id: existingBookmark[0].bookmark_id });
    }

    // 4. 북마크 추가
    const bookmark_id = uuidv4();
    await db.query(
      "INSERT INTO bookmark (bookmark_id, user_id, music_id, added_at) VALUES (?, ?, ?, NOW())",
      [bookmark_id, user_id, music_id]
    );

    res.json({ ok: true, message: "북마크 추가 완료", bookmark_id });
  } catch (error) {
    console.error("북마크 추가 에러:", error);
    res.status(500).json({ error: "북마크 추가 실패" });
  }
});

// 북마크 삭제
app.delete("/api/bookmark/remove", async (req, res) => {
  const { user_id, spotify_id } = req.body;

  if (!user_id || !spotify_id) {
    return res.status(400).json({ error: "user_id와 spotify_id가 필요합니다." });
  }

  try {
    // music_id 찾기
    const [music] = await db.query(
      "SELECT music_id FROM music WHERE spotify_id = ?",
      [spotify_id]
    );

    if (music.length === 0) {
      return res.status(404).json({ error: "해당 곡을 찾을 수 없습니다." });
    }

    // 북마크 삭제
    await db.query(
      "DELETE FROM bookmark WHERE user_id = ? AND music_id = ?",
      [user_id, music[0].music_id]
    );

    res.json({ ok: true, message: "북마크 삭제 완료" });
  } catch (error) {
    console.error("북마크 삭제 에러:", error);
    res.status(500).json({ error: "북마크 삭제 실패" });
  }
});

// 사용자의 북마크 목록 조회
app.get("/api/bookmark/list/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const [bookmarks] = await db.query(
      `SELECT b.bookmark_id, b.added_at, m.music_id, m.spotify_id, m.music_name, m.artist, m.preview_img
       FROM bookmark b
       JOIN music m ON b.music_id = m.music_id
       WHERE b.user_id = ?
       ORDER BY b.added_at DESC`,
      [user_id]
    );

    res.json({ ok: true, bookmarks });
  } catch (error) {
    console.error("북마크 목록 조회 에러:", error);
    res.status(500).json({ error: "북마크 목록 조회 실패" });
  }
});

// 특정 곡이 북마크되어 있는지 확인
app.get("/api/bookmark/check", async (req, res) => {
  const { user_id, spotify_id } = req.query;

  if (!user_id || !spotify_id) {
    return res.status(400).json({ error: "user_id와 spotify_id가 필요합니다." });
  }

  try {
    const [music] = await db.query(
      "SELECT music_id FROM music WHERE spotify_id = ?",
      [spotify_id]
    );

    if (music.length === 0) {
      return res.json({ ok: true, isBookmarked: false });
    }

    const [bookmark] = await db.query(
      "SELECT bookmark_id FROM bookmark WHERE user_id = ? AND music_id = ?",
      [user_id, music[0].music_id]
    );

    res.json({ ok: true, isBookmarked: bookmark.length > 0 });
  } catch (error) {
    console.error("북마크 확인 에러:", error);
    res.status(500).json({ error: "북마크 확인 실패" });
  }
});

// 서버 실행 (항상 마지막에)
// Start server only after DB connection test
testConnection()
  .then(() => {
    app.listen(3001, () => {
      console.log("서버 실행 중 (DB 연결 확인됨)");
    });
  })
  .catch((err) => {
    console.error('시작 중 DB 연결 실패 — 서버를 시작하지 않습니다.')
    console.error(err)
    process.exit(1)
  })
