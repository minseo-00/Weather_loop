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
      "https://refringent-bioecological-keisha.ngrok-free.dev"
    ],
    credentials: true,
  })
);

//   회원가입

router.post("/register", async (req, res) => {
  const { email, password, name, nickname, local, latitude, longitude } = req.body;

  // 프론트 유효성 검사
  if (!email || !password || !name || !nickname) {
    return res.status(400).json({ error: "필수 입력값을 모두 입력해주세요." });
  }

  try {
    // 중복 체크
    const [rows] = await db.query("SELECT user_id FROM userInfo WHERE user_id = ?", [email]);
    if (rows.length > 0) {
      return res.status(400).json({ error: "이미 존재하는 이메일입니다." });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO userInfo 
      (user_id, password, name, nickname, phone_number, create_date, useflag, login_fail_count, local, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, CURDATE(), 'Y', 0, ?, ?, ?)`,
      [email, hashed, name, nickname, "", local, latitude, longitude]
    );

    res.json({ success: true, message: "회원가입 완료" });
  } catch (err) {
    console.error("회원가입 에러:", err);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});


//   로그인

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM userInfo WHERE user_id = ?",
    [email]
  );

  if (!rows.length)
    return res.status(400).json({ error: "존재하지 않는 계정" });

  const user = rows[0];

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    // 실패하면 fail count +1
    await db.query(
      "UPDATE userInfo SET login_fail_count = login_fail_count + 1 WHERE user_id = ?",
      [email]
    );
    return res.status(400).json({ error: "비밀번호 불일치" });
  }

  // 로그인 성공 → 마지막 로그인 시간 업데이트
  await db.query(
    "UPDATE userInfo SET lastlogin_date = CURDATE(), login_fail_count = 0 WHERE user_id = ?",
    [email]
  );

  const token = jwt.sign(
    { user_id: user.user_id, nickname: user.nickname },
    "SECRET_KEY",
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // don't set `domain` here so the cookie is host-only and will be set
    // for the origin the browser sees (useful when proxying through Next.js)
  });
  // 프론트에서 token 값을 받아 localStorage에도 저장할 수 있도록 응답에 token 포함
  res.json({ message: "로그인 성공", token });
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


// axios 예제

router.post("/axios-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await axios.post("https://refringent-bioecological-keisha.ngrok-free.dev/auth/login", { email, password }, {
      withCredentials: true,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Axios 로그인 에러:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

export default router;
