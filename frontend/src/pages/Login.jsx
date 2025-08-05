import React, { useContext, useState } from 'react';
import { PollContext } from '../context/pollContext';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Mail, User, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { backendURL, navigate, setToken, setAuthor } = useContext(PollContext);

  const toggleLogin = () => setLogin(prev => !prev);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = login ? '/api/user/login' : '/api/user/register';
    const payload = login ? { email, password } : { name, email, password };

    try {
      const response = await axios.post(backendURL + endpoint, payload);
      if (response.data.success) {
        setToken(response.data.token);
        setAuthor(response.data.name);
        localStorage.setItem('author', response.data.name);
        localStorage.setItem('token', response.data.token);
        navigate('/');
      } else {
        toast({
          title: login ? t('loginTitle') + ' Failed' : t('signupTitle') + ' Failed',
          description: response.data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: t('loginTitle'),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center min-h-screen justify-center px-4'>
      <div className='rounded-lg grid grid-cols-1 md:grid-cols-[2fr_3fr] w-full max-w-4xl shadow-xl'>
        <div className='hidden md:flex flex-col p-4 rounded-l-lg relative justify-evenly bg-card'>
          <h1 className='text-4xl font-bold text-primary-foreground/80'>
            {login ? t('welcomeBack') : t('joinDebate')}
          </h1>
          <div className='text-primary/90 font-semibold text-lg'>
            {login ? t('loginSubtext') : t('signupSubtext')}
          </div>
        </div>
        <div className='bg-card/70 rounded-lg md:rounded-l-none p-6 w-full'>
          <div className='flex flex-col gap-3 items-center'>
            <h1 className='text-3xl font-bold text-primary-foreground'>
              {login ? t('loginTitle') : t('signupTitle')}
            </h1>
            <div className='text-primary/60 font-semibold'>
              {login ? t('loginDesc') : t('signupDesc')}
            </div>
            <form className='flex flex-col gap-5 mt-5 w-full' onSubmit={onSubmitHandler}>
              {!login && (
                <div className='flex flex-col gap-2 w-full items-start'>
                  <div className='flex items-center gap-1'>
                    <User size={19} />
                    <label htmlFor='name' className='text-md font-semibold'>{t('yourName')}</label>
                  </div>
                  <input
                    type="text"
                    name='name'
                    id='name'
                    onChange={(e) => setName(e.target.value)}
                    className='bg-background w-full rounded-md p-2'
                    placeholder={t('placeholderName')}
                  />
                </div>
              )}
              <div className='flex flex-col gap-2 w-full items-start'>
                <div className='flex items-center gap-1'>
                  <Mail size={19} />
                  <label htmlFor='email' className='text-md font-semibold'>{t('yourEmail')}</label>
                </div>
                <input
                  type="email"
                  name='email'
                  id='email'
                  onChange={(e) => setEmail(e.target.value)}
                  className='bg-background w-full rounded-md p-2'
                  placeholder={t('placeholderEmail')}
                />
              </div>
              <div className='flex flex-col gap-2 w-full items-start'>
                <div className='flex items-center gap-1'>
                  <Lock size={19} />
                  <label htmlFor='password' className='text-md font-semibold'>{t('yourPassword')}</label>
                </div>
                <input
                  type="password"
                  name='password'
                  id='password'
                  onChange={(e) => setPassword(e.target.value)}
                  className='bg-background w-full rounded-md p-2'
                  placeholder={t('placeholderPassword')}
                />
              </div>
              <div className='flex justify-center text-sm text-primary/60 cursor-pointer text-center'>
                <span onClick={toggleLogin}>
                  {login
                    ? t('createAccount')
                    : <span>{t('alreadyHaveAccount')} <span className='font-semibold text-primary-foreground'>{t('loginNow')}</span></span>}
                </span>
              </div>
              <div className='flex justify-center m-4 w-full'>
                <button type="submit" className='vote-button w-[50%]' disabled={loading}>
                  {loading ? (login ? t('loggingIn') : t('signingUp')) : (login ? t('loginTitle') : t('signupTitle'))}
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
