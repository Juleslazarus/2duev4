import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { db, auth } from './Firebase'; 
import { child, ref, set } from 'firebase/database';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const Register = () => {
  let [log, setLog] = useState(false); 

  const register = (e) => {
    let nameInput = document.querySelector('.nameInput'); 
    let emailInput = document.querySelector('.emailInput'); 
    let passInput = document.querySelector('.passInput'); 
    // let submitBtn = document.querySelector('.submitBtn'); 

    let fname = nameInput.value; 
    let email = emailInput.value; 
    let password = passInput.value; 

    createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      auth.onAuthStateChanged(cred => {
        let uid = cred.uid; 
        set(ref(db, `users/${uid}/`), {
          name: fname, 
          email: email, 
          uid: uid
        }), 
        set(ref(db, `users/${uid}/settings/`), {
          hero: 'true', 
          heroText: 'What Is There 2Due Today?'
        })
      })
    })
  }

  return (
    <div className="registerComp h-[100vh] w-full absolute bg-gray-900 flex justify-center items-center">
      <form className="h-[80vh] w-[80vw] flex justify-center items-center flex flex-col text-white gap-4">
        <motion.h1 initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .2}}  className="text-white text-3xl font-bold">2Due Register</motion.h1>
        <motion.label initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .3}}>First Name</motion.label>
        <motion.input initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .4}} className='nameInput p-2 rounded-md text-white bg-gray-800 border-2 border-blue-900 border-solid' required type='text'/>
        <motion.label initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .5}}>Email</motion.label>
        <motion.input initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .6}} className='emailInput p-2 rounded-md text-white bg-gray-800 border-2 border-blue-900 border-solid' required type='email'/>
        <motion.label initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .7}}>Password</motion.label>
        <motion.input initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .8}} className='passInput p-2 rounded-md text-white bg-gray-800 border-2 border-blue-900 border-solid' required type='password'/>
        <motion.button initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .9}} className='submitBtn p-2 rounded-md bg-blue-900' onClick={(e) => {e.preventDefault(); register()}}>Register</motion.button>
      </form>
    </div>
  )
}

export default Register