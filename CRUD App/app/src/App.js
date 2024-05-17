// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.log(error));
  }, []);

  console.log(todos);

  const addTodo = () => {
    if (editTodoId) {
      axios.put(`http://localhost:5000/api/todos/${editTodoId}`, { text: editTodoText })
        .then(response => {
          const updatedTodos = todos.map(todo => {
            if (todo.id === editTodoId) {
              return { ...todo, text: response.data.text };
            }
            return todo;
          });
          setTodos(updatedTodos);
          setEditTodoId(null);
          setEditTodoText('');
        })
        .catch(error => console.log(error));
    } else {
      axios.post('http://localhost:5000/api/todos', { text: todoText })
        .then(response => {
          setTodos([...todos, response.data]);
          setTodoText('');
        })
        .catch(error => console.log(error));
    }
  };

  const editTodo = (id, text) => {
    setEditTodoId(id);
    setEditTodoText(text);
  };

  const deleteTodo = (_id) => {
    axios.delete(`http://localhost:5000/api/todos/${_id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== _id));
      })
      .catch(error => console.log(error));
  };

  return (
    <div>
      <h1>Todo App</h1>
      <input
        type="text"
        // value={editTodo ? editTodoText : todoText}
        value={todoText}
        onChange={e => setTodoText(e.target.value)}
      // disabled={editTodoId !== null}
      />

      <button onClick={addTodo}>{editTodoId ? 'Update Todo' : 'Add Todo'}</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.id !== editTodoId ? (
              <>
                {todo.text}
                <button onClick={() => editTodo(todo._id, todo.text)}>Edit</button>
                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
              </>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
