//server.js

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors");

let tasks = [];

const schema = buildSchema(`
  type Task {
    id: ID!
    title: String!
    description: String!
  }

  type Query {
    tasks: [Task]
  }

  type Mutation {
    createTask(title: String!, description: String!): Task
    deleteTask(id: ID!): Boolean
    updateTask(id: ID!, title: String, description: String): Task
  }
`);

const root = {
  tasks: () => tasks,
  createTask: ({ title, description }) => {
    const newTask = { id: tasks.length + 1, title, description };
    tasks.push(newTask);
    return newTask;
  },
  deleteTask: ({ id }) => {
    tasks = tasks.filter((task) => task.id !== parseInt(id));
    return true;
  },
  updateTask: ({ id, title, description }) => {
    const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], title, description };
      return tasks[taskIndex];
    }
    return null;
  },
};

const app = express();
app.use(cors());

app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/graphql`);
});
