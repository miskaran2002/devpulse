import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    // const { name, email, password } = req.body;

    try{
        const result = await userService.createUserIntoDB(req.body);


    res.status(200).json({
        "status": "success",
        "message": "User created successfully!",
        "data": result.rows[0]

    });

    }
    catch(error: any){
        res.status(500).json({
            "status": "error",
            "message": error.message,
            "error": error
        });
    }

   

};

export const userController = {
    createUser
}