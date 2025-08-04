import React, { useContext, useState } from 'react';
import { PollContext } from '../context/pollContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, User, Lock } from 'lucide-react';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { backendURL, navigate, setToken, setAuthor } = useContext(PollContext);
  const toggleLogin = () => {
    setLogin(prev => !prev);
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (login) {
      try {
        const response = await axios.post(backendURL + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          setAuthor(response.data.name);
          localStorage.setItem('author', response.data.name);
          localStorage.setItem('token', response.data.token);
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await axios.post(backendURL + '/api/user/register', { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          setAuthor(response.data.name);
          localStorage.setItem('author', response.data.name);
          localStorage.setItem('token', response.data.token);
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  }
  return (
    <div className='flex items-center min-h-screen justify-center px-4'>
      <div className='rounded-lg grid grid-cols-1 md:grid-cols-[2fr_3fr] w-full max-w-4xl shadow-xl'>
        <div className='hidden md:flex flex-col p-4 rounded-l-lg relative justify-evenly bg-card'>
          <h1 className='text-4xl font-bold text-primary-foreground/80'>
            {login ? 'Welcome Back!' : 'Join the Debate'}
          </h1>
          <div className='text-primary/90 font-semibold text-lg'>
            {login ? 'Cast your vote or create a new poll — right where you left off.' : 'Share your voice, start a poll, or vote on trending topics.'}
          </div>
        </div>
        <div className='bg-card/70 rounded-lg md:rounded-l-none p-6 w-full'>
          <div className='flex flex-col gap-3 items-center'>
            <h1 className='text-3xl font-bold text-primary-foreground'>{login ? 'Log-In' : 'Sign Up'}</h1>
            <div className='text-primary/60 font-semibold'>{login ? 'Log in to join the conversation' : 'It only takes a minute to get started.'}</div>
            <form className='flex flex-col gap-5 mt-5 w-full' onSubmit={onSubmitHandler}>
              {!login && (
                <div className='flex flex-col gap-2 w-full items-start'>
                  <div className='flex items-center gap-1'>
                    <User size={19}/>
                    <label htmlFor='name' className='text-md font-semibold'>Your Name</label>
                  </div>       
                  <input
                    type="text"
                    name='name'
                    id='name'
                    onChange={(e)=>setName(e.target.value)}
                    className='bg-background w-full rounded-md p-2'
                    placeholder='John Doe'
                  />
                </div>
              )}
              <div className='flex flex-col gap-2 w-full items-start'>
                <div className='flex items-center gap-1'>
                  <Mail size={19} />
                  <label htmlFor='email' className='text-md font-semibold'>Your Email</label>
                </div>             
                <input
                  type="email"
                  name='email'
                  id='email'
                  onChange={(e) => setEmail(e.target.value)}
                  className='bg-background w-full rounded-md p-2'
                  placeholder='johndoe@gmail.com'
                />
              </div>
              <div className='flex flex-col gap-2 w-full items-start'>
                <div className='flex items-center gap-1'>
                  <Lock size={19} />
                  <label htmlFor='email' className='text-md font-semibold'>Your Password</label>
                </div>   
                <input
                  type="password"
                  name='password'
                  id='password'
                  onChange={(e) => setPassword(e.target.value)}
                  className='bg-background w-full rounded-md p-2'
                  placeholder='Your password'
                />
              </div>
              <div className='flex justify-center text-sm text-primary/60 cursor-pointer text-center'>
                <span onClick={toggleLogin}>
                  {login ? 'Create Account' : <span>Already have an account? <span className='font-semibold text-primary-foreground'>Log In</span> </span> }
                </span>
              </div>
              <div className='flex justify-center m-4  w-full'>
                <button type="submit" className='vote-button w-[50%]' disabled={loading}>
                  {loading ? 'Logging...' : login ? 'Log-In' : 'Sign Up'}       
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
