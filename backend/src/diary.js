import express from "express";
import { db } from "../db/connection.js";

const router = express.Router();

// 일기 전체 조회 (user_id별)
router.get("/", async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: "user_id 필요" });
  try {
    const [rows] = await db.query("SELECT * FROM diary WHERE user_id = ? ORDER BY created_at DESC", [user_id]);
    res.json({ diaries: rows });
  } catch (err) {
    res.status(500).json({ error: "DB 오류", detail: err.message });
  }
});

// 일기 작성
router.post("/", async (req, res) => {
  const { user_id, track, weather, mood, memo } = req.body;
  if (!user_id || !track || !weather || !mood) return res.status(400).json({ error: "필수값 누락" });
  try {
    await db.query(
      "INSERT INTO diary (user_id, track, weather, mood, memo) VALUES (?, ?, ?, ?, ?)",
      [user_id, track, weather, mood, memo]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "DB 오류", detail: err.message });
  }
});

// 일기 수정
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { track, weather, mood, memo, user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "user_id 필요" });
  try {
    const [result] = await db.query(
      "UPDATE diary SET track=?, weather=?, mood=?, memo=? WHERE id=? AND user_id=?",
      [track, weather, mood, memo, id, user_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "수정할 데이터 없음 또는 권한 없음" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "DB 오류", detail: err.message });
  }
});

// 일기 삭제
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM diary WHERE id=?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "DB 오류", detail: err.message });
  }
});

export default router;
