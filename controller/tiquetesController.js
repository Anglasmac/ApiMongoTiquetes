// Importa el modelo Tiquetes desde el archivo especificado, que define la estructura y operaciones para los tiquetes.
import Tiquetes from '../models/tiquete.js';

// Función para obtener todos los tiquetes de la base de datos.
export async function GetAlltiquetes(req, res) {
    try {
        // Busca todos los documentos en la colección de Tiquetes.
        const tiquetes = await Tiquetes.find();
        // Envía una respuesta con estado 200 y los tiquetes encontrados en formato JSON.
        //200( OK:Indica que la solicitud fue exitosa y que el servidor ha devuelto 
            //la información solicitada)

        res.status(200).json(tiquetes);
    } catch (error) {
        // Si ocurre un error, envía una respuesta con estado 500 y un mensaje de error.
        res.status(500).json({ message: 'Error al obtener los tiquetes', error });
    }//500(Internal Server Error:Indica que ocurrió un error en el servidor al procesar
        // la solicitud.Se utiliza cuando hay un problema inesperado en el servidor, 
        ///como errores de programación o fallos en la base de datos.)
}

// Función para obtener un tiquete específico por su ID.
export async function GetallById(req, res) {
    // Desestructura el ID de los parámetros de la solicitud.
    const { id } = req.params;
    try {
        // Busca un tiquete en la colección por su ID.
        const tiquete = await Tiquetes.findById(id);
        // Si no se encuentra el tiquete, responde con estado 404 y un mensaje de error.
       //404 Not Found: Indica que el recurso solicitado no fue encontrado en el servidor.
        // Se usa cuando se intenta acceder a una URL que no existe, como un ID de recurso que no se encuentra.
        if (!tiquete) {
            return res.status(404).json({ message: 'Tiquete no encontrado' });
        }
        // Si se encuentra, responde con estado 200 y el tiquete en formato JSON.
        res.status(200).json(tiquete);
    } catch (error) {
        // Si ocurre un error, responde con estado 500 y un mensaje de error.
        res.status(500).json({ message: 'Error al obtener el tiquete', error });
    }
}

// Función para contar el total de tiquetes en la base de datos.
export async function countTiquetes(req, res) {
    try {
        // Cuenta todos los documentos en la colección de Tiquetes.
        const count = await Tiquetes.countDocuments();
        // Responde con estado 200 y el total en formato JSON.
        res.status(200).json({ total: count });
    } catch (error) {
        // Registra el error en la consola.
        console.error("Error al contar los tiquetes:", error);
        // Responde con estado 500(Internal Server Error:Indica que ocurrió un error en el servidor al procesar
        // la solicitud.Se utiliza cuando hay un problema inesperado en el servidor, 
        ///como errores de programación o fallos en la base de datos.) y un mensaje de error.
        res.status(500).json({ message: 'Error al contar los tiquetes', error });
    }
}

// Función para obtener tiquetes filtrados por ciudad de origen.
export async function getTiquetesByOrigen(req, res) {
    // Desestructura el origen de los parámetros de la solicitud.
    const { origen } = req.params;
    try {
        // Busca los tiquetes que coinciden con la ciudad de origen especificada.
        const tiquetes = await Tiquetes.find({ origen: origen });

        // Si no se encuentran tiquetes, responde con estado 404 y un mensaje de error.
        if (tiquetes.length === 0) {
            return res.status(404).json({ message: 'No se encontraron tiquetes para la ciudad de origen especificada' });
        }
        // Si se encuentran, responde con estado 200 y los tiquetes en formato JSON.
        res.status(200).json(tiquetes);
    } catch (error) {
        // Registra el error en la consola.
        console.error("Error al obtener los tiquetes por origen:", error);
        // Responde con estado 500 y un mensaje de error.
        res.status(500).json({ message: 'Error al obtener los tiquetes por origen', error });
    }
}

// Función para crear un nuevo tiquete en la base de datos.
export async function createTiquetes(req, res) {
    // Desestructura los datos necesarios del cuerpo de la solicitud.
    const { documento, name, placaVehiculo, origen, destino, valor } = req.body;

    try {
        // Obtiene el siguiente número de tiquete disponible.
        const numeroTiquete = await Tiquetes.getNextNumeroTiquete();

        // Muestra en consola el número de tiquete generado.
        console.log("Número de tiquete generado:", numeroTiquete);

        // Verifica si el número de tiquete es inválido.
        if (numeroTiquete === null || isNaN(numeroTiquete)) {
            return res.status(500).json({ message: 'Error al generar el número de tiquete' });
        }

        // Crea una nueva instancia del modelo Tiquetes con los datos proporcionados.
        const nuevoTiquete = new Tiquetes({
            numeroTiquete,
            documento,
            name,
            placaVehiculo,
            origen,
            destino,
            valor
        });

        // Guarda el nuevo tiquete en la base de datos.
        await nuevoTiquete.save();
        // Responde con estado 201(Created:Indica que una nueva entidad ha sido creada exitosamente 
        //como resultado de una solicitud. Generalmente se utiliza después de una solicitud de POST.
        // Se usa cuando se crea un nuevo recurso, como un nuevo registro en la base de datos.)
        //y un mensaje de éxito junto con el nuevo tiquete.
        res.status(201).json({ message: 'Tiquete creado con éxito', nuevoTiquete });
    } catch (error) {
        // Verifica si el error es por clave duplicada y responde adecuadamente.
        if (error.code && error.code === 11000) {
            return res.status(400).json({ message: 'Error de clave duplicada', error });
        }//400 Bad Request Indica que la solicitud realizada por el cliente es inválida o malformada,
        // y el servidor no puede procesarla.Se utiliza cuando faltan parámetros obligatorios o el
        // formato de los datos no es correcto.

        // Registra el error en la consola.
        console.error("Error al crear el tiquete:", error);
        // Responde con estado 500 y un mensaje de error.
        res.status(500).json({ message: 'Error al crear el tiquete', error });
    }
}

// Función para actualizar un tiquete existente por su ID.
export async function putTiquetes(req, res) {
    // Desestructura el ID de los parámetros de la solicitud.
    const { id } = req.params;
    // Desestructura los datos necesarios del cuerpo de la solicitud.
    const { documento, name, placaVehiculo, origen, destino, valor } = req.body;

    // Validar que el valor no sea negativo.
    if (valor < 0) {
        return res.status(400).json({ message: 'El valor no puede ser negativo' });
        //400 Bad Request Indica que la solicitud realizada por el cliente es inválida o malformada,
        // y el servidor no puede procesarla.Se utiliza cuando faltan parámetros obligatorios o el
        // formato de los datos no es correcto.
    }
    try {
        // Busca el tiquete por ID y lo actualiza con los nuevos datos.
        const tiqueteActualizado = await Tiquetes.findByIdAndUpdate(
            id,
            { documento, name, placaVehiculo, origen, destino, valor },
            { new: true } // Devuelve el tiquete actualizado.
        );

        // Si no se encuentra el tiquete, responde con estado 404(Not Found:Indica que el recurso 
        //solicitado no fue encontrado en el servidor como por ejem una una URL que no existe) y un mensaje de error.
        if (!tiqueteActualizado) {
            return res.status(404).json({ message: 'Tiquete no encontrado' });
        }
        // Responde con estado 200( OK:Indica que la solicitud fue exitosa y que el servidor ha devuelto 
        //la información solicitada) y un mensaje de éxito junto con el tiquete actualizado.
        res.status(200).json({ message: 'Tiquete actualizado con éxito', tiqueteActualizado });
    } catch (error) {
        // Registra el error en la consola.
        console.error("Error al actualizar el tiquete:", error);
        // Responde con estado 500 y un mensaje de error.
        res.status(500).json({ message: 'Error al actualizar el tiquete', error });
    }
}

// Función para eliminar un tiquete existente por su ID.
export async function deleteTiquete(req, res) {
    // Desestructura el ID de los parámetros de la solicitud.
    const { id } = req.params;

    try {
        // Busca el tiquete por ID y lo elimina de la base de datos.
        const tiqueteEliminado = await Tiquetes.findByIdAndDelete(id);

        // Si no se encuentra el tiquete, responde con estado 404 y un mensaje de error.
        if (!tiqueteEliminado) {
            return res.status(404).json({ message: 'Tiquete no encontrado' });
        }
        // Responde con estado 200 y un mensaje de éxito.
        res.status(200).json({ message: 'Tiquete eliminado con éxito' });
    } catch (error) {
        // Registra el error en la consola.
        console.error("Error al eliminar el tiquete:", error);
        // Responde con estado 500 y un mensaje de error.
        res.status(500).json({ message: 'Error al eliminar el tiquete', error });
    }
}
