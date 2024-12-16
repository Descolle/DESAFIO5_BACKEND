import express from "express";
import cors from "cors";
import JewelRoutes from "./routes/JewelRoutes.js";

const app = express();
//Middleware setup
app.use(cors());
app.use(express.json());

//Ruta para los posts
app.use(JewelRoutes);

//Inicializa el server
app.listen(3000, console.log("Server online"));
