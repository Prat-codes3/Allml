import { config } from './config.js';
import { app } from './app.js';




async function startserver() {
    app.listen(config.port, () => {
        console.log(`server is running on port ${config.port}`);
    });
}

startserver().catch((err)=>{
    console.log("server starting error : ",err);
});






