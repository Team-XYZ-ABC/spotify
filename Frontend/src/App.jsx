import React, { useEffect } from 'react'
import { Outlet } from 'react-router'
import useAuth from './hooks/useAuth'
import Loader from './components/ui/Loader'

const App = () => {
const {getMe, loading, error, user} = useAuth()
console.log(user)
  useEffect(()=>{
    getMe()
  },[])


  return (
    <div className='h-screen w-full'>
      <Outlet/>
    </div>
  )
}

export default App