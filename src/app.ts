import express,
{
    type Application,
    type Request,
    type Response
} from 'express';

import { issueRoute } from './modules/issue/issue.route';
import { authRoute } from './modules/auth/auth.route';

import fs from 'fs';


const app: Application = express()


app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));




app.use((req, res, next) => {

    console.log("Method -- Time --url:", req.method, Date.now(), req.url);

    
    const log = `${req.method} -- ${Date.now()} -- ${req.url}\n`;

    fs.appendFile('server.log', log, (err) => {
        if (err) {
            console.log("Error writing to log file:", err);
        }
    });

    
    next();

}

);









app.get('/', (req: Request, res: Response) => {

    res.status(200).json({
        "status": "success",
        "message": "WELCOME TO DEV PULSE!!!",
        "author": "MD. RAIHAN UDDIN"
    });
});




app.use('/api/issues',issueRoute);
app.use('/api/auth',authRoute);























export default app;