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

const db = mongoose.connection

db.on('disconnected', () => {
  console.log('disconnected from MongoDB');
})

app.get('/api/persons',(request,response,next) => {
    Person.find({}).then(people => {
      console.log(people)
      if (people) {
        response.json(people)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get(`/api/persons/:id`,(request,response,next) => {
  const id = request.params.id
  console.log(`This is the Id: ${id}`)

  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
}) 

app.delete('/api/persons/:id',(request,response,next) => {
  const id = request.params.id
  console.log(`Delete person with this Id: ${id}`)

  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id',(request,response,next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      console.log(`updated; new name: ${updatedPerson.name}, new number: ${updatedPerson.number}`)
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request,response,next) => {
  const body = request.body
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(result => {
    console.log(`added ${result.name} (number: ${result.number}) to the phonebook!`)
    response.json(result)
    })
    .catch(error => next(error))
})

app.get('/info',(request,response) => {
  Person.find({}).then(people => {
    response.send(`<p>Phonebook has info for ${people.length} people</p>
      <p>${Date(response).toString()}</p>`)
  })
  /*response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${Date(response).toString()}</p>`) */
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'invalid formatting of id' })
  } 
  else if (error.name === 'ValidationError') {
    return response.status(400).send({error: "invalid formatting of name or number"})
  }

  next(error)
}

app.use(errorHandler)