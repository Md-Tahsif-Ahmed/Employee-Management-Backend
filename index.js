const express = require('express');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb'); // Import ObjectId
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
 
const port = process.env.PORT || 3000;

// Middleware
 
app.use(cors());
app.use(express.json());

// ...........
const employeeDB = "Employee";

console.log(process.env.DB_USER, process.env.DB_PASS);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vhtgohj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    // My Collection
    const employeeCollection = client.db(employeeDB).collection("employee");

    


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run();

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// Define your routes or other logic using the collections
app.get('/', (req, res) => {
  res.send('Hello World!');
});
