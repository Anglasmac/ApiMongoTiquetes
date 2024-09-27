import Tiquetes from '../models/tiquete.js';

// Función para obtener todos los tiquetes de la base de datos.
export async function GetAlltiquetes(req, res) {
    try {
        const tiquetes = await Tiquetes.find();
        res.status(200).json(tiquetes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los tiquetes', error });
    }
}

// Función para obtener un tiquete específico por su ID.
export async function GetallById(req, res) {
    const { id } = req.params;
    try {
        const tiquete = await Tiquetes.findById(id);
        if (!tiquete) {
            return res.status(404).json({ message: 'Tiquete no encontrado' });
        }
        res.status(200).json(tiquete);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el tiquete', error });
    }
}

// Función para contar el total de tiquetes en la base de datos.
export async function countTiquetes(req, res) {
    try {
        const count = await Tiquetes.countDocuments();
        res.status(200).json({ total: count });
    } catch (error) {
        console.error("Error al contar los tiquetes:", error);
        res.status(500).json({ message: 'Error al contar los tiquetes', error });
    }
}

// Función para obtener tiquetes filtrados por ciudad de origen.
export async function getTiquetesByOrigen(req, res) {
    const { origen } = req.params;
    try {
        const tiquetes = await Tiquetes.find({ origen });
        if (tiquetes.length === 0) {
            return res.status(404).json({ message: 'No se encontraron tiquetes para la ciudad de origen especificada' });
        }
        res.status(200).json(tiquetes);
    } catch (error) {
        console.error("Error al obtener los tiquetes por origen:", error);
        res.status(500).json({ message: 'Error al obtener los tiquetes por origen', error });
    }
}

// Función para crear un nuevo tiquete en la base de datos.
export async function createTiquetes(req, res) {
    const { documento, name, placaVehiculo, origen, destino, valor } = req.body;

    try {
        const numeroTiquete = await Tiquetes.getNextNumeroTiquete();

        if (numeroTiquete === null || isNaN(numeroTiquete)) {
            return res.status(500).json({ message: 'Error al generar el número de tiquete' });
        }

        const nuevoTiquete = new Tiquetes({
            numeroTiquete,
            documento,
            name,
            placaVehiculo,
            origen,
            destino,
            valor
        });

        await nuevoTiquete.save();
        res.status(201).json({ message: 'Tiquete creado con éxito', nuevoTiquete });
    } catch (error) {
        if (error.code && error.code === 11000) {
            return res.status(400).json({ message: 'Error de clave duplicada', error });
        }
        console.error("Error al crear el tiquete:", error);
        res.status(500).json({ message: 'Error al crear el tiquete', error });
    }
}

// Función para obtener la suma total de los valores de todos los tiquetes
export async function getTotalValor(req, res) {
    try {
        const resultado = await Tiquetes.aggregate([
            {
                $group: {
                    _id: null,
                    totalValor: { $sum: "$valor" }
                }
            }
        ]);

        if (resultado.length === 0) {
            return res.status(200).json({ totalValor: 0 });
        }

        res.status(200).json({ totalValor: resultado[0].totalValor });
    } catch (error) {
        console.error("Error al sumar los valores de los tiquetes:", error);
        res.status(500).json({ message: 'Error al sumar los valores de los tiquetes', error });
    }
}

// Función para actualizar un tiquete existente por su ID.
export async function putTiquetes(req, res) {
    const { id } = req.params;
    const { documento, name, placaVehiculo, origen, destino, valor } = req.body;

    if (valor < 0) {
        return res.status(400).json({ message: 'El valor no puede ser negativo' });
    }

    const impuesto = valor * 0.15; // Supongamos que el impuesto es del 15%

    try {
        const tiqueteActualizado = await Tiquetes.findByIdAndUpdate(
            id,
            { documento, name, placaVehiculo, origen, destino, valor, impuesto }, // Actualiza el impuesto
            { new: true }
        );

        if (!tiqueteActualizado) {
            return res.status(404).json({ message: 'Tiquete no encontrado' });
        }

        res.status(200).json({ message: 'Tiquete actualizado con éxito', tiqueteActualizado });
    } catch (error) {
        console.error("Error al actualizar el tiquete:", error);
        res.status(500).json({ message: 'Error al actualizar el tiquete', error });
    }
}


// Función para eliminar un tiquete existente por su ID.
export async function deleteTiquete(req, res) {
    const { id } = req.params;

    try {
        const tiqueteEliminado = await Tiquetes.findByIdAndDelete(id);

        if (!tiqueteEliminado) {
            return res.status(404).json({ message: 'Tiquete no encontrado' });
        }

        res.status(200).json({ message: 'Tiquete eliminado con éxito' });
    } catch (error) {
        console.error("Error al eliminar el tiquete:", error);
        res.status(500).json({ message: 'Error al eliminar el tiquete', error });
    }
}
