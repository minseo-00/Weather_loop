// 회원가입
const register = async () => {
  const res = await fetch("http://localhost:3001/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    alert("회원가입 실패: " + data.error);
    return;
  }

  // 자동 로그인
  const loginRes = await fetch("http://localhost:3001/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      user_id: form.user_id,
      password: form.password
    })
  });

  const loginData = await loginRes.json();

  if (!loginRes.ok) {
    alert("로그인 실패: " + loginData.error);
    return;
  }

  // 자동 로그인 성공 → 메인 화면 이동
  window.location.href = "/";
};

// 로그인
const login = async () => {
  const res = await fetch("http://localhost:3001/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: form.user_id,
      password: form.password
    })
  });

  const data = await res.json();
  if (!res.ok) {
    alert("로그인 실패: " + data.error);
    return;
  }

  window.location.href = "/";
};

// 로그인 유지
useEffect(() => {
  async function loadUser() {
    const res = await fetch("http://localhost:3001/auth/me", {
      credentials: "include"
    });
    const data = await res.json();
    setUser(data.user);
  }
  loadUser();
}, []);

// 로그아웃

const logout = async () => {
  await fetch("http://localhost:3001/auth/logout", {
    method: "POST",
    credentials: "include"
  });
};

