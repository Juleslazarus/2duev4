import React, { useState } from 'react'
import { db, auth } from './Firebase'
import { get, set, ref, child, onValue, orderByChild, query, remove, update} from 'firebase/database'; 
import { motion } from 'framer-motion'
import Menu from './Menu';
import TodoItem from './TodoItem';
import '../sass/main.css'

const Todo = () => {
  let [menu, setMenu] = useState(false); 
  let [menuIcon, setMenuIcon] =useState(true); 

  //? grab something from local storage 

  let selTodo = localStorage.getItem('selected_todo'); 

  let [todoMenu, setTodoMenu] = useState(false); 
  let [selectedTodo, setSelectedTodo] = useState(''); 

  // let uid = localStorage.getItem('user_uid'); 
  
  let pullTodos = () => {
    auth.onAuthStateChanged(cred => {
      let uid = cred.uid
      console.log(uid); 
      let dbRef = query(ref(db, `${uid}/todos/`), orderByChild('createdAt'))
      onValue(dbRef, todo_item => {
        let todoCont = document.querySelector('.todoCont'); 
        todoCont.innerHTML = ''; 
        todo_item.forEach(todoNode => {
          let todoText = todoNode.val().todoText
          let todoItem = document.createElement('h1'); 
          todoItem.classList.add('todoItem'); 
          todoItem.classList.add('bg-blue-900')
          todoItem.classList.add('hover:cursor-pointer')
          todoItem.textContent = todoText; 
          todoCont.appendChild(todoItem); 
          todoItem.addEventListener('click', (e) => {
            setTodoMenu(todoMenu => !todoMenu)
            let selectedTodo = e.target.textContent; 
            let lsTodo = localStorage.setItem('selected_todo', `${selectedTodo}`)
            let testTodo = localStorage.getItem('selected_todo'); 
            console.log(testTodo + "is the test from local storage"); 
            console.log(selectedTodo + 'is the dom selected todo')
            setTodoMenu(true); 
          })
        }) 
      })
    })
  }

  let writeTodos = (e) => {
    e.preventDefault()
    auth.onAuthStateChanged(cred => {
      let uid = cred.uid
      let todoInput = document.querySelector('.todoInput'); 
      let todoInputText = todoInput.value; 
      // let ls_uid = localStorage.getItem('user_uid'); 
      set(ref(db, `${uid}/todos/${todoInputText}`), {
        todoText: todoInputText, 
        createdAt: Date()
      })
      todoInput.value = ''; 
    })
  }

  let updateTodo = (e) => {
    auth.onAuthStateChanged(cred => {
      let uid = cred.uid
      let todoInput = document.querySelector('.todoInput'); 
      let todoInputText = todoInput.value; 
      set(ref(db, `${uid}/todos/${todoInputText}`), {
        todoText: todoInputText, 
        createdAt: Date()
      })
    })
  }

  let removeTodo = () => {
    let selTodo = localStorage.getItem('selected_todo'); 
    auth.onAuthStateChanged(cred => {
      remove(ref(db, `${uid}/todos/${selTodo}`))
      .catch((err) => {
        console.log(err.message); 
      })
    })
  }

  pullTodos()
  return (
    <div className='mainTodoComp h-[100vh] w-full flex flex-col'>
        <div className='headerCont w-full h-[5%] bg-blue-900 flex p-2 items-center'>
          {menuIcon ? <i className="text-left text-white text-2xl hover:cursor-pointer fa-sharp fa-solid fa-bars absolute z-10" onClick={() => { setMenuIcon(menuIcon => !menuIcon); setMenu(menu => !menu)}}></i> : <i className=" text-white text-2xl hover:cursor-pointer fa-solid fa-xmark absolute z-10" onClick={() => { setMenuIcon( menuIcon => !menuIcon ); setMenu(menu => !menu)}}></i> }
          {
            menu ? <motion.div initial={{ y: '-200vh', opacity: 0}} animate={{y: 0, opacity: .8}} transition={{type: 'tween', duration: 1, type: 'spring', stiffness: 100, dampness: 10, velocity: 100, mass: 1}} className='h-[100vh] top-[0%] left-0 w-[100%] bg-gray-900 absolute opacity-[80%] 'onClick={() => { setMenu(menu => !menu); setMenuIcon(menuIcon => !menuIcon)}}>
                <Menu/>
            </motion.div> :  <motion.div initial={{ y: 0, opacity: 0}} animate={{y: '-200vh', opacity: .8}} transition={{type: 'tween', duration: .3, type: 'spring', stiffness: 100}} className='h-[100vh] top-[0%] w-[80%] left-0 bg-gray-900 absolute opacity-[80%] ' >
                <Menu/>
            </motion.div>
          }
        </div>

        <div className='h-[95%] w-full bg-gray-700 flex flex-col'>
          <div className='inputCont h-15% w-full flex justify-center items-center '>
            <input className='todoInput p-2 h-[100%] w-[90%] bg-gray-800 text-white ' type='text' placeholder='What Is There 2Due Today?' />
            <button className='p-2 bg-blue-700 h-[100%] w-[10%] text-white' onClick={writeTodos}>New 2Due</button>
          </div>
          <div className='todoCont h-[85%] w-full flex flex-col gap-2 '>

          </div>

        </div>
        {
          todoMenu ? <motion.div initial={{y: '-100vh'}} animate={{y: 0}} className='h-screen w-full bg-gray-900 absolute z-20 opacity-[90%] flex flex-col gap-5 justify-center items-center'>
            <h1 className='text-white font-bold text-xl'>Edit 2DUE:</h1>
            <p className='updateTodoText text-white text-4xl font-bold' contentEditable='true'>{selTodo}</p>
            <i className="fa-solid fa-trash-can text-red-500 text-3xl hover:cursor-pointer" onClick={() => {
              auth.onAuthStateChanged(cred => {
                let uid = cred.uid
                let removeTodo = localStorage.getItem('selected_todo'); 
                remove(ref(db, `${uid}/todos/${removeTodo}`))
                setTodoMenu(false); 
              })
            }}></i>
            <i className="fa-solid fa-pen-to-square text-3xl hover:cursor-pointer text-white" onClick={() => {
              auth.onAuthStateChanged(cred => {
                let uid = cred.uid; 
                let selTodo = localStorage.getItem('selected_todo'); 
                let updateTodoText = document.querySelector(".updateTodoText")
                let updatedTodo = updateTodoText.textContent; 
                console.log(selTodo); 
                remove(ref(db, `${uid}/todos/${selTodo}`))
                set(ref(db, `${uid}/todos/${updatedTodo}`), {
                  todoText: updatedTodo
                })
                setTodoMenu(false); 
              })
            }}></i>
            <button className='text-white text-xl p-2 bg-blue-900' onClick={() => { setTodoMenu(false) }}>Close</button>
          </motion.div> : null
        }
    </div>
  )
}

export default Todo