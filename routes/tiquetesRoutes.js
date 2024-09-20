import { Router } from "express";
import {GetAlltiquetes,GetallById,createTiquetes,putTiquetes,deleteTiquete} from '../controller/tiquetesController.js'


const tiqueteRouter = Router();

tiqueteRouter.get('/tiquetes', GetAlltiquetes);
tiqueteRouter.get('/tiquetes/:id' ,GetallById);
tiqueteRouter.post('/tiquetes',createTiquetes);
tiqueteRouter.put('/tiquetes/:id',putTiquetes);
tiqueteRouter.delete('/tiquetes/:id',deleteTiquete);


export default tiqueteRouter;

