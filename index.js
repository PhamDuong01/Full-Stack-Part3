const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const PORT = process.env.PORT || 3001;

//setup morgan to log requests
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`));

//setup cors
app.use(express.json());
app.use(express.static("build"));
app.use(cors());

//Router
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", async (request, response, next) => {
  Person.find({})
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/info", async (request, response) => {
  const time = new Date();
  let number = await Person.find({}).then((result) => {
    return result.length;
  });
  return response.send(`<p>Phonebook has info for ${number} people </p>
  <p>${time}</p>
  `);
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      return response.status(204).end();
      // response.status(400).json({ error: "a was already removed from server" });
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  person = new Person(request.body);

  person
    .save()
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});
app.put("/api/persons/:id", (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatePerson) => {
      return response.json(updatePerson);
      // response.status(400).json({ error: "a was already removed from server" });
    })
    .catch((error) => next(error));
});
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  // console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(unknownEndpoint);
app.use(errorHandler);
//start server

app.listen(PORT);
console.log(`Server running on port ${PORT}`);
