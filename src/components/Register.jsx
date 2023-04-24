import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { db, auth, GoogleAuth } from './Firebase'; 
import { child, ref, set } from 'firebase/database';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import '../../tailwind.css'

const Register = ({handleRegComp, handleLogComp}) => {
  // Logic: 
  
  // useState Section: 
  let [log, setLog] = useState(false); 


  //? feature activated functions: 

  //Register a user with manual inputs
  const registerUser = (e) => { 
    let nameInput = document.querySelector('.nameInput'); 
    let emailInput = document.querySelector('.emailInput'); 
    let passInput = document.querySelector('.passInput'); 

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


  //? Handle auth with google: 

  let authGoogle = () => {
    signInWithPopup(auth, GoogleAuth)
    .then(result => {
      auth.onAuthStateChanged(cred => {
        let uid = cred.uid; 
        const credential = GoogleAuthProvider.credentialFromResult(result);
        set(ref(db, `${uid}/`), {
          uid: `${uid}`
        })
      })
    })
  }
  // GUI: 
  
  return (
    <div className="registerComp h-[100vh] w-full absolute bg-gray-900 flex flex-col justify-center items-center">
      <form className="h-[80vh] flex justify-center items-center flex-col text-white gap-4">
        <motion.h1 initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .2}}  className="text-white text-3xl font-bold">Register</motion.h1>
        <motion.label initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .3}}>First Name</motion.label>
        <motion.input initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .4}} className='nameInput w-full p-2 rounded-md text-white bg-gray-800 border-2 border-blue-900 border-solid' required type='text'/>
        <motion.label initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .5}}>Email</motion.label>
        <motion.input initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .6}} className='emailInput w-full p-2 rounded-md text-white bg-gray-800 border-2 border-blue-900 border-solid' required type='email'/>
        <motion.label initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .7}}>Password</motion.label>
        <motion.input initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .8}} className='passInput w-full p-2 rounded-md text-white bg-gray-800 border-2 border-blue-900 border-solid' required type='password'/>
        <motion.button initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .9}} className='submitBtn p-2 rounded-md bg-blue-900' onClick={(e) => {e.preventDefault(); registerUser()}}>Register</motion.button>
        <motion.div initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: 1}} className='orCont flex w-full justify-center items-center gap-2'>
          <div className='h-[1px] w-[40%] border-2 border-blue-900'></div>
          <p>OR</p>
          <div className='h-[1px] w-[40%] border-2 border-blue-900'></div>
        </motion.div>
        <motion.button initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: 1.2}} whileHover={{background: 'rgb(0, 0, 0)', color: 'rgb(255, 255, 255)'}} className='w-full h-[5%] text-black font-bold bg-white rounded-md flex justify-center items-center gap-2' onClick={(e) => { e.preventDefault(); authGoogle()}}>
          <img className='h-[auto] w-[20px]' src='./google.png'/>
          <p>Sign In With Google</p>
        </motion.button>
        <motion.p initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: 1.3}} className='italic font-bold hover:cursor-pointer' onClick={() => { handleRegComp(); handleLogComp();}}>Already Have An Account? Log In Here!</motion.p>
      </form>

    </div>
  )
}

export default Register