import React from 'react'
import { Outlet } from 'react-router'

const App = () => {
  return (
    <div className='h-screen w-full'>
      <Outlet/>
    </div>
  )
}

export default App