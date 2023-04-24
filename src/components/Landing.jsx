import React, { useState } from 'react'
import Register from './Register'
import Login from './Login'
import { motion } from 'framer-motion'

const Landing = () => {
    let [reg, setReg] = useState(false); 
    let [log, setLog] = useState(false); 

    let handleRegComp = () => {
        setReg(reg => !reg)
    }
    let handleLogComp = () => {
        setLog(log => !log)
    }

  return (
    <div className='landingComp h-[100vh] w-full bg-gray-900 flex flex-col gap-8 justify-center items-center'>
        <motion.h1 initial={{y: -20, opacity: 0, scale: .9}} animate={{y: 0, opacity: 1, scale: 1 }} transition={{type: 'tween', duration: 1}} className='text-white text-3xl font-bold text-center'>Welcome To 2Due v4</motion.h1>
        <div className='choicesCont flex gap-8 flex-wrap justify-center items-center'>
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{type: 'tween', duration: 1, delay: .5}} className='h-[8rem] w-[8rem] border-solid border-blue-900 border-2 flex justify-center items-center transition-all ease-in-out hover:cursor-pointer hover:scale-[1.2]' onClick={() => {setLog(log => !log); setReg(false)}}>
                <h1 className='text-white text-1xl font-bold'>Log In</h1>
            </motion.div>
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{type: 'tween', duration: 1, delay: .5}} className='h-[8rem] w-[8rem] border-solid border-blue-900 border-2 flex justify-center items-center transition-all ease-in-out hover:cursor-pointer hover:scale-[1.2]' onClick={() => {setReg(reg => !reg); setLog(false) }}>
                <h1 className='text-white text-1xl font-bold'>Register</h1>
            </motion.div>
        </div>
        {
            reg ? <Register handleRegComp={handleRegComp} handleLogComp={handleLogComp} /> : null
        }
        {
            log ? <Login handleLogComp={handleLogComp} handleRegComp={handleRegComp}/> : null
        }
    </div>
  )
}

export default Landing