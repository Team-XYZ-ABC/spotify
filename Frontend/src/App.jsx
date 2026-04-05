import React, { useEffect } from 'react'
import { Outlet } from 'react-router'
import useAuth from './hooks/useAuth'
import Loader from './components/ui/Loader'

const App = () => {
  const { getMe, isInitializing } = useAuth()

  useEffect(() => {
    getMe()
  }, [getMe])


  if (isInitializing) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className='h-screen w-full'>
      <Outlet />
    </div>
  )
}

export default App