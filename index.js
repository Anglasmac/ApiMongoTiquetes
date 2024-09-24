// importa la clase Server desde el archivo server.js ubicado en 
//la carpeta models. El uso de la palabra clave import permite acceder a funcionalidades 
//definidas en otros archivos. En este caso, se espera que el archivo server.js exporte una
// clase o módulo llamado Server.

import Server from "./models/server.js";

const server = new Server();