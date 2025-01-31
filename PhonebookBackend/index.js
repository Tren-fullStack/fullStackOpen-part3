require('dotenv').config()  
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
morgan.token('person-data',(request,response) => {return JSON.stringify(request.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person-data'))
app.use(cors())
app.use(express.static('dist'))

app.get('/api/persons',(request,response) => {
    Person.find({}).then(people => {
      response.json(people)
    })
    .catch(error => response.status(404).end())
})

app.get(`/api/persons/:id`,(request,response) => {
  const id = request.params.id
  console.log(`This is the Id: ${id}`)

  Person.findById(id)
    .then(person => {
      response.json(person)
    })
    .catch(error => response.status(404).end())
}) 

/*app.delete('/api/persons/:id',(request,response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
}) */

app.delete('/api/persons/:id',(request,response) => {
  const id = request.params.id
  console.log(`Delete person with this Id: ${id}`)

  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => console.log(`person does not exist: ${error}`))
})

app.put(`/api/persons/:id`,(request,response) => {
  const id = request.params.id
  const body = request.body
  const findPersonIndex = persons.findIndex(person => person.id === id)
  console.log('This is the id',id)
  console.log('This is the body',body)

  persons[findPersonIndex] = { id:id, ...body }
  console.log('This is the updated person',persons[findPersonIndex])
  
  response.json(persons[findPersonIndex])
})

app.post('/api/persons', (request,response) => {
  const body = request.body
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(result => {
    console.log(`added ${result.name} (number: ${result.number}) to the phonebook!`)
    response.json(result)
    mongoose.connection.close()
    })
    .catch(error => console.log(`Unable to add person: ${error}`))
})

app.get('/info',(request,response) => {
  console.log('Here')
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${Date(response).toString()}</p>`)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})