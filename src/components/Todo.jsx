import React, { useState } from 'react'
import { db, auth } from './Firebase'
import { get, set, ref, child, onValue, orderByChild, query, remove, update, orderByValue} from 'firebase/database'; 
import { motion } from 'framer-motion'
import Menu from './Menu';
import TodoItem from './TodoItem';
import '../sass/main.css'

const Todo = () => {
  //? Logic: 
  
  // useState Section: 
  let [menu, setMenu] = useState(false); 
  let [menuIcon, setMenuIcon] =useState(true); 
  let [todoMenu, setTodoMenu] = useState(false); 
  
  // local_storage pull Section: 
  let selTodo = localStorage.getItem('selected_todo'); 

  //runtime Functions: 
  let pullTodos = () => {
    auth.onAuthStateChanged(cred => {
      let uid = cred.uid
      console.log(uid); 
      let dbRef = query(ref(db, `${uid}/todos/`), orderByChild('created_At'))
      onValue(dbRef, todo_item => {
        let todoCont = document.querySelector('.todoCont'); 
        todoCont.innerHTML = ''; 
        todo_item.forEach(todoNode => {
          let todoText = todoNode.val().todoText
          let todoItem = document.createElement('h1'); 
          todoItem.classList.add('todoItem'); 
          todoItem.classList.add('bg-white')
          todoItem.classList.add('shadow-lg')
          todoItem.classList.add('text-blue-500')
          todoItem.classList.add('hover:cursor-pointer')
          todoItem.classList.add('rounded-xl')
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

  // functions triggered by features: 

  let writeTodos = (e) => {
    e.preventDefault()
    auth.onAuthStateChanged(cred => {
      let uid = cred.uid
      let todoInput = document.querySelector('.todoInput'); 
      let todoInputText = todoInput.value; 
      if (todoInputText === '') {
        alert('You must use the input field to write a todo!')
      } else {
        set(ref(db, `${uid}/todos/${todoInputText}`), {
          todoText: todoInputText, 
          created_At: Date()
        })
        todoInput.value = ''; 
      }
    })
  }

  let updateTodo = (e) => {
    auth.onAuthStateChanged(cred => {
      let uid = cred.uid; 
      let selTodo = localStorage.getItem('selected_todo'); 
      let updateTodoText = document.querySelector(".updateTodoText")
      let updatedTodo = updateTodoText.textContent; 
      console.log(selTodo); 
      remove(ref(db, `${uid}/todos/${selTodo}`))
      set(ref(db, `${uid}/todos/${updatedTodo}`), {
        todoText: updatedTodo, 
        created_At: Date()
      })
      setTodoMenu(false); 
    })
  }

  let removeTodo = () => {
    auth.onAuthStateChanged(cred => {
      let uid = cred.uid
      let removeTodo = localStorage.getItem('selected_todo'); 
      remove(ref(db, `${uid}/todos/${removeTodo}`))
      setTodoMenu(false); 
    })
  }

  //? input event functions: 

  let handleEnterKey = (e) => {
    let todoInput = document.getElementById('todoInput'); 
              if (e.keyCode === 13) {
                let newTodo = document.getElementById('newTodo').click(); 
              }
  }

  //? active runtime functions: 
  pullTodos()

  //? GUI: 
  
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
          <div className='inputCont h-15% w-full flex justify-center items-center mb-2 '>
            <input id='todoInput' className='todoInput p-2 h-[100%] w-[90%] bg-gray-800 text-white z-50 ' maxLength='140' type='text' placeholder='What Is There 2Due Today?' onKeyDown={handleEnterKey}/>
            <button id='newTodo' className='p-2 bg-blue-700 h-[100%] w-[10%] text-white' onClick={writeTodos}>New 2Due</button>
          </div>
          <div className='todoCont h-[100%] w-full flex flex-col gap-4 items-center overflow-y-scroll'>
            {/* todos go into here ordered by time of creation! */}
          </div>

        </div>
        {
          todoMenu ? <motion.div initial={{y: '-100vh'}} animate={{y: 0}} className='h-screen w-full bg-gray-900 absolute z-20 opacity-[90%] flex flex-col gap-5 justify-center items-center'>
            <h1 className='text-white font-bold text-xl'>Edit 2DUE:</h1>
            <p className='updateTodoText text-white text-4xl font-bold' contentEditable='true'>{selTodo}</p>
            <i className="fa-solid fa-trash-can text-red-500 text-3xl hover:cursor-pointer" onClick={removeTodo}></i>
            <i className="fa-solid fa-pen-to-square text-3xl hover:cursor-pointer text-white" onClick={updateTodo}></i>
            <button className='text-white text-xl p-2 bg-blue-900' onClick={() => { setTodoMenu(false) }}>Close</button>
          </motion.div> : null
        }
    </div>
  )
}

export default Todo