import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as jwtModule from "jsonwebtoken";
const jwt: any = (jwtModule as any).default || jwtModule;
const sign = jwt.sign;
const verify = jwt.verify;
import cookieParser from "cookie-parser";
import * as admin from "firebase-admin";
import firebaseConfig from "./firebase-applet-config.json";

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const db = admin.firestore();
// Set the database ID if provided in config
if ((firebaseConfig as any).firestoreDatabaseId && (firebaseConfig as any).firestoreDatabaseId !== '(default)') {
  // Note: In some versions of firebase-admin, you might need to use a different way to set databaseId
  // For now, we assume the default or that projectId is enough for the default database.
}

const JWT_SECRET = process.env.JWT_SECRET || "bridgeway-secret-key-2024";

// Seed data if empty
async function seedData() {
  try {
    const postsCol = db.collection("posts");
    const snapshot = await postsCol.limit(1).get();
    if (snapshot.empty) {
      console.log("Seeding initial posts...");
      await postsCol.add({
        title: "글로벌 공급망 다변화 전략",
        content: "최근 글로벌 공급망의 변화에 따른 대응 전략을 소개합니다.",
        category: "무역 뉴스",
        image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });
      await postsCol.add({
        title: "2024년 수출입 통계 분석",
        content: "올해의 주요 수출입 품목 및 국가별 통계를 분석합니다.",
        category: "공지사항",
        image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seedData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Middleware to verify JWT
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ message: "인증이 필요합니다." });

    verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
      req.user = user;
      next();
    });
  };

  // API Routes
  app.post("/api/admin/login", (req, res) => {
    try {
      console.log("Login request received. Body:", JSON.stringify(req.body));
      const { password } = req.body || {};
      
      if (!password) {
        console.log("No password provided in request body");
        return res.status(400).json({ success: false, message: "비밀번호를 입력해주세요." });
      }

      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      console.log("Comparing passwords...");
      
      if (password === adminPassword) {
        console.log("Password match. Signing token...");
        
        if (typeof sign !== 'function') {
          throw new Error("JWT sign function not found. jwt type: " + typeof jwt);
        }

        const token = sign({ admin: true }, JWT_SECRET, { expiresIn: "24h" });
        
        console.log("Token signed. Setting cookie...");
        res.cookie("admin_token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        console.log("Login successful");
        res.json({ success: true });
      } else {
        console.log("Password mismatch");
        res.status(401).json({ success: false, message: "비밀번호가 일치하지 않습니다." });
      }
    } catch (error) {
      console.error("CRITICAL: Login route error:", error);
      res.status(500).json({ 
        success: false, 
        message: "서버 내부 오류가 발생했습니다.",
        debug: process.env.NODE_ENV !== 'production' ? String(error) : undefined
      });
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

    verify(token, JWT_SECRET, (err: any) => {
      if (err) return res.json({ authenticated: false });
      res.json({ authenticated: true });
    });
  });

  app.get("/api/posts", async (req, res) => {
    try {
      const snapshot = await db.collection("posts").orderBy("created_at", "desc").get();
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.() || doc.data().created_at
      }));
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "게시글을 불러오는 중 오류가 발생했습니다." });
    }
  });

  // Consultation Routes
  app.post("/api/consultations", async (req, res) => {
    try {
      const { title, contact, email, content } = req.body;
      if (!title || !contact || !email || !content) {
        return res.status(400).json({ message: "모든 필드를 입력해주세요." });
      }
      const docRef = await db.collection("consultations").add({
        title,
        contact,
        email,
        content,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });
      res.json({ id: docRef.id });
    } catch (error) {
      console.error("Error creating consultation:", error);
      res.status(500).json({ message: "상담 신청 중 오류가 발생했습니다." });
    }
  });

  app.get("/api/consultations", authenticateToken, async (req, res) => {
    try {
      const snapshot = await db.collection("consultations").orderBy("created_at", "desc").get();
      const consultations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.() || doc.data().created_at
      }));
      res.json(consultations);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      res.status(500).json({ message: "상담 내역을 불러오는 중 오류가 발생했습니다." });
    }
  });

  app.delete("/api/consultations/:id", authenticateToken, async (req, res) => {
    try {
      await db.collection("consultations").doc(req.params.id).delete();
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting consultation:", error);
      res.status(500).json({ message: "상담 내역 삭제 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/posts", authenticateToken, async (req, res) => {
    try {
      const { title, content, category, image_url } = req.body;
      const docRef = await db.collection("posts").add({
        title,
        content,
        category,
        image_url,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });
      res.json({ id: docRef.id });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "게시글 작성 중 오류가 발생했습니다." });
    }
  });

  app.delete("/api/posts/:id", authenticateToken, async (req, res) => {
    try {
      await db.collection("posts").doc(req.params.id).delete();
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "게시글 삭제 중 오류가 발생했습니다." });
    }
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
