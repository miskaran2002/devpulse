import express,
{
    type Application,
    type Request,
    type Response
} from 'express'
import { Pool } from 'pg'
import config from './config';


const app: Application = express()
const port = config.port;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));



const pool = new Pool({
    connectionString: config.conncction_string,

});

const initDB = async () => {
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

initDB();

// server routes rest api

app.get('/', (req: Request, res: Response) => {

    res.status(200).json({
        "status": "success",
        "message": "WELCOME TO DEV PULSE!!!",
        "author": "MD. RAIHAN UDDIN"
    });
});



// create user
app.post('/api/users', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try{
         const result = await pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [name, email, password]);



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

   

});

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





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})