import express,
{
    type Application,
    type Request,
    type Response
} from 'express';

import { issueRoute } from './modules/issue/issue.route';
import { authRoute } from './modules/auth/auth.route';
import cors from 'cors';
import logger from './modules/middleware/logger';
import globalErrorHandler from './modules/middleware/golbalErrorHandler';

const app: Application = express();
const corsOptions = {
    origin: 'http://localhost:3000',

}

app.use(cors(corsOptions));





app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger);


app.get('/', (req: Request, res: Response) => {

    res.status(200).json({
        "status": "success",
        "message": "WELCOME TO DEV PULSE!!!",
        "author": "MD. RAIHAN UDDIN"
    });
});




app.use('/api/issues', issueRoute);
app.use('/api/auth', authRoute);

app.use(globalErrorHandler);























export default app;