import Tiquetes from '../models/tiquete.js';

// Obtener todos los tiquetes
export async function GetAlltiquetes(req, res) {
    try {
        const tiquetes = await Tiquetes.find();
        res.status(200).json(tiquetes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los tiquetes', error });
    }
}

// Obtener tiquete por ID
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

// Contar todos los tiquetes
export async function countTiquetes(req, res) {
    try {
        const count = await Tiquetes.countDocuments();
        res.status(200).json({ total: count });
    } catch (error) {
        console.error("Error al contar los tiquetes:", error);
        res.status(500).json({ message: 'Error al contar los tiquetes', error });
    }
}

// Obtener tiquetes por ciudad de origen
export async function getTiquetesByOrigen(req, res) {
    const { origen } = req.params;
    try {
        const tiquetes = await Tiquetes.find({ origen: origen });

        if (tiquetes.length === 0) {
            return res.status(404).json({ message: 'No se encontraron tiquetes para la ciudad de origen especificada' });
        }
        res.status(200).json(tiquetes);
    } catch (error) {
        console.error("Error al obtener los tiquetes por origen:", error);
        res.status(500).json({ message: 'Error al obtener los tiquetes por origen', error });
    }
}

// Crear un nuevo tiquete
export async function createTiquetes(req, res) {
    const { documento, name, placaVehiculo, origen, destino, valor } = req.body;

    try {
        const numeroTiquete = await Tiquetes.getNextNumeroTiquete();

        console.log("Número de tiquete generado:", numeroTiquete);

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

// Actualizar un tiquete por ID
export async function putTiquetes(req, res) {
    const { id } = req.params;
    const { documento, name, placaVehiculo, origen, destino, valor } = req.body;
    
 // Validar que el valor no sea negativo
 if (valor < 0) {
    return res.status(400).json({ message: 'El valor no puede ser negativo' });
}
try {
    const tiqueteActualizado = await Tiquetes.findByIdAndUpdate(
        id,
        { documento, name, placaVehiculo, origen, destino, valor },
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
   

// Eliminar un tiquete por ID
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
