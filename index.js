import 'dotenv/config'

import express from 'express'
import os from 'os'
import cors from 'cors'

import product from './product.js'
import student from './student.js'

const app = express()

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

app.post('/api/exam', (req, res) => {
  // console.log(req.body)
  let name = req.body.name || ''
  let keycard = req.body.keycard || ''
  let address = req.body.address || ''
  let bank = req.body.bank || ''
  let slip = req.body.file || ''

  let text = `
  <table class='table table-striped table-bordered' border="1">
  <tr class='table-info text-center'>
    <th colspan="2"><h4>ข้อมูลที่ส่งขึ้นไป</h4></th>
  </tr>
  <tr>
    <th>ชื่อ:</th>
    <td>${name}</td>
  </tr>
  <tr>
    <th>การรับคียการ์ด:</th>
    <td>${keycard}</td>
  </tr>
  <tr>
    <th>ที่อยู่:</th>
    <td>${address}</td>
  </tr>
  <tr>
    <th>ธนาคาร:</th>
    <td>${bank}</td>
  </tr>
  <tr>
    <th>ไฟล์รูป:</th>
    <td>${slip}</td>
  </tr>
  </table>`
  res.send(text)
})

app.use('/api/db', product)

app.use('/api/student', student)

app.use((req, res) => res.status(404).send('Route does not exist'))

const port = process.env.PORT || 8000

const startApp = () => {
  try {
    app.listen(port, () => {
      console.log('Server running at http://localhost:%s', port)
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

startApp()
