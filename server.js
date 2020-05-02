if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')

const port = process.env.PORT

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello, World!')
})

app.listen(port, () => console.log(`${process.env.NODE_ENV !== 'production' ? 'Development' : 'Production'} Server started on port ${port}...`))