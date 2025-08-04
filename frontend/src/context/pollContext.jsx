import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

export const PollContext = createContext();

const PollContextProvider = (props) => {
    const navigate = useNavigate();
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [author, setAuthor] = useState(localStorage.getItem('author') || '');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const getPolls = async () => {
        setLoading(true);
        try {
            const response = await axios.get(backendURL + '/api/poll/list');
            if (response.data.success) {
                setSurveys(response.data.polls);
            } else {
                toast({
                    title: "Polls can't be loaded",
                    description: error.message,
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
        getPolls();
    }, [refreshTrigger]);
    const value = {
        navigate, backendURL, token, setToken, surveys, author, setAuthor, getPolls, searchTerm, setSearchTerm, loading, refreshTrigger, setRefreshTrigger
    }
    return (
        <PollContext.Provider value={value}>
            {props.children}
        </PollContext.Provider>
    )
}

export default PollContextProvider