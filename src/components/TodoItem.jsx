import React from 'react'

const TodoItem = (props) => {
  return (
    <div className='todoItem h-[5%] w-[full] bg-blue-500 m-2'>
        <h1>{props.todoText}</h1>
    </div>
  )
}

export default TodoItem