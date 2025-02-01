const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log(`connecting to MongoDB`)
mongoose.connect(url)
    .then (result => {
        console.log("connected to MongoDB")
    })
    .catch(error => {
        console.log(`Unable to connect to MongoDB: ${error}`)
        process.exit(1)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: function(valNum) {
                return /^\d{2,3}[-]\d+$/.test(valNum)
            }
        },
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)