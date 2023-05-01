import React, { useState } from 'react'
import { db, auth } from './Firebase'
import { signOut } from 'firebase/auth';
import { get, set, ref, child, onValue, orderByChild, query, remove, update, orderByValue} from 'firebase/database'; 
import { motion } from 'framer-motion'
import Menu from './Menu';
import TodoItem from './TodoItem';
import '../sass/main.css'

const Todo = ({handleUserAuth}) => {
  //? Logic: 
  
  // useState Section: 
  let [menu, setMenu] = useState(false); 
  let [menuIcon, setMenuIcon] =useState(true); 
  let [todoMenu, setTodoMenu] = useState(false); 
  let [privMenu, setPrivMenu] = useState(true)
  let [sharedMenu, setSharedMenu] = useState(false); 
  
  // local_storage pull Section: 
  let selTodo = localStorage.getItem('selected_todo'); 

  //RUNTIME Functions: 
  let pullTodos = () => {
    auth.onAuthStateChanged(cred => {
      let uid = cred.uid
      let dbRef = query(ref(db, `${uid}/todos/`), orderByChild('created_At'))
      onValue(dbRef, todo_item => {
        let todoCont = document.querySelector('.todoCont'); 
        todoCont.innerHTML = ''; 
        todo_item.forEach(todoNode => {
          let todoText = todoNode.val().todoText
          let todoDiv = document.createElement('div'); 
          let todoItem = document.createElement('h1'); 
          todoItem.classList.add('todoItem'); 
          todoItem.classList.add('bg-slate-700')
          todoItem.classList.add('shadow-xl')
          todoItem.classList.add('shadow-slate-900')
          todoItem.classList.add('text-white')
          todoItem.classList.add('hover:cursor-pointer')
          todoItem.classList.add('rounded-sm')
          todoItem.classList.add('z-30'); 
          todoItem.textContent = todoText; 
          let timeStamp = document.createElement('h1'); 
          timeStamp.textContent = todoNode.val().created_At; 
          timeStamp.classList.add('text-sm')
          timeStamp.classList.add('pointer-events-none')
          todoCont.appendChild(todoItem); 
          todoItem.append(timeStamp)
          todoItem.addEventListener('click', (e) => {
            setTodoMenu(todoMenu => !todoMenu)
            let selectedTodo = e.target.firstChild.textContent; 
            let lsTodo = localStorage.setItem('selected_todo', `${selectedTodo}`)
            setTodoMenu(true); 
          })
          
        }) 
      })
    })
  }

  // functions triggered by features: 

  let closeSharedCol = () => { setSharedMenu(false) }
  let openSharedCol = () => { setSharedMenu(true) }

  let writeTodos = (e) => {
    e.preventDefault()
    auth.onAuthStateChanged(cred => {
      let uid = cred.uid
      let todoInput = document.querySelector('.todoInput'); 
      let todoInputText = todoInput.value; 
      let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      let hours = ['12', '1', '2', '3', '4', '5', '6', '7','8', '9', '10', '11', '12', '1','2', '3', '4','5', '6', '7','8', '9', '10','11' ]
      let hourCodeArr = ['am', 'am', 'am', 'am', 'am', 'am', 'am', 'am','am', 'am', 'am', 'am', 'pm', 'pm','pm', 'pm', 'pm','pm', 'pm', 'pm','pm', 'pm', 'pm','pm' ]
      const d = new Date(); 
      let hour = hours[d.getHours()]
      let hCode = hourCodeArr[d.getHours()]
      let minutes = d.getMinutes(); 
      let day = days[d.getDay()]; 
      let month = months[d.getMonth()]
      if (todoInputText === '') {
        alert('You must use the input field to write a 2Due!')
      } else {
        set(ref(db, `${uid}/todos/${todoInputText}`), {
          todoText: todoInputText, 
          created_At: `${hour}:${d.getMinutes()}:${d.getSeconds()}${hCode} ${day} ${d.getDay()} ${month} ${d.getFullYear()}`
        })
        todoInput.value = ''; 
        sendTodoAudio(); //? play the audio for sending a todo. 
      }
    })
  }

  //? handle tab clicks: 
  

  //? function for playing audio when writing a todo: 
  let sendTodoAudio = () => {
    let todoSentAudio = new Audio('./addTodo.mp3')
    todoSentAudio.play();
  }

  //? play remove todo sound effect: 
  let removeTodoAudio = () => {
    let removeTodoAudio = new Audio('./removeTodo.mp3')
    removeTodoAudio.play(); 
  }

  //? function to create shared collection: 

  let writeSharedCol = () => {
    // e.preventDefault(); 
    auth.onAuthStateChanged(cred => {
      let uid = cred.uid; 
      let sharedColLabel = document.querySelector('.sharedColLabel'); 
      let colLabel = sharedColLabel.value; 
      set(ref(db, `${uid}/shared_collections/${colLabel}`), {
        colLabel: colLabel
      }), 
      set(ref(db, `shared_collections/${colLabel}/`), {
        colLabel: colLabel
      })
       
    })
  }

  //? function to pull sharedCollections: 

  let pullSharedCols = () => {
    auth.onAuthStateChanged(cred => {
      let uid = cred.uid; 
      //? grab sharedCollections that exist for each individual user: 
      let dbRef = ref(db); 
      get(child(dbRef, `${uid}/shared_collections/`))
      .then(sharedItems => {
        sharedItems.forEach(sharedNode => {
          let colLabelText = sharedNode.val().colLabel; 
          let sharedQuery = query(ref(db, `shared_collections/${colLabelText}`))
          let sharedColsCont = document.querySelector('.sharedColsCont'); 
          onValue(sharedQuery, sharedColsItem => {
            sharedColsItem.forEach(sharedColsNode => {
              let sharedCol = document.createElement('h1'); 
              sharedCol.textContent = sharedColsNode.val().colLabel; 
              sharedColsCont.appendChild(sharedCol); 
            })
          })
        })
      })
    })
  }
  //? function for updating todos: 
  let updateTodo = (e) => {
    auth.onAuthStateChanged(cred => {
      let uid = cred.uid; 
      let selTodo = localStorage.getItem('selected_todo'); 
      let updateTodoText = document.querySelector(".updateTodoText")
      let updatedTodo = updateTodoText.textContent; 
      let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      let hours = ['12', '1', '2', '3', '4', '5', '6', '7','8', '9', '10', '11', '12', '1','2', '3', '4','5', '6', '7','8', '9', '10','11' ]
      let hourCodeArr = ['am', 'am', 'am', 'am', 'am', 'am', 'am', 'am','am', 'am', 'am', 'am', 'pm', 'pm','pm', 'pm', 'pm','pm', 'pm', 'pm','pm', 'pm', 'pm','pm' ]
      const d = new Date(); 
      let hour = hours[d.getHours()]
      let hCode = hourCodeArr[d.getHours()]
      let minutes = d.getMinutes(); 
      let day = days[d.getDay()]; 
      let month = months[d.getMonth()]
      remove(ref(db, `${uid}/todos/${selTodo}`))
      set(ref(db, `${uid}/todos/${updatedTodo}`), {
        todoText: updatedTodo, 
        created_At: `${hour}:${d.getMinutes()}:${d.getSeconds()}${hCode} ${day} ${d.getDay()} ${month} ${d.getFullYear()}`
      })
      setTodoMenu(false); 
    })
    sendTodoAudio(); 
  }
  //? function for removing todos: 
  let removeTodo = () => {
    auth.onAuthStateChanged(cred => {
      let uid = cred.uid
      let removeTodo = localStorage.getItem('selected_todo'); 
      remove(ref(db, `${uid}/todos/${removeTodo}`))
      setTodoMenu(false); 
    })
    removeTodoAudio(); 
  }

  //? input event functions: 

  let handleEnterKey = (e) => {
    let todoInput = document.getElementById('todoInput'); 
              if (e.keyCode === 13) {
                let newTodo = document.getElementById('newTodo').click(); 
              }
  }
  let handleUpdateEnterKey = (e) => {
    let updateTodoInput = document.getElementById('updateTodoInput'); 
              if (e.keyCode === 13) {
                let updateTodo = document.getElementById('updateTodo').click(); 
              }
  }

  let handleSignOut = () => {
    signOut(auth); 
  }
  

  //? active runtime functions: 
  pullTodos()

  //? GUI: 
  
  return (
    <div className='mainTodoComp h-[100vh] w-full bg-gray-900 flex flex-col justify-center items-center'>

      {/* menu when you click on a 2Due item: */}
        {
          todoMenu ? <motion.div initial={{y: '-100vh'}} animate={{y: 0}} className='h-screen w-full bg-gray-900 absolute z-[100] opacity-[92%] flex flex-col gap-5 justify-center items-center'>
            <h1 className='text-white font-bold text-xl'>Edit 2DUE:</h1>
            <p id='updateTodoInput' className='updateTodoText text-white text-4xl font-bold' contentEditable='true' onKeyDown={handleUpdateEnterKey}>{selTodo}</p>
            <i className="fa-solid fa-trash-can text-red-500 text-3xl hover:cursor-pointer" onClick={removeTodo}></i>
            <i id='updateTodo' className="fa-solid fa-pen-to-square text-3xl hover:cursor-pointer text-white" onClick={updateTodo}></i>
            <button className='text-white text-xl p-2 bg-blue-900' onClick={() => { setTodoMenu(false) }}>Close</button>
          </motion.div> : null
        }

        {/* tab switcher cont */}
        <div className='appContainer h-full w-full '>
          <div className='tabSwitcher flex h-[5%]'>
            <button className={'text-white font-bold p-2 bg-gray-800 w-full border-2 border-blue-900 rounded-tl-md' + (privMenu ? ' selected' : ' unselected') } onClick={() => { setPrivMenu(true); setSharedMenu(false);}}>Private 2Dues</button>
            <button className={'text-white font-bold p-2 bg-gray-800 w-full border-2 border-blue-900 rounded-tr-md' + (sharedMenu ? ' selected' : ' unselected')} onClick={() => { setSharedMenu(true); setPrivMenu(false);}}>Shared Collections</button>
          </div>
          { privMenu ? 
            <div className='h-[95%] w-full bg-gray-800'>
                {/* private todo menu will go here  */}
                <div className='inputCont h-[5%]'>
                  {/* write todos:  */}
                  <input type='text' className='todoInput w-[85%] h-full bg-gray-800 text-white p-4;' maxLength='140' minLength='1' placeholder='What Is There 2Due today?' onKeyDown={handleEnterKey}/>
                  <button id='newTodo' className='newTodo text-white text-center p-2 w-[15%] h-full bg-blue-500' onClick={writeTodos}>New</button>
                </div>
                <div className='h-[95%] todoCont flex flex-col items-center'>

                </div>
            </div>
            : null 
          }
          { sharedMenu ? 
            <div className='h-[95%] w-full bg-gray-800'>
                {/* shared todo menu will go here  */}

            </div>
            : null 
          }
        </div>


      {
        sharedMenu ? 
        <div>
          {/* shared collections menu will go here */}
        </div>
        : null 
      }

      {/* temporary sollution to a sign out button */}
      <button className='p-2 bg-blue-500 text-white' onClick={handleSignOut}>Sign Out</button>
    </div>
  )
}

export default Todo