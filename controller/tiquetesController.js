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

// Crear un nuevo tiquete
export async function createTiquetes(req, res) {
    const { documento, name, placaVehiculo, origen, destino, valor } = req.body;

    try {
        // Obtener el siguiente número de tiquete
        const numeroTiquete = await Tiquetes.getNextNumeroTiquete();

        // Log para confirmar el número generado
        console.log("Número de tiquete generado:", numeroTiquete);

        // Validar que el número de tiquete sea correcto
        if (numeroTiquete === null || isNaN(numeroTiquete)) {
            return res.status(500).json({ message: 'Error al generar el número de tiquete' });
        }

        const nuevoTiquete = new Tiquetes({
            numeroTiquete, // Asignar el número de tiquete autoincremental
            documento,
            name,
            placaVehiculo,
            origen,
            destino,
            valor
        });

        // Guardar el nuevo tiquete
        await nuevoTiquete.save();

        res.status(201).json({ message: 'Tiquete creado con éxito', nuevoTiquete });
    } catch (error) {
        // Manejar errores de clave duplicada (documento o numeroTiquete duplicado)
        if (error.code && error.code === 11000) {
            return res.status(400).json({ message: 'Error de clave duplicada', error });
        }
        // Manejar otros errores
        console.error("Error al crear el tiquete:", error); // Log para depurar
        res.status(500).json({ message: 'Error al crear el tiquete', error });
    }
}

// Actualizar un tiquete por ID
export async function putTiquetes(req, res) {
    const { id } = req.params;
    const { documento, name, placaVehiculo, origen, destino, valor } = req.body;

    try {
        const tiqueteActualizado = await Tiquetes.findByIdAndUpdate(
            id,
            { documento, name, placaVehiculo, origen, destino, valor },
            { new: true } // Retorna el documento actualizado
        );

        if (!tiqueteActualizado) {
            return res.status(404).json({ message: 'Tiquete no encontrado' });
        }
        res.status(200).json({ message: 'Tiquete actualizado con éxito', tiqueteActualizado });
    } catch (error) {
        console.error("Error al actualizar el tiquete:", error); // Log para depurar
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
        console.error("Error al eliminar el tiquete:", error); // Log para depurar
        res.status(500).json({ message: 'Error al eliminar el tiquete', error });
    }
}
