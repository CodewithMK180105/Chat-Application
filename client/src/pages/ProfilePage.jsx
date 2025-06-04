import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';

const ProfilePage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState("Manishkumar");
  const [bio, setBio] = useState("A passionate web developer");

  useEffect(() => {
    if (!selectedImg) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImg);
    setPreview(objectUrl);

    // Free memory when component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImg]);

  const handleSubmit = (e) => {
    e.preventDefault(); 
    navigate('/'); // Redirect to home or another page after saving
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-center max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input 
              type="file" 
              id="avatar" 
              accept=".png, .jpg, .jpeg" 
              hidden 
              onChange={(e) => setSelectedImg(e.target.files[0])}  
            />
            <img 
              src={preview || assets.avatar_icon} 
              alt="profile" 
              className={`w-12 h-12 ${preview && 'rounded-full'}`} 
            />
            Upload profile image
          </label>

          <input 
            type="text" 
            required
            placeholder='Your Name'
            className='p-2 border border-gray-500 rounded-md focus-outline-none focus:ring-2 focus:ring-violet-500'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea 
            placeholder='Write Profile Bio' 
            required
            className='p-2 border border-gray-500 rounded-md focus-outline-none focus:ring-2 focus:ring-violet-500'          
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          >
          </textarea>
          <button 
            type="submit"
            className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'
          >
            Save
          </button>
        </form>
        <img 
          src={assets.logo_icon} 
          alt="" 
          className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10'
        />
      </div>
    </div>
  );
}

export default ProfilePage;
