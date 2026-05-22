import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

// SIGNUP
router.post("/signup", authController.registerUser);

// LOGIN
router.post("/login", authController.loginUser);

export const authRoute = router;