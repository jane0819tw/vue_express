const express = require('express')
const mongodb = require('mongodb')

const router = express.Router()
const mongodb_url = 'mongodb+srv://vue_express:vue_express@cluster0-ad0wr.mongodb.net/test?retryWrites=true&w=majority'
// get:  read data
router.get('/', async (req, res) => {
  // res.send('hello')
  const posts = await loadPostsCollection()
  res.send(await posts.find({}).toArray())
})

// post: create data
router.post('/', async (req, res) => {
  const posts = await loadPostsCollection()
  await posts.insertOne({
    text: req.body.text,
    createdAt: new Date()
  })
  res.status(201).send()
})

// delete
router.delete('/:id', async (req, res) => {
  const posts = await loadPostsCollection()
  await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) })
  res.status(200).send()
})
// update 
router.put('/:id', async (req, res) => {
  const posts = await loadPostsCollection()
  await posts.updateOne({ _id: new mongodb.ObjectID(req.params.id) }, { $set: { text: req.body.text, createdAt: new Date() } })
  res.status(201).send()
})
async function loadPostsCollection() {
  const client = await mongodb.MongoClient.connect(mongodb_url, {
    useNewUrlParser: true
  })
  return client.db('vue_express').collection('posts')
}

module.exports = router