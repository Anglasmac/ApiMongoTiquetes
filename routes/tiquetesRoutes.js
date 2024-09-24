// Importa el objeto Router desde el paquete express
import { Router } from "express";

// Importa las funciones del controlador que manejan las operaciones CRUD de tiquetes
import { 
  GetAlltiquetes,      // Función para obtener todos los tiquetes
  GetallById,          // Función para obtener un tiquete por ID
  createTiquetes,      // Función para crear un nuevo tiquete
  putTiquetes,         // Función para actualizar un tiquete existente
  deleteTiquete,       // Función para eliminar un tiquete por ID
  getTiquetesByOrigen, // Función para obtener tiquetes filtrados por origen
  countTiquetes        // Función para contar la cantidad total de tiquetes
} from '../controller/tiquetesController.js';

// Importa el modelo de tiquete, que representa la estructura de los tiquetes en la base de datos
import tiquete from "../models/tiquete.js";

// Crea una nueva instancia del enrutador de Express
const tiqueteRouter = Router();

// Define una ruta GET para contar la cantidad de tiquetes y asigna la función countTiquetes como manejador
tiqueteRouter.get('/tiquetes/count', countTiquetes);

// Define una ruta GET para obtener tiquetes filtrados por origen (usando el parámetro :origen) 
tiqueteRouter.get('/tiquetes/:origen', getTiquetesByOrigen);

// Define una ruta GET para obtener todos los tiquetes y asigna la función GetAlltiquetes como manejador
tiqueteRouter.get('/tiquetes', GetAlltiquetes);

// Define una ruta GET para obtener un tiquete específico por ID (usando el parámetro :id)
tiqueteRouter.get('/tiquetes/:id', GetallById);

// Define una ruta POST para crear un nuevo tiquete y asigna la función createTiquetes como manejador
tiqueteRouter.post('/tiquetes', createTiquetes);

// Define una ruta PUT para actualizar un tiquete existente por ID (usando el parámetro :id)
tiqueteRouter.put('/tiquetes/:id', putTiquetes);

// Define una ruta DELETE para eliminar un tiquete específico por ID (usando el parámetro :id)
tiqueteRouter.delete('/tiquetes/:id', deleteTiquete);

// Exporta el enrutador tiqueteRouter para que pueda ser utilizado en otras partes de la aplicación
export default tiqueteRouter;
