import express from "express";
import dbConnection from "../config/database.js";
import "dotenv/config";
import morgan from "morgan";
import tiqueteRouter from "../routes/tiquetesRoutes.js";



export default class Server {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.dbconnection();
    this.app.use(morgan("dev"));
    this.routes();
    this.listen();
  }
  async dbconnection() {
    try {
      await dbConnection();
      console.log("Database connected");
    } catch (error) {
      console.log("Error connecting to database");
      console.log(error);
    }
  }

 
  routes(){
    this.app.use('/api',tiqueteRouter)

  }

  listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  }
}
