import dotenv from 'dotenv'

import { app } from "./app.js";
import { connectDB } from "./db/index.js";

dotenv.config({
    path: './config.env'
})

await connectDB().then(() => {
    app.on('error', (err) => {
        console.log('ERROR::', err)
        throw err;
    });
}).catch(error => {
    console.log('Mongodb connection failed',error)
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log('App is listening at port', PORT)
})