import axios from "axios";
import { BASE_URL } from "@/shared/api/config";
// 회원가입
const register = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, form, { withCredentials: true });
    // 자동 로그인
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      user_id: form.user_id,
      password: form.password
    }, { withCredentials: true });
    // 자동 로그인 성공 → 메인 화면 이동
    window.location.href = "/";
  } catch (err) {
    const msg = err?.response?.data?.error || err.message || err;
    alert("회원가입/로그인 실패: " + msg);
  }
};

// 로그인
const login = async () => {
  try {
    await axios.post(`${BASE_URL}/auth/login`, {
      user_id: form.user_id,
      password: form.password
    }, { withCredentials: true });
    window.location.href = "/";
  } catch (err) {
    const msg = err?.response?.data?.error || err.message || err;
    alert("로그인 실패: " + msg);
  }
};

// 로그인 유지
useEffect(() => {
  async function loadUser() {
    try {
      const res = await axios.get(`${BASE_URL}/auth/me`, { withCredentials: true });
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  }
  loadUser();
}, []);

// 로그아웃
const logout = async () => {
  await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
};

