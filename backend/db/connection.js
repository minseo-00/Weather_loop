import mysql from "mysql2/promise";


export const db = mysql.createPool({
  host: "localhost",
  user: "wl",
  password: "1234",
  database: "weather_loop",
  port: 3306
});
