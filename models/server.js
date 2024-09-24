// Importa el módulo 'express' para crear un servidor web
import express from "express";
// Importa la configuración de la base de datos desde el archivo correspondiente
import dbConnection from "../config/database.js";
// Importa las variables de entorno definidas en un archivo .env
import "dotenv/config";
// Importa el middleware 'morgan' para registrar las solicitudes HTTP
import morgan from "morgan";
// Importa las rutas para manejar las operaciones relacionadas con tiquetes
import tiqueteRouter from "../routes/tiquetesRoutes.js";

// Exporta la clase 'Server' como un módulo
export default class Server {
  // Constructor de la clase 'Server'
  constructor() {
    // Inicializa una nueva aplicación express
    this.app = express();
    // Configura express para que use JSON en las solicitudes
    this.app.use(express.json());
    // Llama al método para establecer la conexión con la base de datos
    this.dbconnection();
    // Configura el middleware 'morgan' para registrar las solicitudes en modo 'dev'
    this.app.use(morgan("dev"));
    // Llama al método que configura las rutas de la aplicación
    this.routes();
    // Llama al método para iniciar el servidor y escuchar solicitudes
    this.listen();
  }

  // Método asíncrono para establecer la conexión con la base de datos
  async dbconnection() {
    try {
      // Intenta conectar a la base de datos
      await dbConnection();
      // Si la conexión es exitosa, muestra un mensaje en la consola
      console.log("Database connected");
    } catch (error) {
      // Si ocurre un error al conectar, muestra un mensaje en la consola
      console.log("Error connecting to database");
      // Muestra el error en la consola
      console.log(error);
    }
  }

  // Método para definir las rutas de la aplicación
  routes() {
    // Configura la ruta base '/api' y utiliza el router de tiquetes
    this.app.use('/api', tiqueteRouter);
  }

  // Método para iniciar el servidor
  listen() {
    // Hace que la aplicación escuche en el puerto especificado en las variables de entorno
    this.app.listen(process.env.PORT, () => {
      // Muestra un mensaje en la consola indicando que el servidor está en ejecución
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  }
}
