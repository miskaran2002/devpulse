import express,
{
    type Application,
    type Request,
    type Response
} from 'express';

import { pool } from './db';
import { userRoute } from './modules/user/user.route';


const app: Application = express()


app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));






// server routes rest api

app.get('/', (req: Request, res: Response) => {

    res.status(200).json({
        "status": "success",
        "message": "WELCOME TO DEV PULSE!!!",
        "author": "MD. RAIHAN UDDIN"
    });
});



app.use('/api/users',userRoute);



// get all users

app.get('/api/users', async (req: Request, res: Response) => {
    try{
        const result = await pool.query(`SELECT * FROM users`);

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
    
}) ;

// get user by id

app.get('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);



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
    
})

// update user by id

app.put('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

   try{

     const result = await pool.query(`UPDATE users SET
         name = COALESCE($1, name),
         email = COALESCE($2, email),
         password = COALESCE($3, password),
         updated_at = CURRENT_TIMESTAMP WHERE 
         id = $4 RETURNING *`,
          [name, email, password, id]);

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

    
})

// delete user by id

app.delete('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try{
        const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);

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
})





export default app;