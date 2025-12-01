import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db/connection.js";

const router = express.Router();


//   회원가입

router.post("/register", async (req, res) => {
  const { user_id, password, name, nickname, phone_number, local } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO userInfo 
      (user_id, password, name, nickname, phone_number, create_date, useflag, login_fail_count, local)
      VALUES (?, ?, ?, ?, ?, CURDATE(), 'Y', 0, ?)`,
      [user_id, hashed, name, nickname, phone_number, local]
    );

    res.json({ message: "회원가입 완료" });
  } catch (err) {
    res.status(400).json({ error: "이미 존재하는 user_id입니다." });
  }
});


//   로그인

router.post("/login", async (req, res) => {
  const { user_id, password } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM userInfo WHERE user_id = ?",
    [user_id]
  );

  if (!rows.length)
    return res.status(400).json({ error: "존재하지 않는 계정" });

  const user = rows[0];

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    // 실패하면 fail count +1
    await db.query(
      "UPDATE userInfo SET login_fail_count = login_fail_count + 1 WHERE user_id = ?",
      [user_id]
    );
    return res.status(400).json({ error: "비밀번호 불일치" });
  }

  // 로그인 성공 → 마지막 로그인 시간 업데이트
  await db.query(
    "UPDATE userInfo SET lastlogin_date = CURDATE(), login_fail_count = 0 WHERE user_id = ?",
    [user_id]
  );

  const token = jwt.sign(
    { user_id: user.user_id, nickname: user.nickname },
    "SECRET_KEY",
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax"
  });

  res.json({ message: "로그인 성공" });
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
    const decoded = jwt.verify(token, "SECRET_KEY");
    res.json({ user: decoded });
  } catch {
    res.json({ user: null });
  }
});

export default router;
