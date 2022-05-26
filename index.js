const express = require("express");
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yr8xr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
       await client.connect();
       const serviceCollection = client.db('Wrench_portal').collection('services');
       const orderCollection = client.db('Wrench_portal').collection('orders');

       app.get('/service', async(req, res)=>{
           const query = {};
           const cursor = serviceCollection.find(query);
           const services = await cursor.toArray();
           res.send(services);
       })

       app.get('/service/:id', async(req, res)=>{
         const id = req.params.id
         const query = {_id: ObjectId(id)}
         const result = await serviceCollection.findOne(query)
         res.send(result)
       })

       app.post("/order", async(req, res) => {
         const orderData = req.body
         const result = orderCollection.insertOne(orderData)
         res.send(result)
       });
    }
    finally{

    }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello this is wrench");
});

app.listen(port, () => {
  console.log(`Wrench website is runing on port ${port}`);
});
