import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { auth, db } from './Firebase';
import { child, get, ref} from 'firebase/database';

const Menu = () => {
    let [settings, setSettings] = useState(false); 
    let [hero, setHero] = useState(false); 
    
    let dbRef = ref(db)
    auth.onAuthStateChanged(cred => {
        let uid = cred.uid

        get(child(dbRef, `users/${uid}/settings/`))
        .then(userNode => {
            let heroStatus = userNode.val().hero
            if (heroStatus === 'true') {
                setHero(true); 
            } else {
                setHero(false); //? this is going to be displaying the on/off icons for the hero in the settings. this doesnt control the visibility of the actual hero 
            }
        })
    })
  return (
    <div  className='menuComp z-20 text-white p-4 absolute top-[5%] h-[100vh] w-[100%] bg-gray-800'>
        <i class="settingsModal text-1xl fa-sharp fa-solid fa-gear flex gap-2 hover:cursor-pointer z-30" onClick={() => { setSettings(settings => !settings)}}></i>
        { settings ? <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 10}} transition={{type: 'tween', duration: .3, type: 'spring', stiffness: 100}} className=' h-[150px] w-[100%] bg-gray-900'>
            
        </motion.div> : null}
    </div>
  )
}

export default Menu