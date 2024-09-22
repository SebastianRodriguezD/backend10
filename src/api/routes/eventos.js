const { isAuth } = require('../../middlewares/auth')
const {
  getEventos,
  getEventosId,
  postEventos,
  updateEventos,
  deleteEventos
} = require('../controllers/eventos')

const eventosRouters = require('express').Router()

eventosRouters.get('/', getEventos)
eventosRouters.get('/:id', getEventosId)
eventosRouters.post('/', isAuth, postEventos)
eventosRouters.put('/:id', isAuth, updateEventos)
eventosRouters.delete('/:id', isAuth, deleteEventos)

module.exports = eventosRouters
