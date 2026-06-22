import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let pool: Pool | null = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
}

const checkPool = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!pool) {
    return res.status(500).json({ error: "DATABASE_URL is not set" });
  }
  next();
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: !!pool });
});

// --- 1. Accounts ---
app.post('/api/accounts', checkPool, async (req, res) => {
  const { Name, Email, Verified = false } = req.body;
  try {
    const result = await pool!.query(
      'INSERT INTO Accounts (Name, Email, Verified) VALUES ($1, $2, $3) RETURNING *',
      [Name, Email, Verified]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.get('/api/accounts', checkPool, async (req, res) => {
  try {
    const result = await pool!.query('SELECT * FROM Accounts');
    res.json(result.rows);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.get('/api/accounts/:id', checkPool, async (req, res) => {
  try {
    const result = await pool!.query('SELECT * FROM Accounts WHERE AccountID = $1', [req.params.id]);
    res.json(result.rows[0] || {});
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.put('/api/accounts/:id', checkPool, async (req, res) => {
  const { Name, Email, Verified } = req.body;
  try {
    const result = await pool!.query(
      'UPDATE Accounts SET Name = $1, Email = $2, Verified = $3 WHERE AccountID = $4 RETURNING *',
      [Name, Email, Verified, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/accounts/:id', checkPool, async (req, res) => {
  try {
    await pool!.query('DELETE FROM Accounts WHERE AccountID = $1', [req.params.id]);
    res.status(204).send();
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// --- 2. Students ---
app.post('/api/students', checkPool, async (req, res) => {
  const { MatricNumber, FirstName, LastName, Email } = req.body;
  try {
    const result = await pool!.query(
      'INSERT INTO Students (MatricNumber, FirstName, LastName, Email) VALUES ($1, $2, $3, $4) RETURNING *',
      [MatricNumber, FirstName, LastName, Email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.get('/api/students', checkPool, async (req, res) => {
  try {
    const result = await pool!.query('SELECT * FROM Students');
    res.json(result.rows);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.get('/api/students/:id', checkPool, async (req, res) => {
  try {
    const result = await pool!.query('SELECT * FROM Students WHERE MatricNumber = $1', [req.params.id]);
    res.json(result.rows[0] || {});
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.put('/api/students/:id', checkPool, async (req, res) => {
  const { FirstName, LastName, Email } = req.body;
  try {
    const result = await pool!.query(
      'UPDATE Students SET FirstName = $1, LastName = $2, Email = $3 WHERE MatricNumber = $4 RETURNING *',
      [FirstName, LastName, Email, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/students/:id', checkPool, async (req, res) => {
  try {
    await pool!.query('DELETE FROM Students WHERE MatricNumber = $1', [req.params.id]);
    res.status(204).send();
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// --- 3. Drivers ---
app.post('/api/drivers', checkPool, async (req, res) => {
  const { FullName, ShuttleNo, Email, Role = 'Driver' } = req.body;
  try {
    const result = await pool!.query(
      'INSERT INTO Drivers (FullName, ShuttleNo, Email, Role) VALUES ($1, $2, $3, $4) RETURNING *',
      [FullName, ShuttleNo, Email, Role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.get('/api/drivers', checkPool, async (req, res) => {
  try {
    const result = await pool!.query('SELECT * FROM Drivers');
    res.json(result.rows);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.get('/api/drivers/:id', checkPool, async (req, res) => {
  try {
    const result = await pool!.query('SELECT * FROM Drivers WHERE DriverID = $1', [req.params.id]);
    res.json(result.rows[0] || {});
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.put('/api/drivers/:id', checkPool, async (req, res) => {
  const { FullName, ShuttleNo, Email, Role } = req.body;
  try {
    const result = await pool!.query(
      'UPDATE Drivers SET FullName = $1, ShuttleNo = $2, Email = $3, Role = $4 WHERE DriverID = $5 RETURNING *',
      [FullName, ShuttleNo, Email, Role, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/drivers/:id', checkPool, async (req, res) => {
  try {
    await pool!.query('DELETE FROM Drivers WHERE DriverID = $1', [req.params.id]);
    res.status(204).send();
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// --- 4. Admins ---
app.post('/api/admins', checkPool, async (req, res) => {
  const { FullName, Email } = req.body;
  try {
    const result = await pool!.query(
      'INSERT INTO Admins (FullName, Email) VALUES ($1, $2) RETURNING *',
      [FullName, Email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.get('/api/admins', checkPool, async (req, res) => {
  try {
    const result = await pool!.query('SELECT * FROM Admins');
    res.json(result.rows);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.get('/api/admins/:id', checkPool, async (req, res) => {
  try {
    const result = await pool!.query('SELECT * FROM Admins WHERE AdminID = $1', [req.params.id]);
    res.json(result.rows[0] || {});
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.put('/api/admins/:id', checkPool, async (req, res) => {
  const { FullName, Email } = req.body;
  try {
    const result = await pool!.query(
      'UPDATE Admins SET FullName = $1, Email = $2 WHERE AdminID = $3 RETURNING *',
      [FullName, Email, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/admins/:id', checkPool, async (req, res) => {
  try {
    await pool!.query('DELETE FROM Admins WHERE AdminID = $1', [req.params.id]);
    res.status(204).send();
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// --- 5. Posted Rides ---
app.post('/api/posted-rides', checkPool, async (req, res) => {
  const { DriverID, Seats, Location, Completed = false } = req.body;
  try {
    const result = await pool!.query(
      'INSERT INTO PostedRides (DriverID, Seats, Location, Completed) VALUES ($1, $2, $3, $4) RETURNING *',
      [DriverID, Seats, Location, Completed]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.get('/api/posted-rides', checkPool, async (req, res) => {
  try {
    const result = await pool!.query('SELECT * FROM PostedRides');
    res.json(result.rows);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.get('/api/posted-rides/:id', checkPool, async (req, res) => {
  try {
    const result = await pool!.query('SELECT * FROM PostedRides WHERE PostID = $1', [req.params.id]);
    res.json(result.rows[0] || {});
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.put('/api/posted-rides/:id', checkPool, async (req, res) => {
  const { DriverID, Seats, Location, Completed } = req.body;
  try {
    const result = await pool!.query(
      'UPDATE PostedRides SET DriverID = $1, Seats = $2, Location = $3, Completed = $4 WHERE PostID = $5 RETURNING *',
      [DriverID, Seats, Location, Completed, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/posted-rides/:id', checkPool, async (req, res) => {
  try {
    await pool!.query('DELETE FROM PostedRides WHERE PostID = $1', [req.params.id]);
    res.status(204).send();
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// --- 6. Booked Rides ---
app.post('/api/booked-rides', checkPool, async (req, res) => {
  const { MatricNumber, DriverID, Seats, Time, Location, Destination, Amount } = req.body;
  try {
    const result = await pool!.query(
      'INSERT INTO BookedRides (MatricNumber, DriverID, Seats, Time, Location, Destination, Amount) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [MatricNumber, DriverID, Seats, Time, Location, Destination, Amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.get('/api/booked-rides', checkPool, async (req, res) => {
  try {
    const result = await pool!.query('SELECT * FROM BookedRides');
    res.json(result.rows);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.get('/api/booked-rides/:id', checkPool, async (req, res) => {
  try {
    const result = await pool!.query('SELECT * FROM BookedRides WHERE BookingID = $1', [req.params.id]);
    res.json(result.rows[0] || {});
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.put('/api/booked-rides/:id', checkPool, async (req, res) => {
  const { MatricNumber, DriverID, Seats, Time, Location, Destination, Amount } = req.body;
  try {
    const result = await pool!.query(
      'UPDATE BookedRides SET MatricNumber = $1, DriverID = $2, Seats = $3, Time = $4, Location = $5, Destination = $6, Amount = $7 WHERE BookingID = $8 RETURNING *',
      [MatricNumber, DriverID, Seats, Time, Location, Destination, Amount, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/booked-rides/:id', checkPool, async (req, res) => {
  try {
    await pool!.query('DELETE FROM BookedRides WHERE BookingID = $1', [req.params.id]);
    res.status(204).send();
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// --- 7. Appeals ---
app.post('/api/appeals', checkPool, async (req, res) => {
  const { Name, Type, Approved = false } = req.body;
  try {
    const result = await pool!.query(
      'INSERT INTO Appeals (Name, Type, Approved) VALUES ($1, $2, $3) RETURNING *',
      [Name, Type, Approved]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.get('/api/appeals', checkPool, async (req, res) => {
  try {
    const result = await pool!.query('SELECT * FROM Appeals');
    res.json(result.rows);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.get('/api/appeals/:id', checkPool, async (req, res) => {
  try {
    const result = await pool!.query('SELECT * FROM Appeals WHERE AppealID = $1', [req.params.id]);
    res.json(result.rows[0] || {});
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.put('/api/appeals/:id', checkPool, async (req, res) => {
  const { Name, Type, Approved } = req.body;
  try {
    const result = await pool!.query(
      'UPDATE Appeals SET Name = $1, Type = $2, Approved = $3 WHERE AppealID = $4 RETURNING *',
      [Name, Type, Approved, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/appeals/:id', checkPool, async (req, res) => {
  try {
    await pool!.query('DELETE FROM Appeals WHERE AppealID = $1', [req.params.id]);
    res.status(204).send();
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    import('vite').then(async ({ createServer }) => {
      const vite = await createServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    }).catch(console.error);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

startServer();
