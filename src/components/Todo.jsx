import React, { useState } from 'react'
import { db, auth } from './Firebase'
import { get, set, ref, child, onValue, orderByChild, query, } from 'firebase/database'; 
import { motion } from 'framer-motion'
import Menu from './Menu';
import TodoItem from './TodoItem';
import { render } from 'react-dom';


const Todo = () => {
  let [menu, setMenu] = useState(false); 
  let [menuIcon, setMenuIcon] =useState(true); 

  
  

  //? function that updates the hero text: 
  
  let pullTodos = () => {
    auth.onAuthStateChanged(cred => {
      let uid = cred.uid; 
      let dbRef = query(ref(db, `users/${uid}/todos/`), orderByChild('createdAt'))
      onValue(dbRef, todo_item => {
        let todoCont = document.querySelector('.todoCont'); 
        todoCont.innerHTML = ''; 
        todo_item.forEach(todoNode => {
          let todoText = todoNode.val().todoText
          let todoItem = document.createElement('h1'); 
          todoItem.classList.add('todoItem'); 
          todoItem.classList.add('bg-blue-900')
          todoItem.classList.add('m-2')
          todoItem.textContent = todoText; 
          todoCont.appendChild(todoItem); 
        }) 
      })
    })
  }
  pullTodos()
  return (
    <div className='mainTodoComp h-[100vh] w-full flex flex-col'>
        <div className='headerCont w-full h-[5%] bg-blue-900 flex p-2 items-center'>
          {menuIcon ? <i class="text-left text-white text-2xl hover:cursor-pointer fa-sharp fa-solid fa-bars absolute z-10" onClick={() => { setMenuIcon(menuIcon => !menuIcon); setMenu(menu => !menu)}}></i> : <i className=" text-white text-2xl hover:cursor-pointer fa-solid fa-xmark absolute z-10" onClick={() => { setMenuIcon( menuIcon => !menuIcon ); setMenu(menu => !menu)}}></i> }
          {
            menu ? <motion.div initial={{ x: -400, opacity: 0}} animate={{x: -8, opacity: 1}} transition={{type: 'tween', duration: .3, type: 'spring', stiffness: 100}} className='h-[100vh] top-[0%] w-[80%] bg-gray-900 absolute '>
                <Menu/>
            </motion.div> :  null
          }
        </div>
        <div className='appCont w-full h-[95%]'>
          <div className='todoInputCont h-[5%]  w-full'>
            <input className='todoInput w-[90%] h-full text-blue-900 p-2 border-0 outline-none' placeholder='Type Your 2Due Here!' type="text" />
            <button className='addTodo hover:cursor-pointer bg-blue-500 text-white font-bold  p-2 w-[10%] h-full' onClick={(e) => {
              e.preventDefault()
              let todoInput = document.querySelector('.todoInput'); 
              let todoInputText = todoInput.value; 
              auth.onAuthStateChanged(cred => {
                let uid = cred.uid; 
                set(ref(db, `users/${uid}/todos/${todoInputText}`), {
                  todoText: todoInputText
                })
              })
            }}>New 2Due</button>
          </div>
          <div className='todoCont h-[87%] w-full'>
            
          </div>
        </div>
    </div>
  )
}

export default Todo