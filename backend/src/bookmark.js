import express from "express";
import { db } from "../db/connection.js";

const router = express.Router();

// 북마크 목록 조회
router.get("/list", async (req, res) => {
  const user_id = req.query.user_id;
  if (!user_id) return res.status(400).json({ ok: false, error: "user_id 필요" });
  try {
    const [rows] = await db.query(
      "SELECT bookmark_id, user_id, url, img, added_at, music_id FROM bookmark WHERE user_id = ? ORDER BY added_at DESC",
      [user_id]
    );
    // img는 URL로 저장되어 있으므로 그대로 반환
    res.json({ ok: true, bookmarks: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: "DB 오류", detail: err.message });
  }
});

// 북마크 추가
router.post("/add", async (req, res) => {
  const { user_id, url, img, music_id } = req.body;
  if (!user_id || !url || !music_id) return res.status(400).json({ ok: false, error: "필수값 누락" });
  try {
    // music 테이블에 해당 music_id가 없으면 자동 insert
    await db.query(
      "INSERT IGNORE INTO music (music_id) VALUES (?)",
      [music_id]
    );
    await db.query(
      "INSERT INTO bookmark (bookmark_id, user_id, url, img, music_id, added_at) VALUES (UUID(), ?, ?, ?, ?, NOW())",
      [user_id, url, img || null, music_id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: "DB 오류", detail: err.message });
  }
});

// 북마크 삭제
router.post("/remove", async (req, res) => {
  const { user_id, music_id } = req.body;
  if (!user_id || !music_id) return res.status(400).json({ ok: false, error: "필수값 누락" });
  try {
    await db.query(
      "DELETE FROM bookmark WHERE user_id = ? AND music_id = ?",
      [user_id, music_id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: "DB 오류", detail: err.message });
  }
});

export default router;
