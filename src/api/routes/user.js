const { isAuth } = require('../../middlewares/auth')
const {
  getUsers,
  getUserById,
  register,
  login,
  updateUser,
  addFavoriteEvent,

  removeFavoriteEvent,
  getFavoritos
} = require('../controllers/user')

const usersRouter = require('express').Router()

usersRouter.get('/', getUsers)
usersRouter.get('/:id', getUserById)
usersRouter.post('/register', register)
usersRouter.post('/login', login)
usersRouter.put('/:id', isAuth, updateUser)
usersRouter.put('/:userId/event/:eventId/favorite', addFavoriteEvent)
usersRouter.delete('/:userId/favoritos/:eventId', removeFavoriteEvent)
usersRouter.get('/:userId/favoritos', getFavoritos)

module.exports = usersRouter
