const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
morgan.token('person-data',(request,response) => {return JSON.stringify(request.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person-data'))
app.use(cors())

let persons = [
    { 
      "id": "1",
      "name": "Donnie Darko", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request,response) => {
    response.json(persons)
})

app.get(`/api/persons/:id`,(request,response) => {
  const id = request.params.id
  const person = persons.find(person => person.id == id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
}) 

app.delete('/api/persons/:id',(request,response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const randId = Math.random().toString(16).substring(2,10)
  return (randId)
}
app.post('/api/persons',(request,response) => {
  const body = request.body
  const errMessage = [
    {"error":"name must be unique"},
    {"error":"no name was given"},
    {"error":"no number was given"}
    ]
  if (!body.name) {
    response.status(400).send(errMessage[1])
  } else if (!body.number) {
    response.status(400).send(errMessage[2])
  } else if (persons.find(person => person.name === body.name)) {
    console.log(persons.find(person => person.name === body.name))
    response.status(400).send(errMessage[0])
  } else {
    console.log(body)
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
  }
})

app.get('/info',(request,response) => {
  console.log('Here')
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${Date(response).toString()}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

