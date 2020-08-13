const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  if (repositories.length > 0 ){
    return response.status(200).json(repositories)
  }else{
    return response.status(204).json({error: 'No projects found'})
  }
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body

  const repositorie = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repositorie)

  return response.status(201).json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs, likes} = request.body
  const {id} = request.params

  const repositorie_index = repositories.findIndex(repositorie => repositorie.id == id)

  if(repositorie_index < 0){
    return response.status(400).json({error: 'This repository does not exists'})
  }

  const repositorie = {
    ...repositories[repositorie_index],
    title,
    url,
    techs,
  }

  repositories[repositorie_index] = repositorie

  return response.status(200).json(repositorie)

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params

  const repositorie_index = repositories.findIndex(repositorie => repositorie.id == id)
  
  if(repositorie_index < 0){
    return response.status(400).json({error: 'This repository does not exists'})
  }
  
  repositories.splice(repositorie_index, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params

  const repositorie_index = repositories.findIndex(repositorie => repositorie.id == id)
  
  const repositorie = repositories[repositorie_index]

  if (!repositorie){
    response.status(400).json({error: 'This repository does not exists'})
  }

  repositorie.likes += 1
  
  return response.status(200).json(repositorie)
});

module.exports = app;
