const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f2glqwr.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// app.get('/', async (req, res) => {
//   res.send("Hello")
// })

// async function run() {
//   client.connect();
//   try {
//     // Connect the client to the server	(optional starting in v4.7)

//     catch (error) {
//     // res.send()
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }

// }
// run().catch(console.dir);
client.connect(err => {
  if (err) {
      console.error('Error connecting to MongoDB:', err);
      return;
  }

  const cocacolaCollection = client.db('cocacolaDB').collection('cocacola');

  const userCollection = client.db('cocacolaDB').collection('user');

  app.get('/cocacola', async (req, res) => {
    const cursor = cocacolaCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  });

  app.get('/cocacola/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await cocacolaCollection.findOne(query);
    res.send(result);
  });

  app.post('/cocacola', async (req, res) => {
    const newCocacola = req.body;
    console.log(newCocacola);
    const result = await cocacolaCollection.insertOne(newCocacola);
    res.send(result);
  });

  app.put('/cocacola/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updatedCocacola = req.body;
    const cocacola = {
      $set: {
        name: updatedCocacola.name,
        brand: updatedCocacola.brand,
        type: updatedCocacola.type,
        price: updatedCocacola.price,
        rating: updatedCocacola.rating,
        massege: updatedCocacola.massege,
        photo: updatedCocacola.photo,
      },
    };
    const result = await cocacolaCollection.updateOne(
      filter,
      cocacola,
      options
    );
    res.send(result);
  });

  app.delete('/cocacola/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await cocacolaCollection.deleteOne(query);
    res.send(result);
  });

  app.get('/user', async (req, res) => {
    const cursor = userCollection.find();
    const users = await cursor.toArray();
    res.send(users);
  });

  app.post('/user', async (req, res) => {
    const user = req.body;
    console.log(user);
    const result = await userCollection.insertOne(user);
    res.send(result);
  });

  app.patch('/user', async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const updateDoc = {
      $set: {
        lastLoggedAt: user.lastLoggedAt,
      },
    };
    const result = await userCollection.updateOne(filter, updateDoc);
    res.send(result);
  });

  app.delete('/user/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await userCollection.deleteOne(query);
    res.send(result);
  });
});




// Send a ping to confirm a successful connection
// await client.db('admin').command({ ping: 1 });
console.log('Pinged your deployment. You successfully connected to MongoDB!');

app.get('/', (req, res) => {
  res.send('Coffee making server is running');
});

app.listen(port, () => {
  console.log(`Coffee server is running on port: ${port}`);
});
