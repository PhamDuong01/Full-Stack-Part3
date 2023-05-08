const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
console.log("connecting to PhoneBook MongoDB", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to PhoneBook MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to PhoneBook MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

function getAllPerson() {
  return Person.find({}).then((person) => {
    return person;
  });
}
async function getPerson(id) {
  const searchRessult = await Person.findById(id).then((person) => {
    return person;
  });
  return searchRessult;
}

function addPerson(person) {
  const personAdd = new Person({
    name: person.name,
    number: person.number,
  });
  //   const validname = Person.find({ name: personAdd.name }).then((person) => person.name);

  //   if (validname === addperson.name) {
  //     console.log(validname);
  //     console.log("đã có lỗi");
  //     return;
  //   }
  return personAdd.save().then((result) => {
    console.log(`added ${personAdd.name} ${personAdd.number} to phonebook`);
    // mongoose.connection.close();
  });
}

function updatePerson(id, person) {
  const personUpdate = person.number;
  Person.findById(id).then((person) => {});
}

async function deletePerson(id) {
  Person.findByIdAndRemove(id).then((result) => {
    return;
  });
}

module.exports = { Person, getAllPerson, getPerson, addPerson, updatePerson, deletePerson };
