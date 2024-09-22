const Evento = require('../models/eventos')

const getEventos = async (req, res, next) => {
  try {
    const eventos = await Evento.find()
    return res.status(200).json(eventos)
  } catch (error) {
    return res.status(400).json('error el buscar eventos')
  }
}

const getEventosId = async (req, res, next) => {
  try {
    const { id } = req.params
    const evento = await Evento.findById(id)
    return res.status(200).json(evento)
  } catch (error) {
    return res.status(400).json('error al buscar evento')
  }
}

const postEventos = async (req, res, next) => {
  try {
    const newEvento = new Evento(req.body)
    const evento = await newEvento.save()
    return res.status(201).json(evento)
  } catch (error) {
    return res.status(400).json('error al publicar evento')
  }
}

const updateEventos = async (req, res, next) => {
  try {
    const { id } = req.params
    const newEvento = new Evento(req.body)
    newEvento._id = id
    const eventoUpdated = await Evento.findByIdAndUpdate(id, newEvento, {
      new: true
    })
    return res.status(200).json(eventoUpdated)
  } catch (error) {
    return res.status(400).json('error al actualizar evento')
  }
}

const deleteEventos = async (req, res, next) => {
  try {
    const { id } = req.params
    const evento = await Evento.findByIdAndDelete(id)
    return res.status(200).json({
      mensaje: 'Ha sido eliminado con éxito',
      eventoEliminado: evento
    })
  } catch (error) {
    return res.status(400).json('error al eliminar evento')
  }
}

module.exports = {
  getEventos,
  getEventosId,
  postEventos,
  updateEventos,
  deleteEventos
}
