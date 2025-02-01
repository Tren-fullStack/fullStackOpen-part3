const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('connecting to MongoDB')
mongoose.connect(url)
  .then (console.log('connected to MongoDB'))
  .catch(error => {
    console.log(`Unable to connect to MongoDB: ${error}`)
    process.exit(1)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'must be at least 3 letters long'],
    required: true,
    validate: {
      validator: function(valName) {
        return /^[a-zA-Z]+[a-z(\s)A-Z]*[a-zA-Z]+$/.test(valName)
      },
      message: 'must only contain letters and spaces and end in a letter'
    },
  },
  number: {
    type: String,
    minLength: [8, 'must include at least 7 numbers'],
    required: true,
    validate: {
      validator: function(valNum) {
        return /^\d{2,3}[-]\d+$/.test(valNum)
      },
      message: 'format must be: 000-00000... or 00-00000...'
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)