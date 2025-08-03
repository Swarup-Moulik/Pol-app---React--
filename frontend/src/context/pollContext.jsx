import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export const PollContext = createContext();

const PollContextProvider = (props) => {
    const navigate = useNavigate();
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [surveys, setSurveys] = useState([]);
    const [author, setAuthor] = useState(localStorage.getItem('author') || '');
    const [searchTerm, setSearchTerm] = useState('');
    const getPolls = async () => {
        try {
            const response = await axios.get(backendURL + '/api/poll/list');
            if (response.data.success) {
                setSurveys(response.data.polls);
            } else {
                toast.error(response.data.message);
            } 
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }
    useEffect(() => {
        getPolls();
    }, [surveys]);
    const value = {
        navigate, backendURL, token, setToken, surveys, author, setAuthor, getPolls, searchTerm, setSearchTerm
    }
    return (
        <PollContext.Provider value={value}>
            {props.children}
        </PollContext.Provider>
    )
}

export default PollContextProvider