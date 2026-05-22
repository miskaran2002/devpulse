import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {

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

const getAllUsers =  async (req: Request, res: Response) => {
    try{
        const result = await userService.getAllUsersFromDB();

        res.status(200).json({
            "status": "success",
            "message": "Users retrieved successfully!",
            "data": result.rows
        });
    }catch(error: any){
        res.status(500).json({
            "status": "error",
            "message": error.message,
            "error": error
        });
    }
    
};

const getSingleUser =async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        const result = await userService.getSingleUserFromDB(id as string);



    if(result.rows.length === 0){
        return res.status(404).json({
            "success": false,
            "status": "error",
            "message": "User not found!"
        });
        
    }




       res.status(200).json({
        "status": "success",
        "message": "User retrieved successfully!",
        "data": result.rows[0]
    });

    } catch(error: any){
        res.status(500).json({
            "status": "error",
            "message": error.message,
            "error": error
        });
    }
    
}

const updateUser =  async (req: Request, res: Response) => {
    const { id } = req.params;
   

   try{

    const result =await userService.  updateUserInDB(req.body, id as string);

        if(result.rows.length === 0){


            return res.status(404).json({
                "status": "error",
                "message": "User not found!"
            });

        }

     


    res.status(200).json({
        "status": "success",
        "message": "User updated successfully!",
        "data": result.rows[0]
    });


   } catch(error: any){
    res.status(500).json({
        "status": "error",
        "message": error.message,
        "error": error
    });
       
   }

    
}

const deleteUser =  async (req: Request, res: Response) => {
    const { id } = req.params;

    try{
        const result = await userService.deleteUserFromDB(id as string);

        if(result.rows.length === 0){
            return res.status(404).json({
                "status": "error",
                "message": "User not found!"
            });
        }

        res.status(200).json({
            "status": "success",
            "message": "User deleted successfully!",
            "data": result.rows[0]
        })
        
        
    } catch(error: any){
        res.status(500).json({
            "status": "error",  
            "message": error.message,
            "error": error
        });
    }
}



export const userController = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
  
}