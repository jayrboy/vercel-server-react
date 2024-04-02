import 'dotenv/config'

import express from 'express'
import os from 'os'
import cors from 'cors'
import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2' //สำหรับแบ่งเพจ

const app = express()
const port = process.env.PORT || 8000

mongoose
  .connect(process.env.MONGODB_URL)
  .then((result) => console.log('Connection OK'))
  .catch((err) => console.log(err))

let productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  detail: String,
  date_added: Date,
})

productSchema.plugin(paginate) //สำหรับแบ่งเพจ

let Product = mongoose.model('Product', productSchema)

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
  res.send(`<h1>${os.hostname()}</h1>`)
})

app.get('/api/server-time', (req, res) => {
  let now = new Date()
  let time = {
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  }
  res.json(time)
})

function rd(min, max) {
  let x = max - min + 1
  return min + Math.floor(Math.random() * x)
}

app.get('/api/football-result', (req, res) => {
  let table = `
 <table border="1" style="margin: 7px auto">
 <tr><td>ManU</td><td>${rd(0, 5)}-${rd(0, 5)}</td><td>Liverpool</td></tr>
 <tr><td>Chelsea</td><td>${rd(0, 5)}-${rd(0, 5)}</td><td>ManCity</td></tr>
 <tr><td>Arsenal</td><td>${rd(0, 5)}-${rd(0, 5)}</td><td>Spur</td></tr>
 </table>
 `
  res.send(table)
})

app.get('/api/form-get', (req, res) => {
  let t = req.query.target || ''
  let k = req.query.kw || ''
  let n = parseInt(Math.random() * 1000)
  let r = {
    target: t,
    kw: k,
    results: n,
  }
  res.json(r)
})

app.post('/api/form-post', (req, res) => {
  let name = req.body.name || ''
  let email = req.body.email || ''
  let message = req.body.message || ''
  let text = `
    <table border="1">
      <h4>ข้อมูลที่ส่งขึ้นไป</h4>
      <thead>
        <tr>
          <th>ชื่อ:</th>
          <td>${name}</td>
        </tr>
      </thead>
    <tbody>
        <tr>
          <th>อีเมล:</th>
          <td>${email}</td>
        </tr><tr>
          <th>ข้อความ:</th>
          <td>${message}</td>
        </tr>
    </tbody>
    </table>
  `
  res.send(text)
})

app.post('/api/db/create', (request, response) => {
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

app.get('/api/db/read', (request, response) => {
  Product.find({})
    .exec()
    .then((docs) => response.json(docs))
    .catch((err) => console.log(err))
})

app.post('/api/db/update', (request, response) => {
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

app.post('/api/db/delete', (request, response) => {
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

app.get('/api/db/paginate', (request, response) => {
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

app.get('/api/db/search', (request, response) => {
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

app.listen(port, () =>
  console.log('Server running at http://localhost:%s', port)
)
