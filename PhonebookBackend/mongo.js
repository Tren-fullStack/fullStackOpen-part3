const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
} else if (process.argv.length>5) {
    console.log('too many arguements')
    process.exit(1)
} 
else {
    const password = process.argv[2]
    console.log(password)
    const url = `mongodb+srv://sdorssers7:${password}@fullstackopen.ncqg1.mongodb.net/PhonebookApp?retryWrites=true&w=majority&appName=fullStackOpen`
    
    mongoose.set('strictQuery',false)

    //async+await waits for connection to avoid timeout error
    const connection = () => {
        mongoose.connect(url)
            .catch(error => console.log(`Unable to connect to MongoDB: ${error}`)) 
        
    }
    connection()
    
    const personSchema = new mongoose.Schema({
        name: String,
        number: String,
    })
    const Person = mongoose.model('Person', personSchema)

    //retrieves and console displays all persons in db when only password is entered
    if (process.argv.length === 3) {
        Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log('Phonebook:')
                console.log(person.name, person.number)
            })
        })
        .catch(error => console.log(`Unable to find people: ${error}`))
        mongoose.connection.close()
    }
    //adds a new person's data to the db when given the arguements necessary
    else {
        const name = process.argv[3]
        const number = process.argv[4]

        const person = new Person({
            name: name,
            number: number,
        })
        
        person.save().then(result => {
        console.log(`added ${name} (number: ${number}) to the phonebook!`)
        mongoose.connection.close()
        })
        .catch(error => console.log(`Unable to save person: ${error}`))
    }
}













