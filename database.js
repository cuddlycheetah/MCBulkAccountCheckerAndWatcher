const config = require('./config')
const mongoose = require('mongoose')
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    dbName: config.mongodbName
}
mongoose.connect(config.mongodbURI, mongoOptions, (err) => {
    if (!!err) process.exit(1)
    console.log('CONNECTED TO MONGODB')
})
.catch(() => process.exit(2))
/*.then(() => {
    GridFS.CONNECTION = mongoose.connection
})*/
const Models = require('./models')
module.exports = { mongoose, Models }