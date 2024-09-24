// Importa el objeto Schema y la función model desde Mongoose, una biblioteca de modelado de datos para MongoDB.
import { Schema, model } from 'mongoose';

// Define un nuevo esquema llamado 'tiqueteSchema' utilizando el objeto Schema de Mongoose.
const tiqueteSchema = new Schema({
  // Campo 'documento': tipo Number, debe ser único y es obligatorio.
  documento: {
    type: Number,
    unique: true,  // Asegura que no se repita el número de documento.
    required: true, // Este campo es obligatorio al crear un nuevo documento.
  },
  // Campo 'numeroTiquete': tipo Number, debe ser único.
  numeroTiquete: {
    type: Number,
    unique: true, // Asegura que no se repita el número de tiquete.
  },
  // Campo 'name': tipo String, opcional.
  name: {
    type: String,
  },
  // Campo 'placaVehiculo': tipo String, opcional.
  placaVehiculo: {
    type: String,
  },
  // Campo 'origen': tipo String, obligatorio.
  origen: {
    type: String,
    required: true // Este campo es obligatorio al crear un nuevo documento.
  },
  // Campo 'destino': tipo String, obligatorio.
  destino: {
    type: String,
    required: true // Este campo es obligatorio al crear un nuevo documento.
  },
  // Campo 'valor': tipo Number, obligatorio, no puede ser negativo.
  valor: {
    type: Number,
    required: true, // Este campo es obligatorio al crear un nuevo documento.
    min: [0, 'el valor no puede ser negativo'] // Define que el valor no puede ser menor que 0, y proporciona un mensaje de error.
  },
  // Campo 'impuesto': tipo Number, opcional.
  impuesto: {
    type: Number,
  },
});

// Método estático para obtener el próximo número de tiquete disponible.
tiqueteSchema.statics.getNextNumeroTiquete = async function () {
  // Busca el último tiquete registrado, ordenado por 'numeroTiquete' en orden descendente.
  const lastTiquete = await this.findOne().sort({ numeroTiquete: -1 });
  // Devuelve el siguiente número de tiquete (último + 1) o 1 si no hay tiquetes registrados.
  return lastTiquete && lastTiquete.numeroTiquete ? lastTiquete.numeroTiquete + 1 : 1;
};

// Middleware 'pre' que se ejecuta antes de guardar un documento en la colección.
tiqueteSchema.pre('save', async function (next) {
  // Asigna 'numeroTiquete' si es un nuevo documento y aún no tiene un número asignado.
  if (this.isNew && !this.numeroTiquete) {
    this.numeroTiquete = await this.constructor.getNextNumeroTiquete(); // Llama al método estático para obtener el próximo número.
  }

  // Calcula el impuesto sobre el valor (16%) si el valor está definido.
  if (this.valor) {
    this.impuesto = this.valor * 0.16; // Calcula el 16% del valor como impuesto.
  }

  next(); // Llama a la siguiente función middleware o a la operación de guardado.
});

// Exporta el modelo 'Tiquetes' basado en el esquema definido, para que pueda ser utilizado en otras partes de la aplicación.
export default model('Tiquetes', tiqueteSchema);
