const express = require("express");
const app = express();
app.use(express.json());

const morgan = require("morgan");

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const time = new Date();
  return response.send(`<p>Phonebook has info for ${persons.length} people </p>
  <p>${time}</p>
  `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.filter((person) => person.id !== id);
  persons = person;
  response.json(persons);
});

app.post("/api/persons", (request, response) => {
  const id = Math.floor(Math.random() * 1000);
  const data = request.body;
  const name = data.name;
  const number = data.number;
  if (name !== "" && number !== "") {
    const validname = persons.find((person) => person.name === name);

    if (validname) {
      return response.status(400).json({ error: "name must be unique" });
    }
    persons.push({ id, name, number });
    response.json({ id, name, number });
    return;
  }
  name === ""
    ? response.status(400).json({ error: "missing name" })
    : response.status(400).json({ error: "missing number" });
  return;
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
