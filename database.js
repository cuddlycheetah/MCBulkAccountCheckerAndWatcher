//const config = require('./config')
const mongoose = require('mongoose')
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    dbName: process.env.MONGO_DBNAME || 'mcaccountschecker',
}
mongoose.connect(process.env.MONGO_DBURI || 'mongodb://admin:admin@mongo:27017', mongoOptions, (err) => {
    if (!!err) process.exit(1)
    console.log('CONNECTED TO MONGODB')
})
.catch(() => process.exit(2))
/*.then(() => {
    GridFS.CONNECTION = mongoose.connection
})*/
const Models = require('./models')
module.exports = { mongoose, Models }