import React, { useContext, useState, useEffect } from 'react'
import { PollContext } from '../context/pollContext'
import { X, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { backendURL, surveys, token, author, getPolls, navigate } = useContext(PollContext);
  const [selectedTab, setSelectedTab] = useState('all');
  const myPolls2 = surveys.filter((survey) => survey.author === author);
  const myPolls = myPolls2.reverse();
  const currentDate = new Date();
  const { toast } = useToast();
  const myPollsFiltered = myPolls.filter((survey) => {
    const dueDate = new Date(survey.poll?.dueDate);
    if (selectedTab === 'active') {
      return dueDate > currentDate;
    } else if (selectedTab === 'past') {
      return dueDate <= currentDate;
    }
    return true; // for 'all'
  });
  const getTabClass = (tab) =>
    `cursor-pointer rounded-lg w-fit p-1 px-2 transition-colors ${selectedTab === tab ? 'bg-foreground/80 text-primary' : 'hover:bg-foreground/40 text-primary/50'
    }`;
  const handleRemove = async (id) => {
    try {
      const response = await axios.delete(`${backendURL}/api/poll/delete/${id}`, { headers: { token } })
      if (response.data.success) {
        toast({
          title: "Poll Deleted 🎉",
          description: "Your poll has been successfully removed.",
        });
        await getPolls(author);
      } else {
        toast({
          title: "Deletion Failed",
          description: response.data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  }
  useEffect(() => {
    if (!token) {
      toast.warning("Please log in to view your profile");
      navigate('/login'); // 👈 Change this route to wherever your login page is
    }
  }, [token, navigate]); // 👈 Runs when component mounts or token changes
  return (
    <div>
      <h1 className='font-bold text-3xl my-5 '>Publisher: {author}</h1>
      <div className='bg-card flex flex-col p-5 m-5 rounded-xl'>
        <div className='flex flex-row justify-between items-start'>
          <div className='text-2xl font-bold'>My Polls</div>
          <div className='bg-foreground/50 p-1 rounded-lg flex flex-row justify-evenly gap-4 text-md font-semibold'>
            <div
              className={getTabClass('all')}
              onClick={() => setSelectedTab('all')}
            >
              All Polls
            </div>
            <div
              className={getTabClass('active')}
              onClick={() => setSelectedTab('active')}
            >
              Active Polls
            </div>
            <div
              className={getTabClass('past')}
              onClick={() => setSelectedTab('past')}
            >
              Past Polls
            </div>
          </div>
        </div>
        <div className='flex sm:flex-row flex-col gap-5 my-5'>
          {myPollsFiltered.length === 0 ? (
            <p className="text-center text-muted-foreground">No current polls available.</p>
          ) : (
            myPollsFiltered.map((survey, index) => {
              const totalVotes = survey.poll.participants?.reduce((sum, part) => sum + (part.count || 0), 0) || 0;
              const arranged2 = [...(survey.poll.participants || [])]?.sort((a, b) => (b.count || 0) - (a.count || 0));
              const arranged = arranged2.slice(0, 4);
              const dueDate = new Date(survey.poll?.dueDate);
              const isExpired = dueDate <= new Date();
              return (
                <div
                  className={`flex flex-col bg-foreground/10 rounded-lg p-4 mb-6 items-start border-1 border-border min-w-[300px] max-w-md shrink-0`}
                  key={index}
                >
                  {/* Poll Text Info */}
                  <div className='flex gap-2 items-center text-sm font-semibold justify-between w-full'>
                    <div className='flex flex-row gap-1'>
                      <div className='bg-foreground rounded-full py-1 px-2'>{survey.poll?.category}</div>
                      <div className={`rounded-full py-1 px-2 ${isExpired ? 'bg-red-700 text-white' : 'bg-primary-foreground/20 text-primary-foreground'}`}>
                        {isExpired ? 'Expired' : 'Live'}
                      </div>
                    </div>
                    <button className='transition-colors duration-300 hover:text-primary cursor-pointer flex justify-center'
                      onClick={() => handleRemove(survey._id)}
                    >
                      <X />
                    </button>
                  </div>
                  <div className="flex flex-col items-start my-3">
                    <h3 className="text-2xl font-bold text-primary">
                      {survey.poll?.title || 'Title'}
                    </h3>
                    <p className="text-primary/70">{survey.poll?.desc || 'Description'}</p>
                  </div>
                  <div className='w-full flex flex-col gap-2'>
                    {arranged.map((part, i) => {
                      const percent = totalVotes > 0 ? ((part.count || 0) / totalVotes * 100).toFixed(2) : '0.00';
                      return (
                        <div className='flex flex-col gap-1' key={i}>
                          <div className='flex gap-3 justify-between'>
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
                    <div className='flex gap-2'><Users />{totalVotes}</div>
                    <div className='flex flex-col gap-2'>
                      <div>By: {survey?.author}</div>
                      <div>Due: {new Date(survey.poll?.dueDate).toLocaleDateString('en-GB')}</div>
                    </div>
                    {isExpired ? <>
                      <Link to={`/result/${survey._id}`}>
                        <button className="vote-button px-3 py-1 rounded-md cursor-pointer text-lg">
                          Result
                        </button>
                      </Link>
                    </> : <>
                      <Link to={`/poll/${survey._id}`}>
                        <button className="vote-button px-3 py-1 rounded-md cursor-pointer text-lg">
                          Be you
                        </button>
                      </Link>
                    </>
                    }

                  </div>
                </div>
              )
            }
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile
