import React, { useContext } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {

  const [currentState, setCurrentState] = React.useState('Sign Up') // 'login' or 'register'
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [isDataSubmitted, setIsDataSubmitted] = React.useState(false);

  const {login} =useContext(AuthContext);

  const onSubmitHandler=(event)=>{
    event.preventDefault();
    if(currentState === "Sign Up" && !isDataSubmitted) {
      // Handle Sign Up logic
      setIsDataSubmitted(true);
      return;
    }
    login(currentState=="Sign Up"? 'signUp': 'login', {fullName, email, password, bio});;
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex justify-center items-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      <img src={assets.logo_big} alt="" className='w-[min(30vw, 250px)]' />
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currentState}
          {
            isDataSubmitted &&           
            <img onClick={()=>setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />
          }
        </h2>
        {
          currentState==="Sign Up" && !isDataSubmitted && (
            <input 
              type="text" 
              name="" 
              id="" 
              className='p-2 border border-gray-500 rounded-md focus:outline-none' 
              placeholder='Full Name' 
              required 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )
        }
        {
          !isDataSubmitted && (
            <>
              <input 
                type="email" 
                name="" 
                id="" 
                placeholder="Email Address" 
                required 
                className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input 
                type="password" 
                name="" 
                id="" 
                placeholder="Password" 
                required 
                className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )
        }
        {
          currentState==="Sign Up" && isDataSubmitted &&(
            <textarea 
              rows={4} 
              className='p-2 border border-gray-500 rounded-md focus-outline-none focus:ring-2 focus:ring-indigo-500' 
              placeholder='Provide a Short Bio...'
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          )
        }

        <button type="submit" className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currentState==="Sign Up"? "Create Account":"Login"}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" name="" id="" />
          <p>Agree to the terms of use and Privacy Policy</p>
        </div>

        <div className="flex flex-col gap-2">
          {currentState==="Sign Up" ? (
            <p className='text-sm text-gray-600'>
              Already have an account? <span className='text-medium text-violet-500 cursor-pointer' onClick={()=>{setCurrentState("Login"); setIsDataSubmitted(false)}}>Login here</span>
            </p>
          ): (
            <p className='text-sm text-gray-600'>
              Don't have an account? <span className='text-medium text-violet-500 cursor-pointer' onClick={()=>{setCurrentState("Sign Up")}}>Create Account</span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage
