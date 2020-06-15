const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes = 0 } = request.body;

  const repositorie = {
    id: uuid(),
    likes,
    techs,
    title, 
    url
  }

  repositories.push(repositorie)

  return response.status(201).json(repositorie)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;  
  const { url, title, techs } = request.body;

  const repository = repositories.find(repo => repo.id === id)

  if (!repository) return response.status(400).json({ error: 'Repository Not Found.' });
  
  let novo = {
    ...repository,
    title: title || repository.title,
    url: url || repository.url,
    techs: techs
  }

  return response.status(200).json(novo)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;  
  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  if (repositoryIndex < 0) return response.status(400).json({ error: 'Repository Not Found.' })

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const { likes = 1 } = request.body;

  const repository = repositories.find(repo => repo.id === id)

  if (!repository) return response.status(400).json({ error: 'Repository Not Found.' })

  repository.likes = Number(repository.likes) + Number(likes);

  return response.status(201).send(repository)
});

module.exports = app;
