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

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, admin) => {
        res.send(admin.length > 0);
      })
  })


  const collection = client.db("travally").collection("services");
  app.post('/addservice', (req, res) => {
    collection.insertOne(req.body)
      .then(result => console.log(result))
      .catch(err => console.log(err))
  })

  app.get('/book/:id', (req, res) => {
    collection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.delete('/delete/:id', (req, res) => {
    collection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        console.log(result);
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
    orderCollection.find({ email: req.params.email })
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.get('/orders', (req, res) => {
    orderCollection.find({})
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.patch('/update/:serviceId', (req, res) => {
    console.log(req.body.status, req.params.serviceId);
    orderCollection.updateOne({ _id: ObjectId(req.params.serviceId) },
      {
        $set: { status: req.body.status }
      })
      .then(result => {
        res.send(result.modifiedCount > 0)
        console.log(result);
      })
  })
});

app.listen(port)