import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { auth, db } from './Firebase';
import { child, get, ref} from 'firebase/database';

const Menu = () => {
    let [settings, setSettings] = useState(false); 
    let [hero, setHero] = useState(false); 
    
    
  return (
    <div  className='menuComp z-2 text-white p-4 absolute top-[5%] h-[100vh] w-[100%] bg-gray-800 opacity-80'>
        
    </div>
  )
}

export default Menu