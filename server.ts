import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createServer as createHttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
import cors from "cors";
import { google } from "googleapis";

dotenv.config();

let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI", e);
}

// Google Sheets API setup
function getSheetsClient() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON || !process.env.SPREADSHEET_ID) {
    throw new Error('Google Sheets credentials are not configured');
  }

  let credentials;
  try {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  } catch (err) {
    throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_JSON format');
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
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

  app.get("/api/sheets", async (req, res): Promise<any> => {
    try {
      const sheets = getSheetsClient();
      const spreadsheetId = process.env.SPREADSHEET_ID;
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A1:D100', // adjust this as needed
      });
      res.json(response.data.values || []);
    } catch (error: any) {
      console.error("Google Sheets GET Error:", error);
      res.status(500).json({ error: "Failed to fetch from Google Sheets", details: error.message });
    }
  });

  app.post("/api/sheets", async (req, res): Promise<any> => {
    try {
      const { data, sheetName, updateKey } = req.body;
      if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: "Valid data array is required" });
      }

      const sheets = getSheetsClient();
      const spreadsheetId = process.env.SPREADSHEET_ID;
      const targetSheet = sheetName || 'Sheet1';
      
      if (updateKey) {
        // Fetch existing data to find the row
        const getRes = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${targetSheet}!A:Z`,
        });
        const rows = getRes.data.values || [];
        
        let rowIndex = -1;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].includes(updateKey)) {
            rowIndex = i;
            break;
          }
        }

        if (rowIndex !== -1) {
          // Merge existing row with new data
          const existingRowText = rows[rowIndex];
          const newRowText = [...existingRowText];
          for (let col = 0; col < data.length; col++) {
            if (data[col] !== undefined && data[col] !== null && data[col] !== '') {
               newRowText[col] = data[col]; // Overwrite with new data if provided
            }
          }
          
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${targetSheet}!A${rowIndex + 1}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [newRowText] }
          });
          
          return res.json({ success: true, message: 'Row updated successfully' });
        }
      }
      
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${targetSheet}!A:A`, // dynamic sheet name
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [data],
        },
      });

      res.json({ success: true, message: 'Row appended successfully', response: response.data });
    } catch (error: any) {
      console.error("Google Sheets POST Error:", error);
      res.status(500).json({ error: "Failed to append to Google Sheets", details: error.message });
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
