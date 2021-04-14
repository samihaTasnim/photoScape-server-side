const express = require('express')
const app = express()
require('dotenv').config()
const cors = require("cors")
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)