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






















export default app;