const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  uuid: String, //{ type: String, unique: true , required: false },

  email: { type: String, unique: true },
  username: String,
  password: String,
  dateAdded: { type: Date, default: () => new Date() },
  validState: { type: Number, default: 0 },
  info: Object,
  lastUpdate: Date,
}, { versionKey: false })

schema.index({ email: true }, { unique: true })
module.exports = mongoose.model('MCAccount', schema)