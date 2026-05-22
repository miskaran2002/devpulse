import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
    connectionString: config.conncction_string,

});

export const initDB = async () => {
    try {
        await pool.query(`
     CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
        console.log("Database initialized successfully!");
    } catch (error) {
        console.log(error);
    }

};
