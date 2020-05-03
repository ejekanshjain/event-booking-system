if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const mongoose = require('mongoose')

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => {
        console.log(err)
        process.exit(1)
    })

module.exports = mongoose.connection