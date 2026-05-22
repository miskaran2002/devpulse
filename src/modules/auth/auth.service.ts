import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";
import type { XUser } from "./auth.interface";

/* =========================
   SIGNUP
========================= */
const registerUserIntoDB = async (payload: XUser) => {
  const { name, email, password, role } = payload;

  // check exists
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existingUser && existingUser.rows.length > 0) {
  throw new Error("User already exists");
}
  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, role || "contributor"]
  );

  return result.rows[0];
};

/* =========================
   LOGIN
========================= */
const loginUserIntoDB = async (payload: XUser) => {
  const { email, password } = payload;

  const userData = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (userData.rowCount === 0) {
    throw new Error("Invalid email or password");
  }

  const user = userData.rows[0];

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new Error("Invalid email or password");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    
  };

  const token = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "1h",
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
};

export const authService = {
  registerUserIntoDB,
  loginUserIntoDB,
};