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

const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5rt5l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const { ObjectId } = require('bson')
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {

  console.log('connected');
  const adminCollection = client.db("travally").collection("admin");
  app.post('/admin', (req, res) => {
    adminCollection.insertOne(req.body)
    .then(result => console.log(result)) 
    .catch(err => console.log(err))
  })


  const collection = client.db("travally").collection("services");
  app.post('/addservice', (req, res) => {
    collection.insertOne(req.body)
    .then(result => console.log(result)) 
    .catch(err => console.log(err))
  })

  app.get('/book/:id', (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents)
    })
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
  
  const orderCollection = client.db("travally").collection("orders");
  app.post('/placeorder', (req, res) => {
    orderCollection.insertOne(req.body)
    .then(result => console.log(result)) 
    .catch(err => console.log(err))
  })

  app.get('/orders/:email', (req, res) => {
    orderCollection.find({email: req.params.email})
    .toArray((err, items) => {
        res.send(items)
    })
  })

  app.get('/orders/', (req, res) => {
    orderCollection.find({})
    .toArray((err, items) => {
        res.send(items)
    })
  })
  
  
});

app.listen(port)