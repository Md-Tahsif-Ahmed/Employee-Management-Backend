const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // Removed unused ObjectId import
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Constants
const employeeDB = "Employee";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vhtgohj.mongodb.net`;

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
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    // My Collection
    const employeeCollection = client.db(employeeDB).collection("employee");

    app.post('/employee', async (req, res) => { // Fixed endpoint name from '/employeee' to '/employee'
      const item = req.body;
      const result = await employeeCollection.insertOne(item);
      res.send(result);
    });

    app.get('/employee', async (req, res) => {
      const result = await employeeCollection.find().toArray();
      res.send(result);
    });

    app.put('/employee/:id', async (req, res) => {
      const id = req.params.id;
      console.log('Received ID:', id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateemp = req.body;
      const emp = {
        $set: {
          fname: updateemp.fname,
          lname:updateemp.lname,
          phone: updateemp.phone,
          
        }
      };
      const result = await employeeCollection.updateOne(filter, emp, options);
      res.send(result);
    });

    app.delete('/employee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await employeeCollection.deleteOne(query);
      res.send(result);
    });

  } catch (error) {
    console.error("Error:", error);
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
