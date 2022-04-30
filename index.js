const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.acdjr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
async function run() {
    try {
        await client.connect()
        const itemsCollections = client.db('toyWarehouse').collection('items')
        //get method for get all items
        app.get('/inventoryItems', async (req, res) => {
            const query = {}
            const cursor = itemsCollections.find(query)
            const items = await cursor.toArray()
            res.send(items)
        })
        //get method for get one item by id
        app.get('/inventoryItems/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const item = await itemsCollections.findOne(query)
            res.send(item)
        })
        //put method for decrease quantity
        app.put('/inventoryItems/:id', async (req, res) => {
            const id = req.params.id
            const { newQuantity } = req.body
            console.log(newQuantity)
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    quantity: newQuantity
                }
            }
            const result = await itemsCollections.updateOne(filter, updateDoc, options)
            res.send(result)
        })
        //put method for increase quantity (not working)
        app.put('/inventoryItems/:id', async (req, res) => {
            const id = req.params.id
            console.log(req.body)
            const { renewQuantity } = req.body
            console.log(renewQuantity)
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    quantity: renewQuantity
                }
            }
            const result = await itemsCollections.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        //delete method for delete item in manage inventory

        app.delete('/inventoryItems/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await itemsCollections.deleteOne(query)
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})