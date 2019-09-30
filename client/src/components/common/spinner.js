import React from 'react'
import spinner from  '../../static/loading.gif'

export default function Spinner() {
  return (
    <div>
      <img
        src={spinner}
        alt="loading..."
        style= {{ width: '120px', margin: 'auto'}}
      />
    </div>
  )
}