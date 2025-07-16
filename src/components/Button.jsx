import React from 'react'

const Button = ({text,eventFunction,className}) => {
  return (
    <div>

        <button className={`${className}`} onClick={eventFunction}>

                {text}

        </button>
    </div>
  )
}

export default Button