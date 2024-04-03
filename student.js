import express from 'express'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  next()
})

let students = [
  { id: '1', name: 'Jakkrit', email: 'jayr.jakkrit@hotmail.com' },
  { id: '2', name: 'Boonmee', email: 'Boonmee55@gmail.com' },
  { id: '3', name: 'Tony', email: 'tonylove3000@ironman.com' },
  { id: '4', name: 'Suwichan', email: 'suwichang69@hotmail.com' },
  { id: '5', name: 'Somying', email: 'somying@gmail.com' },
  { id: '6', name: 'Somsri', email: 'somsri@hotmail.com' },
]

router.post('/', (req, res) => {
  const studentName = req.body.name
  const studentEmail = req.body.email

  if (studentName.length <= 0) {
    res.status(400).send('Error cannot add student!')
  } else {
    const student = {
      id: uuidv4(),
      name: studentName,
      email: studentEmail,
    }
    students.push(student)
    res.send(student)
  }
})

router.get('/', (req, res) => {
  if (students.length >= 0) {
    res.status(200).send(students)
  } else {
    res.status(400).send('Not found any student')
  }
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  const student = students.find((item) => item.id === id)

  if (student) {
    res.send(student)
  } else {
    res.status(400).send(`Not found student for id ${id}`)
  }
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  const student = students.find((item) => item.id === id)

  if (student) {
    const index = students.indexOf(student)
    students.splice(index, 1)
    res.send(student)
  } else {
    res.status(400).send('Error cannot delete student!')
  }
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const studentName = req.body.name
  const studentEmail = req.body.email

  if (studentName.length < 1) {
    res.status(400).send('Error cannot update student!')
  } else {
    let student = students.find((item) => item.id === id)
    if (student) {
      student.name = studentName
      student.email = studentEmail
      res.send(student)
    } else {
      res.status(400).send('Cannot find student to update')
    }
  }
})

export default router
