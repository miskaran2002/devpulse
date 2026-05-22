import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
    connectionString: config.connection_string,

});

export const initDB = async () => {
    try {
        await pool.query(`
     CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
     role VARCHAR(20) NOT NULL DEFAULT 'contributor',

       CONSTRAINT valid_role CHECK (
          role IN ('contributor', 'maintainer')
        ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

await pool.query(`
    CREATE TABLE IF NOT EXISTS issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'open',
    reporter_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_type CHECK (
          type IN ('bug', 'feature_request')
        ),

        CONSTRAINT valid_status CHECK (
          status IN ('open', 'in_progress', 'resolved')
        ),

        CONSTRAINT valid_description CHECK (
          LENGTH(description) >= 20
        )

  
  );

    `)






        console.log("Database initialized successfully!");
    } catch (error) {
        console.log(error);
    }

};
