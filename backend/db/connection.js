import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",     // HeidiSQL에서 접속한 host 그대로
  user: "wl",           // MariaDB 사용자명
  password: "1234",   // 그 사용자 비번
  database: "weather_loop",     // 실제 DB 이름
  port: 3306              // MariaDB 기본 포트
});