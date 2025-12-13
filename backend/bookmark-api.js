const express = require('express');
const cors = require('cors');
const pool = require('./db/connection');
const app = express();

app.use(cors());
app.use(express.json());

// 북마크 목록 조회
app.get('/api/bookmark/list', async (req, res) => {
  const user_id = req.query.user_id;
  if (!user_id) return res.status(400).json({ ok: false, error: 'user_id 필요' });
  try {
    const [rows] = await pool.query(
      'SELECT bookmark_id, user_id, url, img, added_at, music_id FROM bookmark WHERE user_id = ? ORDER BY added_at DESC',
      [user_id]
    );
    // img는 URL로 저장되어 있으므로 그대로 반환
    const bookmarks = rows.map(row => ({
      ...row,
      img: row.img || null,
    }));
    res.json({ ok: true, bookmarks });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'DB 오류', detail: err.message });
  }
});

// 북마크 추가
app.post('/api/bookmark/add', async (req, res) => {
  const { user_id, url, img, music_id } = req.body;
  if (!user_id || !url || !music_id) return res.status(400).json({ ok: false, error: '필수값 누락' });
  try {
    await pool.query(
      'INSERT INTO bookmark (bookmark_id, user_id, url, img, music_id, added_at) VALUES (UUID(), ?, ?, ?, ?, NOW())',
      [user_id, url, img || null, music_id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'DB 오류', detail: err.message });
  }
});

// 북마크 삭제
app.post('/api/bookmark/remove', async (req, res) => {
  const { user_id, music_id } = req.body;
  if (!user_id || !music_id) return res.status(400).json({ ok: false, error: '필수값 누락' });
  try {
    await pool.query(
      'DELETE FROM bookmark WHERE user_id = ? AND music_id = ?',
      [user_id, music_id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'DB 오류', detail: err.message });
  }
});

app.listen(4000, () => {
  console.log('백엔드 서버: http://localhost:4000');
});
