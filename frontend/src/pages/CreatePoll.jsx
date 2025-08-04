import React, { useContext, useEffect, useState } from 'react';
import { Calendar, Minus, Plus, Tag, UploadCloudIcon, Users } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PollContext } from '../context/pollContext';

const CreatePoll = () => {
  const [participants, setParticipants] = useState(0);
  const [loading, setLoading] = useState(false);
  const { backendURL, token, author, setRefreshTrigger } = useContext(PollContext);
  const [poll, setPoll] = useState({
    title: '',
    desc: '',
    participants: [],
    category: 'Sports',
    dueDate: ''
  })
  const handlePollChange = (e) => {
    const { name, value } = e.target;
    setPoll(prev => ({ ...prev, [name]: value }));
  }
  const handleParticipantChange = (index, field, value) => {
    const updatedPoll = [...poll.participants];
    updatedPoll[index] = { ...updatedPoll[index], [field]: value };
    setPoll(prev => ({ ...prev, participants: updatedPoll }))
  }
  const handleParticipantImageChange = (index, file) => {
    const updatedPoll = [...poll.participants];
    updatedPoll[index] = { ...updatedPoll[index], image: file };
    setPoll(prev => ({ ...prev, participants: updatedPoll }))
  }
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append('author', author)
      for (const key in poll) {
        if (poll.hasOwnProperty(key)) {
          if (key == 'participants') {
            formData.append(key, JSON.stringify(poll[key]));
          } else {
            formData.append(key, poll[key]);
          }
        }
      }
      poll.participants.forEach((participant) => {
        if (participant.image instanceof File) {
          formData.append('pollImages', participant.image);
        }
      })
      setLoading(true);
      const response = await axios.post(backendURL + '/api/poll/add', formData, { headers: { token } });
      setRefreshTrigger(prev => prev + 1); // ✅ this triggers Home to refetch   
      if (response.data.success) {
        toast.success(response.data.success);
        setPoll({
          title: '',
          desc: '',
          participants: [],
          category: '',
          dueDate: ''
        })
        setParticipants(0);
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
  useEffect(() => {
    setPoll(prev => ({
      ...prev,
      participants: Array.from({ length: participants }, (_, i) => prev.participants[i] || { name: '', image: null })
    }))
  }, [participants])
  return (
    <div className='min-h-screen flex flex-col justify-center pb-20'>
      <h1 className='font-bold text-3xl sm:text-5xl mb-5 mt-12 text-center'>Create Your Poll</h1>
      <h1 className='text-lg sm:text-2xl mb-6 text-primary/50 text-center'>Gather opinions and make decisions together</h1>
      <div className='flex flex-col items-center mx-5'>
        <form className='bg-card w-full max-w-3xl mx-3 sm:mx-auto rounded-lg py-4 sm:py-6 shadow ' onSubmit={onSubmitHandler}>
          <div className='flex items-start p-2 px-3 sm:px-5'>
            <h1 className='font-bold text-xl sm:text-3xl '>Poll Details</h1>
          </div>
          <div className='flex flex-col gap-3 p-2 px-5 items-start mt-6'>
            <div className='flex gap-2 items-center'>
              <Tag size={18} /><label htmlFor="title" className='text-lg font-semibold text-primary/80'>Title </label>
            </div>
            <input type="text" name="title" id="title" onChange={handlePollChange} value={poll.title} placeholder='Enter the title' className='bg-foreground rounded-lg p-2 w-full' />
          </div>
          <div className='flex flex-col gap-3 p-2 px-5 items-start my-3'>
            <div className='flex gap-2 items-center'>
              <label htmlFor="desc" className='text-lg font-semibold text-primary/80'>Anecdote </label>
            </div>
            <textarea type="text" name="desc" id="desc" onChange={handlePollChange} value={poll.desc} placeholder='Enter a short description' className='bg-foreground rounded-lg p-2 w-full resize-none' />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className='flex flex-col gap-3 p-2 px-5 items-start'>
              <div className='text-lg font-semibold text-primary/80'>Categories </div>
              <select className='bg-background p-2 text-md font-semibold rounded-lg outline-none' name="category" value={poll.category} onChange={handlePollChange}>
                <option value="Sports">Sports</option>
                <option value="Technology">Technology</option>
                <option value="Music">Music</option>
                <option value="Film">Film</option>
                <option value="Cuisine">Cuisine</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className='flex flex-col gap-3 p-2 px-5 items-start'>
              <div className='flex gap-2 items-center text-primary/80'>
                <Calendar size={18} /><label htmlFor="dueDate" className='text-lg font-semibold'>Due Date </label>
              </div>
              <input type="date" name="dueDate" id="dueDate" min={new Date().toISOString().split('T')[0]} onChange={handlePollChange} value={poll.dueDate} className='bg-foreground h-9 rounded-lg p-2 w-full' />
            </div>
          </div>
          <div className='flex flex-col gap-2 p-2 px-5 items-start'>
            <div className='flex gap-2 items-center text-primary/80'>
              <Users size={18} /><div className='text-lg font-semibold'>Number of Participants :-</div>
            </div>
            <div className='flex gap-2 items-center text-primary/80'>
              <div className='bg-foreground rounded-lg px-2 py-1'>
                <Minus onClick={(e) => setParticipants(participants > 0 ? participants - 1 : 0)} />
              </div>
              <input type="text" className='bg-foreground rounded-lg px-4 py-1 w-16' placeholder='5' onChange={(e) => setParticipants(e.target.value) || 0} value={participants || 0} />
              <div className='bg-foreground rounded-lg px-2 py-1'>
                <Plus onClick={(e) => setParticipants(prev => prev + 1)} />
              </div>
            </div>
          </div>
          <div>
            {
              poll.participants.map((participant, index) => (
                <div key={index} className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border px-4 py-2 my-2'>
                  <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full'>
                    <label htmlFor={`name-${index}`} className='text-xl font-semibold'>Name </label>
                    <input
                      type="text"
                      name={`name-${index}`}
                      id={`name-${index}`}
                      value={participant?.name || ''}
                      onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                      placeholder='Pop'
                      className='bg-foreground rounded-lg px-2 py-1'
                    />
                  </div>
                  <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                    <p className='text-xl font-semibold'>Picture </p>
                    <label htmlFor={`image-${index}`} className='rounded-md card-hover overflow-hidden'>
                      {
                        participant.image ? (
                          <img src={URL.createObjectURL(participant.image)} className='w-12 h-12 my-2 object-cover transition-transform duration-500 hover:scale-110 rounded-md' alt="picture" />
                        ) : (
                          <UploadCloudIcon className="w-10 h-9 mx-6" />
                        )
                      }
                      <input type="file" onChange={(e) => handleParticipantImageChange(index, e.target.files[0])} id={`image-${index}`} hidden />
                    </label>
                  </div>
                </div>
              ))
            }
          </div>
          <button className='vote-button mx-auto mt-6 w-[80%] sm:w-[60%] text-lg font-bold cursor-pointer'>
            {loading ? 'Launching Poll...' : <>
              <div>Launch</div>
            </>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePoll
