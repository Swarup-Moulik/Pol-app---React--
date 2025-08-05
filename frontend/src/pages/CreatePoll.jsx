import React, { useContext, useEffect, useState } from 'react';
import { Calendar, Minus, Plus, Tag, UploadCloudIcon, Users } from 'lucide-react';
import axios from 'axios';
import { PollContext } from '../context/pollContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const CreatePoll = () => {
  const [participants, setParticipants] = useState(0);
  const [loading, setLoading] = useState(false);
  const { backendURL, token, author, setRefreshTrigger, navigate } = useContext(PollContext);
  const { t } = useTranslation('createPoll');
  const { toast } = useToast();
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
        toast({
          title: "Poll Created 🎉",
          description: "Your poll has been successfully created.",
        });
        setPoll({
          title: '',
          desc: '',
          participants: [],
          category: '',
          dueDate: ''
        })
        setParticipants(0);
      } else {
        toast({
          title: "Creation Failed",
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
  useEffect(() => {
    if (!token) {
      navigate('/login');
      toast({
        title: "Please log in to view your profile",
        variant: "destructive"
      });    
    }
  }, [token, navigate]);
  return (
    <div className='min-h-screen flex flex-col justify-center pb-20'>
      <h1 className='font-bold text-3xl sm:text-5xl mb-5 mt-12 text-center'>{t("create_title")}</h1> 
      <h1 className='text-lg sm:text-2xl mb-6 text-primary/50 text-center'>{t("subtitle")}</h1>
      <div className='flex flex-col items-center mx-5'>
        <form className='bg-card w-full max-w-3xl mx-3 sm:mx-auto rounded-lg py-4 sm:py-6 shadow ' onSubmit={onSubmitHandler}>
          <div className='flex items-start p-2 px-3 sm:px-5'>
            <h1 className='font-bold text-xl sm:text-3xl '>{t("poll_details")}</h1>
          </div>
          <div className='flex flex-col gap-3 p-2 px-5 items-start mt-6'>
            <div className='flex gap-2 items-center'>
              <Tag size={18} /><label htmlFor="title" className='text-lg font-semibold text-primary/80'>{t("title")}</label>
            </div>
            <input type="text" name="title" id="title" onChange={handlePollChange} value={poll.title} placeholder='Enter the title' className='bg-foreground rounded-lg p-2 w-full' />
          </div>
          <div className='flex flex-col gap-3 p-2 px-5 items-start my-3'> 
            <div className='flex gap-2 items-center'>
              <label htmlFor="desc" className='text-lg font-semibold text-primary/80'>{t("desc")} </label>
            </div>
            <textarea type="text" name="desc" id="desc" onChange={handlePollChange} value={poll.desc} placeholder='Enter a short description' className='bg-foreground rounded-lg p-2 w-full resize-none' />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className='flex flex-col gap-3 p-2 px-5 items-start'>
              <div className='text-lg font-semibold text-primary/80'>{t("category")} </div>
              <select className='bg-background p-2 text-md font-semibold rounded-lg outline-none' name="category" value={poll.category} onChange={handlePollChange}>
                <option value="Sports">{t("sports")}</option>
                <option value="Technology">{t("technology")}</option>
                <option value="Music">{t("music")}</option>
                <option value="Film">{t("film")}</option>
                <option value="Cuisine">{t("cuisine")}</option>
                <option value="Others">{t("others")}</option>
              </select>
            </div>
            <div className='flex flex-col gap-3 p-2 px-5 items-start'>
              <div className='flex gap-2 items-center text-primary/80'> 
                <Calendar size={18} /><label htmlFor="dueDate" className='text-lg font-semibold'>{t("due_date")}</label>
              </div>
              <input type="date" name="dueDate" id="dueDate" min={new Date().toISOString().split('T')[0]} onChange={handlePollChange} value={poll.dueDate} className='bg-foreground h-9 rounded-lg p-2 w-full' />
            </div>
          </div>
          <div className='flex flex-col gap-2 p-2 px-5 items-start'>
            <div className='flex gap-2 items-center text-primary/80'>
              <Users size={18} /><div className='text-lg font-semibold'>{t("participants")}</div>
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
                    <label htmlFor={`name-${index}`} className='text-xl font-semibold'>{t("name")}</label>
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
                    <p className='text-xl font-semibold'>{t("picture")}</p>
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
            {loading ? t("launching") : <>
              <div>{t("launch")}</div>
            </>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePoll
