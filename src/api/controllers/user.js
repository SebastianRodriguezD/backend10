const { generarLlave } = require('../../utils/jwt')
const Evento = require('../models/eventos')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('favoritos')
    return res.status(200).json(users)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).populate('favoritos')
    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const register = async (req, res, next) => {
  try {
    const userDuplicated = await User.findOne({ userName: req.body.userName })

    if (userDuplicated) {
      return res.status(400).json('Usuario ya existente')
    }

    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      userName: req.body.userName,
      lastName: req.body.lastName,
      rol: 'user'
    })
    const user = await newUser.save()
    return res.status(201).json(user)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json('Usuario o contraseña incorrectos')
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = generarLlave(user._id)
      return res.status(200).json({ token, user })
    }

    return res.status(400).json('Usuario o contraseña incorrectos')
  } catch (error) {
    return res.status(400).json('error')
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params

    if (req.user._id.toString() !== id) {
      return res
        .status(400)
        .json('No puedes modificar a alguien que no seas tu mismo')
    }

    const oldUser = await User.findById(id)
    const newUser = new User(req.body)
    newUser._id = id
    newUser.favoritos = [...oldUser.favoritos, ...newUser.favoritos]
    const userUpdated = await User.findByIdAndUpdate(id, newUser, {
      new: true
    })

    return res.status(200).json(userUpdated)
  } catch (error) {
    return res.status(400).json('error')
  }
}
const addFavoriteEvent = async (req, res, next) => {
  const { userId, eventId } = req.params

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    if (user.favoritos.includes(eventId)) {
      return res.status(400).json({ message: 'El evento ya está en favoritos' })
    }

    const event = await Evento.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' })
    }

    user.favoritos.push(eventId)
    await User.findByIdAndUpdate(
      userId,
      { favoritos: user.favoritos },
      { new: true }
    )

    res.status(200).json({
      message: 'Asistencia confirmada y evento agregado a favoritos',
      favoritos: user.favoritos
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al confirmar asistencia', error })
  }
}
const removeFavoriteEvent = async (req, res, next) => {
  const { userId, eventId } = req.params

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    if (!user.favoritos.includes(eventId)) {
      return res
        .status(200)
        .json({ message: 'El evento ya no estaba en favoritos' })
    }

    await User.findByIdAndUpdate(
      userId,
      { $pull: { favoritos: eventId } },
      { new: true }
    )

    return res.status(200).json({
      message: 'Evento eliminado de favoritos',
      favoritos: user.favoritos.filter((id) => id !== eventId)
    })
  } catch (error) {
    console.error('Error al eliminar el evento de favoritos:', error)
    return res
      .status(500)
      .json({ message: 'Error al eliminar el evento de favoritos' })
  }
}

const getFavoritos = async (req, res) => {
  const { userId } = req.params

  try {
    const user = await User.findById(userId).select('favoritos')
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    return res.status(200).json(user.favoritos)
  } catch (error) {
    console.error('Error al obtener favoritos:', error)
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}

module.exports = {
  getUsers,
  getUserById,
  register,
  updateUser,
  login,
  addFavoriteEvent,
  removeFavoriteEvent,
  getFavoritos
}
