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
  let [sharedMenu, setSharedMenu] = useState(false); 
  
  // local_storage pull Section: 
  let selTodo = localStorage.getItem('selected_todo'); 

  //runtime Functions: 
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
          todoItem.classList.add('bg-blue-400')
          todoItem.classList.add('shadow-xl')
          todoItem.classList.add('shadow-blye-900')
          todoItem.classList.add('text-white')
          todoItem.classList.add('hover:cursor-pointer')
          todoItem.classList.add('rounded-xl')
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
          created_At: `${hour}:${d.getMinutes()}:${d.getSeconds()}${hCode} ${day} ${month} ${d.getFullYear()}`
        })
        todoInput.value = ''; 
      }
    })
    sendTodoAudio(); //? play the audio for sending a todo. 
  }

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
        created_At: `${hour}:${d.getMinutes()}:${d.getSeconds()}${hCode} ${day} ${month} ${d.getFullYear()}`
      })
      setTodoMenu(false); 
    })
    sendTodoAudio(); 
  }

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


          {/* SHARED COLLECTIONS SECTION:  ----------------------------------------------------------------*/}


        <div className='h-[95%] w-full bg-gray-800 flexyeag flex-col '>
          {
            sharedMenu ? <motion.div initial={{x: '100vw', opacity: 0, display: 'none'}} animate={{x: 0, opacity: 1, display: 'flex'}} transition={{type: 'tween', duration: .2}} className='h-[100%] w-full flex-col top-19 bg-gradient-to-b from-indigo-200 to-blue-300 z-[60] absolute '>
              <div className='createSharedCol flex'>
                <input className='sharedColLabel w-[80%] bg-gray-800 text-white p-2' placeholder='Shared Collection Label' type='text'/>
                <button className='text-white font-bold w-[20%] bg-blue-500 p-2' onClick={() => {writeSharedCol(); pullSharedCols()}}>Create Shared Collection</button>
              </div>
              <div className='sharedColsCont flex flex-col items-center mt-5'>
                {/* shared collections will go in here! */}
              </div>
            </motion.div>  : <motion.div initial={{x: 0, opacity: 1, display: 'flex'}} animate={{x: '100vw', opacity: 0, display: 'none'}} transition={{type: 'tween', duration: .4}} className='h-[100%] w-full bg-gradient-to-b from-indigo-200 to-blue-300 z-[60] absolute'>

</motion.div> 
          }
          <div className='inputCont h-15% w-full flex justify-center items-center mb-2 '>
            <input id='todoInput' className='todoInput p-2 h-[100%] w-[85%] bg-gray-800 text-white z-50 ' maxLength='140' type='text' placeholder='What Is There 2Due Today?' onKeyDown={handleEnterKey}/>
            <button id='newTodo' className='p-2 bg-blue-700 h-[100%] w-[15%] text-white font-bold' onClick={writeTodos}>New 2Due</button>
          </div>
          <div className='todoCont h-[100%] w-full flex flex-col gap-4 items-center overflow-y-scroll'>
            {/* todos go into here ordered by time of creation! */}
          </div>
          
        <div className='sectionNav flex gap-10 justify-center mb-5 flex-wrap'>
            <button className='privCollections p-2 bg-blue-500 rounded-md text-white font-bold z-[60]' onClick={closeSharedCol}>Private 2Dues!</button>
            <button className='pubCollections p-2 bg-blue-500 rounded-md text-white font-bold z-[60]' onClick={() => {openSharedCol(); pullSharedCols(); }}>Shared 2Dues!</button>
        </div>
        </div>
        {
          todoMenu ? <motion.div initial={{y: '-100vh'}} animate={{y: 0}} className='h-screen w-full bg-gray-900 absolute z-[100] opacity-[92%] flex flex-col gap-5 justify-center items-center'>
            <h1 className='text-white font-bold text-xl'>Edit 2DUE:</h1>
            <p id='updateTodoInput' className='updateTodoText text-white text-4xl font-bold' contentEditable='true' onKeyDown={handleUpdateEnterKey}>{selTodo}</p>
            <i className="fa-solid fa-trash-can text-red-500 text-3xl hover:cursor-pointer" onClick={removeTodo}></i>
            <i id='updateTodo' className="fa-solid fa-pen-to-square text-3xl hover:cursor-pointer text-white" onClick={updateTodo}></i>
            <button className='text-white text-xl p-2 bg-blue-900' onClick={() => { setTodoMenu(false) }}>Close</button>
          </motion.div> : null
        }

    </div>
  )
}

export default Todo