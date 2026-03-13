import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const db = new Database("database.sqlite");
const JWT_SECRET = process.env.JWT_SECRET || "bridgeway-secret-key-2024";

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    contact TEXT NOT NULL,
    email TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM posts").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare("INSERT INTO posts (title, content, category, image_url) VALUES (?, ?, ?, ?)");
  insert.run("글로벌 공급망 다변화 전략", "최근 글로벌 공급망의 변화에 따른 대응 전략을 소개합니다.", "무역 뉴스", "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800");
  insert.run("2024년 수출입 통계 분석", "올해의 주요 수출입 품목 및 국가별 통계를 분석합니다.", "공지사항", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Middleware to verify JWT
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ message: "인증이 필요합니다." });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
      req.user = user;
      next();
    });
  };

  // API Routes
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    if (password === adminPassword) {
      const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "24h" });
      
      res.cookie("admin_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "비밀번호가 일치하지 않습니다." });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    res.clearCookie("admin_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    res.json({ success: true });
  });

  app.get("/api/admin/check", (req, res) => {
    const token = req.cookies.admin_token;
    if (!token) return res.json({ authenticated: false });

    jwt.verify(token, JWT_SECRET, (err: any) => {
      if (err) return res.json({ authenticated: false });
      res.json({ authenticated: true });
    });
  });

  app.get("/api/posts", (req, res) => {
    const posts = db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
    res.json(posts);
  });

  // Consultation Routes
  app.post("/api/consultations", (req, res) => {
    const { title, contact, email, content } = req.body;
    if (!title || !contact || !email || !content) {
      return res.status(400).json({ message: "모든 필드를 입력해주세요." });
    }
    const info = db.prepare("INSERT INTO consultations (title, contact, email, content) VALUES (?, ?, ?, ?)").run(title, contact, email, content);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/consultations", authenticateToken, (req, res) => {
    const consultations = db.prepare("SELECT * FROM consultations ORDER BY created_at DESC").all();
    res.json(consultations);
  });

  app.delete("/api/consultations/:id", authenticateToken, (req, res) => {
    db.prepare("DELETE FROM consultations WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/posts", authenticateToken, (req, res) => {
    const { title, content, category, image_url } = req.body;
    const info = db.prepare("INSERT INTO posts (title, content, category, image_url) VALUES (?, ?, ?, ?)").run(title, content, category, image_url);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/posts/:id", authenticateToken, (req, res) => {
    db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
