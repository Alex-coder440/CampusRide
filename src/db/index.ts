import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

let pool: any = null;

if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
}

export const query = async (text: string, params?: any[]) => {
  if (!pool) {
    throw new Error("DATABASE_URL is not configured correctly. Please add a valid PostgreSQL connection string starting with 'postgres' to your environment variables.");
  }
  return pool.query(text, params);
};

export const initDB = async () => {
  if (!pool) {
    console.warn("⚠️ Skipping database initialization: DATABASE_URL is missing or invalid. Please configure it in your Render settings or .env file.");
    return;
  }
  const initSql = `
    CREATE TABLE IF NOT EXISTS Accounts (
        AccountID SERIAL PRIMARY KEY,
        Name VARCHAR(255),
        Email VARCHAR(255) UNIQUE NOT NULL,
        Verified BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS Students (
        MatricNumber VARCHAR(100) PRIMARY KEY,
        FirstName VARCHAR(100),
        LastName VARCHAR(100),
        Email VARCHAR(100) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Drivers (
        DriverID SERIAL PRIMARY KEY,
        FullName VARCHAR(100),
        ShuttleNo VARCHAR(100) UNIQUE,
        Email VARCHAR(100) UNIQUE,
        Role VARCHAR(50) DEFAULT 'Driver'
    );

    CREATE TABLE IF NOT EXISTS Admins (
        AdminID SERIAL PRIMARY KEY,
        FullName VARCHAR(100),
        Email VARCHAR(100) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS PostedRides (
        PostID SERIAL PRIMARY KEY,
        Seats INT NOT NULL,
        Location VARCHAR(255) NOT NULL,
        Completed BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS BookedRides (
        BookingID SERIAL PRIMARY KEY,
        Driver VARCHAR(255),
        Seats INT NOT NULL,
        Time VARCHAR(255) NOT NULL,
        Location VARCHAR(255) NOT NULL,
        Destination VARCHAR(255) NOT NULL,
        Amount VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS Appeals (
        AppealID SERIAL PRIMARY KEY,
        Name VARCHAR(255) NOT NULL,
        Type VARCHAR(100) NOT NULL,
        Approved BOOLEAN DEFAULT FALSE
    );

    -- Safe alters for any previously created tables
    ALTER TABLE BookedRides ADD COLUMN IF NOT EXISTS Driver VARCHAR(255);
    ALTER TABLE BookedRides ALTER COLUMN MatricNumber DROP NOT NULL;
    ALTER TABLE BookedRides ALTER COLUMN DriverID DROP NOT NULL;
    ALTER TABLE BookedRides ALTER COLUMN Amount TYPE VARCHAR(255);
    
    ALTER TABLE PostedRides ALTER COLUMN DriverID DROP NOT NULL;
    ALTER TABLE Accounts ADD COLUMN IF NOT EXISTS Verified BOOLEAN DEFAULT FALSE;
    ALTER TABLE Appeals ADD COLUMN IF NOT EXISTS Approved BOOLEAN DEFAULT FALSE;
  `;
  try {
    await pool.query(initSql);
    console.log("Database initialized successfully.");
  } catch (err: any) {
    if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') {
       console.warn("⚠️ Database initialization skipped: Could not resolve database host. This is expected in local dev.");
    } else {
       console.error("Error initializing database:", err);
    }
  }
};
