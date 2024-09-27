import { Router } from "express";
import { 
  GetAlltiquetes, 
  GetallById, 
  createTiquetes, 
  putTiquetes, 
  deleteTiquete, 
  getTotalValor,
  getTiquetesByOrigen, 
  countTiquetes 
} from '../controller/tiquetesController.js';

const tiqueteRouter = Router();

// Ruta para obtener la suma total de los valores de todos los tiquetes
tiqueteRouter.get('/tiquetes/total', getTotalValor);

// Ruta para contar el total de tiquetes
tiqueteRouter.get('/tiquetes/count', countTiquetes);

// Ruta para obtener tiquetes filtrados por ciudad de origen
tiqueteRouter.get('/tiquetes/origen/:origen', getTiquetesByOrigen);

// Ruta para obtener todos los tiquetes
tiqueteRouter.get('/tiquetes', GetAlltiquetes);

// Ruta para obtener un tiquete específico por su ID
tiqueteRouter.get('/tiquetes/:id', GetallById);

// Ruta para crear un nuevo tiquete
tiqueteRouter.post('/tiquetes', createTiquetes);

// Ruta para actualizar un tiquete existente por su ID
tiqueteRouter.put('/tiquetes/:id', putTiquetes);

// Ruta para eliminar un tiquete existente por su ID
tiqueteRouter.delete('/tiquetes/:id', deleteTiquete);

export default tiqueteRouter;
