import { Router } from "express";
import {GetAlltiquetes,GetallById,createTiquetes,putTiquetes,deleteTiquete,getTiquetesByOrigen,countTiquetes} from '../controller/tiquetesController.js'
import tiquete from "../models/tiquete.js";


const tiqueteRouter = Router();
tiqueteRouter.get('/tiquetes/count', countTiquetes);
tiqueteRouter.get('/tiquetes/:origen',getTiquetesByOrigen)
tiqueteRouter.get('/tiquetes', GetAlltiquetes,);
tiqueteRouter.get('/tiquetes/:id' ,GetallById);
tiqueteRouter.post('/tiquetes',createTiquetes);
tiqueteRouter.put('/tiquetes/:id',putTiquetes);
tiqueteRouter.delete('/tiquetes/:id',deleteTiquete);


export default tiqueteRouter;

