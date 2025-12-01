// 회원가입
const register = async () => {
  await fetch("http://localhost:3001/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id,
      password,
      nickname,
      phone_number,
      local
    })
  });
};

// login
const login = async () => {
  const res = await fetch("http://localhost:3001/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id,
      password
    })
  });

  const data = await res.json();
  console.log(data);
};


//로그인 상태 유지 

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

