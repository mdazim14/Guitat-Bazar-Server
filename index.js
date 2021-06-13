const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;


const port = process.env.PORT || 5055
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xwkyk.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World with azim !')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
const productsCollection = client.db("guitarBazar").collection("products");
const ordersCollection = client.db("guitarBazar").collection("orders");

  app.get('/products', (req, res) => {
    productsCollection.find()
      .toArray((err, items) => {
        res.send(items)
        // console.log('from database', items);
      })
  })

  app.post('/addData', (req, res) => {
    const newData = req.body;
    productsCollection.insertOne(newData)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.delete('/delete/:id', (req, res) => {
    productsCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      result.send(result.deleteCount > 0);
    })
  })


  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })




  // client.close();
});






app.listen(port)