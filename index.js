const express = require('express')
const app = express()
require('dotenv').config()
const cors = require("cors")
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 5000

const pass = 'N@AF9_q-gBmUZdx'
const user = 'samFirstDatabase'
const dbname = 'myFirstDatabase'

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${user}:${pass}@cluster0.5rt5l.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {

  console.log('connected');
  const collection = client.db("travally").collection("services");
  app.post('/addservice', (req, res) => {
    collection.insertOne(req.body)
    .then(result => console.log(result)) 
    .catch(err => console.log(err))
  })

  app.get('/services', (req, res) => {
    collection.find({})
    .toArray((err, docs) => {
      res.send(docs)
    })
  })
  
  const reviewcollection = client.db("travally").collection("reviews");
  app.post('/addreview', (req, res) => {
    reviewcollection.insertOne(req.body)
    .then(result => console.log(result)) 
    .catch(err => console.log(err))
  })
  
  app.get('/testimonials', (req, res) => {
    reviewcollection.find({})
    .toArray((err, docs) => {
      res.send(docs)
    })
  })
  
  
});

app.listen(port)