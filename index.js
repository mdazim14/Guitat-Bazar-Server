const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;


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
  

  app.get('/products', (req, res) => {
    productsCollection.find()
    .toArray((err, items) => {
      res.send(items)
      console.log('from database', items);
    })
  })


  app.post('/addData', (req, res) => {
    const newData = req.body;
    console.log('adding new Data', newData);
    productsCollection.insertOne(newData)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })

  })

  // client.close();
});






app.listen(port)