import express,
{
    type Application,
    type Request,
    type Response
} from 'express';

import { issueRoute } from './modules/issue/issue.route';
import { authRoute } from './modules/auth/auth.route';


const app: Application = express()


app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

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