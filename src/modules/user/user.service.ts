import { pool } from "../../db";
import type { IUser } from "./user.interface";

 const createUserIntoDB = async(payload:IUser)=>{

    const { name, email, password } = payload;

     const result = await pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [name, email, password]);

    return result;


};

const getAllUsersFromDB = async()=>{
     const result = await pool.query(`SELECT * FROM users`);
    return result;
};

const getSingleUserFromDB = async(id:string)=>{
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return result;

};

const updateUserInDB = async(paylod :IUser, id:string)=>{
    const { name, email, password } = paylod;
     const result = await pool.query(`UPDATE users SET
         name = COALESCE($1, name),
         email = COALESCE($2, email),
         password = COALESCE($3, password),
         updated_at = CURRENT_TIMESTAMP WHERE 
         id = $4 RETURNING *`,
          [name, email, password, id]);
    return result;
};

const deleteUserFromDB = async(id:string)=>{
     const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
     return result;
};


export const userService = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateUserInDB,
    deleteUserFromDB
}