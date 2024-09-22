const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    userName: { type: String, required: true },
    lastName: { type: String, required: true },
    favoritos: [
      { type: mongoose.Types.ObjectId, required: false, ref: 'eventos' }
    ],
    rol: {
      type: String,
      required: true,
      default: 'user',
      enum: ['admin', 'user']
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
)

userSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 10)
})

const User = mongoose.model('users', userSchema, 'users')
module.exports = User
