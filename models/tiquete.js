import { Schema, model } from 'mongoose';

const tiqueteSchema = new Schema({
  documento: {
    type: Number,
    unique: true,
    required: true,
  },
  numeroTiquete: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
  },
  placaVehiculo: {
    type: String,
  },
  origen: {
    type: String,
    required: true
  },
  destino: {
    type: String,
    required: true
  },
  valor: {
    type: Number,
    required: true,
    min: [0, 'El valor no puede ser negativo']
  },
  impuesto: {
    type: Number,
  },
});

// Método estático para obtener el próximo número de tiquete disponible
tiqueteSchema.statics.getNextNumeroTiquete = async function () {
  const lastTiquete = await this.findOne().sort({ numeroTiquete: -1 });
  return lastTiquete && lastTiquete.numeroTiquete ? lastTiquete.numeroTiquete + 1 : 1;
};

// Método estático para sumar los valores de todos los tiquetes
tiqueteSchema.statics.getTotalValor = async function () {
  const tiquetes = await this.find(); // Encuentra todos los tiquetes
  // Reduce los valores de los tiquetes para obtener el total
  const total = tiquetes.reduce((acc, tiquete) => acc + tiquete.valor, 0);
  return total;
};

// Middleware 'pre' que se ejecuta antes de guardar un documento
tiqueteSchema.pre('save', async function (next) {
  if (this.isNew && !this.numeroTiquete) {
    this.numeroTiquete = await this.constructor.getNextNumeroTiquete();
  }

  if (this.valor) {
    this.impuesto = this.valor * 0.16; // Calcula el 16% del valor como impuesto.
    this.valor = this.valor + this.impuesto; // Suma el impuesto al valor total.
  }

  next();
});

// Exporta el modelo 'Tiquetes'
export default model('Tiquetes', tiqueteSchema);
