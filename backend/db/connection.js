import mysql from "mysql2/promise";


export const db = mysql.createPool({
  host: "127.0.0.1",
  user: "wl",
  password: "1234",
  database: "weather_loop",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function testConnection() {
  try {
    const [rows] = await db.query("SELECT 1+1 as result")
    return rows
  } catch (err) {
    console.error('DB connection test failed:', err && err.message ? err.message : err)
    throw err
  }
}
