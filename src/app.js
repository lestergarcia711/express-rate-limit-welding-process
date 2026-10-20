import express from 'express';
import soldaduraRoutes from './routes/soldaduraRoutes.js';


const app = express();
app.use(express.json());


 app.use('/api/soldadura', soldaduraRoutes);

 const PORT = 3000;
 app.listen(PORT, () =>{
    console.log(`[Servidor] fabrica iniciada en http://localhost:${PORT}`);
    
 })