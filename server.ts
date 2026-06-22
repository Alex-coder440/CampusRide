import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createServer as createHttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
import cors from "cors";

dotenv.config();

let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI", e);
}

// In-memory array of rides
let rides: any[] = [];
let users: any[] = [];
let welfareApps: any[] = [];
let exeatApps: any[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(cors());
  app.use(express.json());

  const httpServer = createHttpServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    
    // Send initial state to the connecting client
    socket.emit("rides:init", rides);
    socket.emit("users:init", users);
    socket.emit("welfare:init", welfareApps);
    socket.emit("exeat:init", exeatApps);

    socket.on("rides:add", (ride) => {
      rides.push(ride);
      io.emit("rides:updated", rides);
    });

    socket.on("rides:book", ({ rideId, seats, user, destination, time, pickup }) => {
      rides = rides.map(r => {
        if (r.id === rideId && r.seats >= seats) {
          return {
            ...r,
            seats: r.seats - seats,
            passengers: [
              ...r.passengers,
              ...Array(seats).fill(null).map(() => ({ 
                id: user.id, 
                name: user.name, 
                destination, 
                time, 
                pickup: pickup || r.from 
              }))
            ]
          };
        }
        return r;
      });
      io.emit("rides:updated", rides);
    });

    socket.on("rides:updateStatus", ({ rideId, status }) => {
      rides = rides.map(r => r.id === rideId ? { ...r, status } : r);
      io.emit("rides:updated", rides);
    });

    socket.on("users:add", (user) => {
      users.push(user);
      io.emit("users:updated", users);
    });

    socket.on("users:update", (updatedUser) => {
      users = users.map(u => u.id === updatedUser.id ? updatedUser : u);
      io.emit("users:updated", users);
    });

    socket.on("welfare:submit", (app) => {
      welfareApps = [...welfareApps.filter(a => a.id !== app.id), app];
      io.emit("welfare:updated", welfareApps);
    });

    socket.on("exeat:submit", (app) => {
      exeatApps = [...exeatApps.filter(a => a.id !== app.id), app];
      io.emit("exeat:updated", exeatApps);
    });

    socket.on("welfare:updateStatus", ({ id, status }) => {
      welfareApps = welfareApps.map(a => a.id === id ? { ...a, status } : a);
      io.emit("welfare:updated", welfareApps);
    });

    socket.on("exeat:updateStatus", ({ id, status }) => {
      exeatApps = exeatApps.map(a => a.id === id ? { ...a, status } : a);
      io.emit("exeat:updated", exeatApps);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/rides", (req, res) => {
    res.json(rides);
  });

  app.post("/api/prompt", async (req, res): Promise<any> => {
    try {
      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: "Prompt is required" });
      if (!ai) return res.status(500).json({ error: "GenAI key not configured" });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error("GenAI Error:", error);
      res.status(500).json({ error: "Something went wrong", details: error.message });
    }
  });

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

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
