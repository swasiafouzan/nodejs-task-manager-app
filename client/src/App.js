import React, { useState } from "react";
import {
  useQuery,
  useMutation,
  gql,
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";
import "./App.css";

const GET_TASKS = gql`
  query {
    tasks {
      id
      title
      description
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String!) {
    createTask(title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String, $description: String) {
    updateTask(id: $id, title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_TASKS);
  const [createTask] = useMutation(CREATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);

  const [newTask, setNewTask] = useState({ title: "", description: "" });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleCreateTask = () => {
    createTask({
      variables: newTask,
      refetchQueries: [{ query: GET_TASKS }],
    });
    setNewTask({ title: "", description: "" });
  };

  const handleDeleteTask = (id) => {
    deleteTask({
      variables: { id },
      refetchQueries: [{ query: GET_TASKS }],
    });
  };

  const handleUpdateTask = (id, title, description) => {
    updateTask({
      variables: { id, title, description },
      refetchQueries: [{ query: GET_TASKS }],
    });
  };

  return (
    <div>
      <h1>GeeksforGeeks</h1>
      <h3>Task Manager</h3>
      <div>
        <h2>Create Task</h2>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <button onClick={handleCreateTask}>Create</button>
      </div>
      <div>
        <h2>Tasks</h2>
        <ul>
          {data.tasks.map((task) => (
            <li key={task.id}>
              {task.title} - {task.description}
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
              <button
                onClick={() => {
                  const updatedTitle = prompt("Enter new title:", task.title);
                  const updatedDescription = prompt(
                    "Enter new description:",
                    task.description
                  );
                  handleUpdateTask(task.id, updatedTitle, updatedDescription);
                }}
              >
                Update
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const client = new ApolloClient({
  uri: "http://localhost:3001/graphql",
  cache: new InMemoryCache(),
});

function ApolloApp() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}
export default ApolloApp;
