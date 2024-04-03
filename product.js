import express from 'express'
import { Product } from './model.js'

const router = express.Router()

router.post('/create', (request, response) => {
  let form = request.body
  let data = {
    name: form.name || '',
    price: form.price || 0,
    detail: form.detail || '',
    date_added: new Date(Date.parse(form.date_added)) || new Date(),
  }

  Product.create(data)
    .then((result) => {
      console.log('Data inserted')
      response.send(true) // Send a success response
    })
    .catch((err) => {
      console.error(err) // Log the error
      response.status(500).send(false) // Send an error response with a 500 status code
    })
})

router.get('/read', (request, response) => {
  Product.find({})
    .exec()
    .then((docs) => response.json(docs))
    .catch((err) => console.log(err))
})

router.post('/update', (request, response) => {
  let form = request.body
  let data = {
    name: form.name || '',
    price: form.price || 0,
    detail: form.detail || '',
    date_added: form.date_added
      ? new Date(Date.parse(form.date_added))
      : new Date(),
  }

  Product.findByIdAndUpdate(form._id, data, { useFindAndModify: false })
    .then((updatedProduct) => {
      console.log('Data updated')
      return Product.find().exec()
    })
    .then((docs) => {
      response.json(docs)
    })
    .catch((err) => {
      console.error(err)
      response.status(500).json({ error: err })
    })
})

router.post('/delete', (request, response) => {
  let _id = request.body._id

  Product.findByIdAndDelete(_id, { useFindAndModify: false })
    .then((deletedProduct) => {
      response.json(docs)
      console.log('Data deleted')
      return Product.find().exec()
    })
    .then((docs) => {})
    .catch((err) => {
      console.error(err)
      response.status(500).json({ error: err })
    })
})

router.get('/paginate', (request, response) => {
  let options = {
    page: request.query.page || 1, // Current page
    limit: 2, // Display 2 items per page (for limited data)
  }

  Product.paginate({}, options)
    .then((result) => {
      response.json(result)
    })
    .catch((err) => {
      console.error(err)
      response.status(500).json({ error: err })
    })
})

router.get('/search', (request, response) => {
  let q = request.query.q || ''

  // In this case, create a RegExp pattern to perform case-insensitive search
  let pattern = new RegExp(q, 'i')

  // Search in the 'name' and 'detail' fields using $or
  let conditions = {
    $or: [
      { name: { $regex: pattern, $options: 'i' } },
      { detail: { $regex: pattern, $options: 'i' } },
    ],
  }

  let options = {
    page: request.query.page || 1, // Current page
    limit: 2, // Display 2 items per page (for limited data)
  }

  Product.paginate(conditions, options)
    .then((result) => {
      response.json(result)
    })
    .catch((err) => {
      console.error(err)
      response.status(500).json({ error: err })
    })
})

export default router
