import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/api';
import cors from "cors"
import db from './utils/database';
import docs from './docs/route';
import errorMiddleware from './middleware/error.middleware';

async function init() {
    try {

        const result = await db();
        console.log("status database: " + result);

        const app = express();
        const PORT = 5555;

        app.get('/', (req, res) => {
            res.status(200).json({
                message: "Server is Running",
                data: null
            })
        })

        app.use(cors())

        app.use(bodyParser.json());
        app.use('/api', router);
        docs(app)

        app.use(errorMiddleware.serverRoute());
        app.use(errorMiddleware.serverError());

        app.listen(PORT, () => {
            console.log(`Server running on port http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

init()