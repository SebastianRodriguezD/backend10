const mongoose = require('mongoose')

const eventosSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    fecha: { type: String, required: true },
    caratula: { type: String, required: true },
    ciudad: { type: String, required: true },
    info: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: 'eventos'
  }
)

const Evento = mongoose.model('eventos', eventosSchema, 'eventos')
module.exports = Evento
