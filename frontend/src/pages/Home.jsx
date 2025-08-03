import { ChefHat, ChevronLeft, ChevronRight, Code, Film, Menu, Music, Users, Volleyball, X } from 'lucide-react'
import React, { useState, useEffect, useContext } from 'react'
import { PollContext } from "../context/pollContext";
import { Link } from 'react-router-dom'
import milk from './milk.jpg';
import mutton from './mutton.jpg';
import paneer from './paneer.jpg';

const images = [milk, mutton, paneer];
const Home = () => {
  const [current, setCurrent] = useState(0);
  const [showCategories, setShowCategories] = useState(false);
  const { surveys } = useContext(PollContext);
  const trending2 = surveys.slice(-10).reverse();
  const trending = trending2.filter(
    (survey) => new Date(survey.poll?.dueDate) >= new Date()
  );
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };
  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };
  // 🕒 Auto-slide every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 2000);
    return () => clearInterval(interval); // Cleanup
  }, []);
  return (
    <div className='flex flex-col md:grid md:grid-cols-[4.5fr_0.5fr]'>
      <div className='flex flex-col gap-3 m-4'>
        <div className="relative w-full h-[200px] sm:h-[300px] overflow-hidden rounded-xl">
          {/* Slider Track */}
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Slide ${i}`}
                className="w-full object-cover shrink-0 grow-0 basis-full"
              />
            ))}
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-2/5 transform-translate-y-1/2 hover:bg-black/20 bg-opacity-50 text-white py-3 rounded-lg"
          >
            <ChevronLeft size={30} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-2/5 transform-translate-y-1/2 hover:bg-black/20 bg-opacity-50 text-white py-3 rounded-lg"
          >
            <ChevronRight size={30} />
          </button>
          <div className="absolute bottom-4 left-1/2 transform-translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-4 h-1 rounded-md ${current === index ? 'bg-white' : 'bg-white/50'}`}
              ></div>
            ))}
          </div>
        </div>
        <div className='flex justify-between items-start'>
          <div className='flex flex-col my-5 mx-3 gap-1 items-start'>
            <div className='font-bold text-2xl sm:text-3xl'>
              Trending Polls
            </div>
            <div className='text-primary/60 text-base sm:text-lg'>
              Discover what's buzzing among everyone?
            </div>
          </div>
          {/* 📱 Menu Button on Small Screens */}
          <button
            onClick={() => setShowCategories(true)}
            className="md:hidden text-primary px-3 pt-7 rounded shadow"
          >
            <Menu className='inline mr-1' />
          </button>
        </div>
        <div className='flex gap-4 overflow-x-auto pb-4 px-6 sm:px-2 flex-col sm:flex-row w-full'>
          {trending.map((survey, index) => {
            const totalVotes = survey.poll.participants?.reduce((sum, part) => sum + (part.count || 0), 0) || 0;
            const arranged = [...(survey.poll.participants || [])]?.sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 4);
            return (
              <div
                className="flex flex-col bg-card rounded-lg p-4 mb-6 items-start border-1 border-border min-w-[280px] max-w-sm shrink-0"
                key={index}
              >
                {/* Poll Text Info */}
                <div className='flex gap-2 items-center text-sm'>
                  <div className='bg-foreground rounded-full py-1 px-2'>{survey.poll?.category}</div>
                  <div className='bg-primary-foreground/20 text-primary-foreground rounded-full py-1 px-2'>Live</div>
                </div>
                <div className="flex flex-col items-start my-3">
                  <h3 className="text-lg sm:text-2xl font-bold text-primary">
                    {survey.poll?.title || 'Title'}
                  </h3>
                  <p className="text-primary/70 text-sm">{survey.poll?.desc || 'Description'}</p>
                </div>
                <div className='w-full flex flex-col gap-2'>
                  {arranged.map((part, i) => {
                    const percent = totalVotes > 0 ? ((part.count || 0) / totalVotes * 100).toFixed(2) : '0.00';
                    return (
                      <div className='flex flex-col gap-1' key={i}>
                        <div className='flex gap-3 justify-between text-sm'>
                          <div>{part.name}</div>
                          <div>{totalVotes > 0 ? `${percent}%` : 'No votes yet'}</div>
                        </div>
                        <div className='bg-foreground w-full rounded-full h-2 overflow-hidden'>
                          <div
                            className='bg-primary-foreground h-2 rounded-full origin-left animate-[grow_1.5s_ease-out_0.2s_forwards]'
                            style={{ '--tw-grow-width': `${percent}%`, width: "0%" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <hr className='text-primary-foreground w-full mt-5' />
                <div className="mt-6 flex flex-col gap-2 text-sm font-semibold text-primary/70 items-center w-full">
                  <div className='flex gap-2 items-center'><Users />{totalVotes}</div>
                  <div className='flex flex-col gap-2 text-center'>
                    <div>By: {survey?.author}</div>
                    <div>Due: {new Date(survey.poll?.dueDate).toLocaleDateString('en-GB')}</div>
                  </div>
                  <Link to={`/poll/${survey._id}`}>
                    <button className="vote-button px-3 py-1 rounded-md cursor-pointer text-sm sm:text-lg">
                      Be you
                    </button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {/* 📱 Sliding Category Menu */}

      {/* Overlay to close on outside click */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ease-in-out 
              ${showCategories ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setShowCategories(false)}
      />
      {/* Sliding Panel */}
      <div className={`fixed top-0 right-0 h-full w-[70%] bg-card shadow-lg z-50 transform transition-all duration-500 ease-in-out md:hidden flex flex-col p-6 gap-4 
                ${showCategories ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Categories</h2>
          <button
            className="text-primary-foreground text-lg font-semibold"
            onClick={() => setShowCategories(false)}
          >
            <X />
          </button>
        </div>
        <div className="flex flex-col gap-4 text-primary font-medium text-base">
          <div className='flex items-center gap-2'>
            <ChefHat className='text-orange-400' />
            <Link to={'/currentpoll'} state={{ category: "Cuisine" }} onClick={() => setShowCategories(false)}>Cuisine</Link>
          </div>
          <div className='flex items-center gap-2'>
            <Code className='text-blue-700' />
            <Link to={'/currentpoll'} state={{ category: "Technology" }} onClick={() => setShowCategories(false)}>Technology</Link>
          </div>
          <div className='flex items-center gap-2'>
            <Volleyball className='text-green-600' />
            <Link to={'/currentpoll'} state={{ category: "Sports" }} onClick={() => setShowCategories(false)}>Sports</Link>
          </div>
          <div className='flex items-center gap-2'>
            <Music className='text-purple-600' />
            <Link to={'/currentpoll'} state={{ category: "Music" }} onClick={() => setShowCategories(false)}>Music</Link>
          </div>
          <div className='flex items-center gap-2'>
            <Film className='text-red-600' />
            <Link to={'/currentpoll'} state={{ category: "Films" }} onClick={() => setShowCategories(false)}>Films</Link>
          </div>
        </div>
      </div>


      <div className='hidden md:flex flex-col gap-6 p-3 bg-card border-l-3 border-border'>
        <h2 className='text-primary font-bold text-xl'>Categories</h2>
        <div className='flex flex-col gap-4 font-medium text-primary px-3'>
          <div className='flex gap-3'>
            <ChefHat className='text-orange-400' /><Link to={'/currentpoll'} state={{ category: "Cuisine" }}><div className='card-hover'>Cuisine</div></Link>
          </div>
          <div className='flex gap-3'>
            <Code className='text-blue-700' /><Link to={'/currentpoll'} state={{ category: "Technology" }}><div className='card-hover'>Technology</div></Link>
          </div>
          <div className='flex gap-3'>
            <Volleyball className='text-green-600' /><Link to={'/currentpoll'} state={{ category: "Sports" }}><div className='card-hover'>Sports</div></Link>
          </div>
          <div className='flex gap-3'>
            <Music className='text-purple-600' /><Link to={'/currentpoll'} state={{ category: "Music" }}><div className='card-hover'>Music</div></Link>
          </div>
          <div className='flex gap-3'>
            <Film className='text-red-600' /><Link to={'/currentpoll'} state={{ category: "Films" }}><div className='card-hover'>Films</div></Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
