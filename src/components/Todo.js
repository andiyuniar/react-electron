import React, { useState, useRef, useEffect } from 'react';
import {dbService} from '../services/dbService';
import { v4 as uuidv4 } from 'uuid';


const Todo = () => {
  const [todos, setTodos] = useState([]);
  const formtxt = useRef();
  const timetxt = useRef();
  const activitytxt = useRef();

  useEffect(() => {
    // init state from db
    async function fetchData(){
      const dbSvc = new dbService();
      dbSvc.getAll().then(result => {
        setTodos(result);
      }).catch(err => console.log(err))
    }
    fetchData();
  }, [])


  const addTodo = (e) => {
    e.preventDefault();

    let id = uuidv4();
    let time = timetxt.current.value;
    let activity = activitytxt.current.value;
    
    // insert into db
    const dbSvc = new dbService();
    dbSvc.insert({id, time, activity})
    .then(() => {
      const temp = [...todos];
      temp.push({ id, time, activity });

      setTodos(temp);
    })
    .catch(err => console.log('Something went wrong. ', err));

    formtxt.current.reset();
    console.log(todos);
  }

  const deleteTodo = (idx) => {
    console.log('delete');
    const dbSvc = new dbService();
    dbSvc.delete(idx)
    .then(() => console.log('successfully deleted'))
    .catch(err => console.log('Delete failed. ', err));

    //update state
    dbSvc.getAll()
    .then(result => setTodos(result))
    .catch(err => console.log(err));
  }

  return (
    <div >
      <form ref={formtxt} className='content'>
        <input type='text' ref={timetxt} placeholder='Time' />
        <input type='text' ref={activitytxt} placeholder='Activity' />
        <button onClick={addTodo}>Save</button>
      </form>
      <hr/>
      <div className='content'>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Time</th>
              <th>Activity</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            { todos.map((data, idx) => 
              <tr key={idx}>
                <td>{idx+1}</td>
                <td>{data.time}</td>
                <td>{data.activity}</td>
                <td><button onClick={() => deleteTodo(data.id)}>Delete</button></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Todo;