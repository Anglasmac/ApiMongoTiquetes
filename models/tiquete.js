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
    min:[0,'el valor no puede ser negativo']
  },
  impuesto: {
    type: Number,
  },
});

// Método estático para obtener el próximo número de tiquete
tiqueteSchema.statics.getNextNumeroTiquete = async function () {
  const lastTiquete = await this.findOne().sort({ numeroTiquete: -1 });
  return lastTiquete && lastTiquete.numeroTiquete ? lastTiquete.numeroTiquete + 1 : 1;
};

// Middleware `pre` para asignar automáticamente `numeroTiquete` y calcular el impuesto
tiqueteSchema.pre('save', async function (next) {
  // Asignar `numeroTiquete` si es un nuevo documento
  if (this.isNew && !this.numeroTiquete) {
    this.numeroTiquete = await this.constructor.getNextNumeroTiquete();
  }

  // Calcular el impuesto sobre el valor (16%)
  if (this.valor) {
    this.impuesto = this.valor * 0.16; // 16% de impuesto
  }

  next();
});


export default model('Tiquetes', tiqueteSchema);

