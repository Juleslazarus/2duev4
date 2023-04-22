import React, { useState } from 'react'
import { auth, db } from './components/Firebase'
import { onAuthStateChanged } from 'firebase/auth';
import Landing from './components/Landing'
import Todo from './components/Todo'
import '../tailwind.css'
import { motion } from 'framer-motion'
import './sass/main.css'

const App = () => {
  let [userAuth, setUserAuth] = useState(false); 
  auth.onAuthStateChanged(cred => {
    if (cred) {
      setUserAuth(true); 
    }
  })

  return (
    <div >
      <motion.div initial={{display: 'flex'}} animate={{display: 'none'}} transition={{delay: 2.2, type: 'tween', duration: .4}} className='preloader h-[100vh] w-full z-50 bg-gray-900 flex justify-center items-center'>
        <motion.h1 initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .2, type: 'spring', stiffness: 100}} className='text-4xl text-blue-700 font-bold'>2</motion.h1>
        <motion.h1 initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .3, type: 'spring', stiffness: 100}} className='text-4xl text-blue-700 font-bold'>D</motion.h1>
        <motion.h1 initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .4, type: 'spring', stiffness: 100}} className='text-4xl text-blue-700 font-bold'>U</motion.h1>
        <motion.h1 initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .5, type: 'spring', stiffness: 100}} className='text-4xl text-blue-700 font-bold'>E</motion.h1>

      </motion.div>
      {userAuth ? <Todo/> : <Landing/>}
    </div>
  )
}

export default App