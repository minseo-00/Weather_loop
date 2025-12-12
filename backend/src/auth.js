import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db/connection.js";
import axios from "axios";
import cors from "cors";

const router = express.Router();

router.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
  })
);

//   회원가입

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // 프론트 유효성 검사
  if (!email || !password) {
    return res.status(400).json({ error: "아이디(이메일)와 비밀번호를 입력해주세요." });
  }

  try {
    // 중복 체크
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(400).json({ error: "이미 존재하는 이메일입니다." });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (email, password) VALUES (?, ?)`,
      [email, hashed]
    );

    res.json({ success: true, message: "회원가입 완료" });
  } catch (err) {
    console.error("회원가입 에러:", err);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});


//   로그인

router.post("/login", async (req, res) => {
  // 프론트는 'email' 키로 아이디를 전송하지만, 여기서는 아이디/이메일 모두 허용
  const { email: identifier, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? OR SUBSTRING_INDEX(email, '@', 1) = ? ORDER BY id LIMIT 1",
      [identifier, identifier]
    );

    if (!rows.length)
      return res.status(400).json({ error: "존재하지 않는 계정 (아이디/이메일 확인)" });

    const user = rows[0];

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ error: "비밀번호 불일치" });
    }

    // 로그인 성공 → JWT 토큰 발급
    const token = jwt.sign({ id: user.id, email: user.email }, "your-secret-key", {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("로그인 에러:", err);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

//   로그아웃

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "로그아웃 완료" });
});

//   로그인 상태 유지

router.get("/me", (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.json({ user: null });

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    res.json({ user: decoded });
  } catch {
    res.json({ user: null });
  }
});


export default router;
