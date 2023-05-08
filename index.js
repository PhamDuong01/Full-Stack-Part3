const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("build"));

//setup morgan to log requests
const morgan = require("morgan");

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`));

//setup cors
const cors = require("cors");
app.use(cors());

const personService = require("./models/person");

//Router
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", async (request, response) => {
  const data = await personService.getAllPerson();
  response.json(data);
});

app.get("/info", async (request, response) => {
  const time = new Date();
  let number = await personService.Person.find({}).then((person) => {
    return person.length;
  });
  return response.send(`<p>Phonebook has info for ${number} people </p>
  <p>${time}</p>
  `);
});

app.get("/api/persons/:id", async (request, response) => {
  console.log(request.params.id);
  const person = await personService.getPerson(request.params.id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  personService.deletePerson(id);
  return response.json({ message: "deleted " });
});

app.post("/api/persons", (request, response) => {
  const data = personService.addPerson(request.body);
  return response.json(request.body);
});

app.put("api/persons/:id", (request, response) => {
  personService.updatePerson(request.params.id, request.body);
});

//start server
const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
