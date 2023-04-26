import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { db, auth, GoogleAuth } from './Firebase'; 
import { child, ref, set } from 'firebase/database';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import '../../tailwind.css'

const Login = ({handleLogComp, handleRegComp}) => {
  // LOGIC: 
  
  //? useState Section: 
  let [log, setLog] = useState(false); 

  // Functions activated by features: 

  //? Log users in with their creds. 
  const LoginUser = (e) => {
    e.preventDefault(); 
    let emailInput = document.querySelector('.emailInput'); 
    let passInput = document.querySelector('.passInput'); 

    let email = emailInput.value; 
    let password = passInput.value; 

    signInWithEmailAndPassword(auth, email, password)
  }

  //? handle user sign in with google auth: 
    let authGoogle = () => {
      signInWithPopup(auth, GoogleAuth)
      .then(result => {
        auth.onAuthStateChanged(cred => {
          let uid = cred.uid; 
          let user_uid = localStorage.setItem('user_uid', JSON.stringify(`${uid}`))
          const credential = GoogleAuthProvider.credentialFromResult(result);
          set(ref(db, `users/${uid}/`), {
            credential: credential, 
            uid: uid
          })
        })
      })
    }

  // GUI: 
  
  return (
    <div className="loginComp h-[100vh] w-full absolute bg-gray-900 flex flex-col justify-center items-center">
      <form className="h-[80vh] flex justify-center items-center flex-col text-white gap-4">
        <motion.h1 initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .2}}  className="text-white text-3xl font-bold">Login</motion.h1>
        <motion.label initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .5}}>Email</motion.label>
        <motion.input initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .6}} className='emailInput w-full p-2 rounded-md text-white bg-gray-800 border-2 border-blue-900 border-solid' required type='email'/>
        <motion.label initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .7}}>Password</motion.label>
        <motion.input initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .8}} className='passInput w-full p-2 rounded-md text-white bg-gray-800 border-2 border-blue-900 border-solid' required type='password'/>
        <motion.button initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: .9}} className='submitBtn p-2 rounded-md bg-blue-900' onClick={(e) => {e.preventDefault(); LoginUser()}}>Log In </motion.button>
        <motion.div initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: 1}} className='orCont flex w-full justify-center items-center gap-2'>
          <div className='h-[1px] w-[40%] border-2 border-blue-900'></div>
          <p>OR</p>
          <div className='h-[1px] w-[40%] border-2 border-blue-900'></div>
        </motion.div>
        <motion.button initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: 1}} whileHover={{background: 'rgb(0, 0, 0)', color: 'rgb(255, 255, 255)'}} className='w-full h-[5%] text-black font-bold bg-white rounded-md flex justify-center items-center gap-2' onClick={(e) => { e.preventDefault(); authGoogle()}}>
          <img className='h-[auto] w-[20px]' src='./google.png'/>
          <p>Sign In With Google</p>
        </motion.button>
        <motion.p initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: 'tween', duration: .3, delay: 1.1}} className='italic font-bold hover:cursor-pointer' onClick={() => { handleRegComp(); handleLogComp();}}>Already Have An Account? Log In Here!</motion.p>

      </form>

    </div>
  )
}

export default Login