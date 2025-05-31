import React from 'react'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import Login from './pages/LoginPage'
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Routes>
    </div>
  )
}

export default App
