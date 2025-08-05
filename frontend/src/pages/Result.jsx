import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { PollContext } from '../context/pollContext';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Zap } from 'lucide-react';
import placeholder from './placeholder.png';
import { useTranslation } from 'react-i18next';

const Result = () => {
    const { pollID } = useParams();
    const { surveys } = useContext(PollContext);
    const { t } = useTranslation("poll");
    const [pollData, setPollData] = useState({});
    const fetchPollData = async (params) => {
        const matchedPoll = surveys.find(survey => survey._id === pollID);
        if (matchedPoll) setPollData(matchedPoll);
    }
    const last = surveys.slice(-3).reverse();
    const famous = surveys.map((poll) => ({
        ...poll,
        totalVotes: poll.poll.participants?.reduce((sum, p) => sum + (p.count || 0), 0),
    })).slice(0, 3)
    const latest = last.filter(
        (survey) => new Date(survey.poll?.dueDate) <= new Date()
    );
    const popular = famous.filter(
        (survey) => new Date(survey.poll?.dueDate) <= new Date()
    );
    const list = pollData.poll?.participants
        ? [...pollData.poll.participants].sort((a, b) => (b.count || 0) - (a.count || 0))
        : [];
    const totalVotes = pollData?.poll?.participants?.reduce((sum, part) => sum + (part.count || 0), 0) || 0;
    useEffect(() => {
        fetchPollData();
    }, [pollID, surveys])
    return pollData.poll ? (
        <div className='grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-2 mb-5'>
            <div className='md:py-5 py-2 my-10 sm:ml-25 sm:px-15 px-6 m-5 rounded-xl bg-card border-2 border-border w-fit sm:w-6/7'>
                <div className='flex justify-between'>
                    <p className="font-bold my-3 px-3 py-1 bg-foreground rounded-2xl">{pollData?.poll?.category || t("category")}</p>
                    <div className="text-md font-semibold my-2 flex gap-2 items-center text-primary/60">
                        <Users size={20} />{pollData.poll.participants.reduce(
                            (sum, part) => sum + (part.count || 0), 0
                        ).toLocaleString()} {t("votes")}
                    </div>
                </div>
                <div className='flex flex-col items-start mt-3 mb-15'>
                    <h1 className='text-4xl font-bold'>{pollData?.poll?.title}</h1>
                    <p className='text-lg mt-3 text-primary/70'>{pollData?.poll?.desc}</p>
                </div>
                <h2 className='text-2xl font-bold my-4'>Results Declared :-</h2>
                <div className='mt-5 rounded-md'>
                    {list.map((p, index) => {
                        const percent = totalVotes > 0 ? ((p?.count || 0) / totalVotes * 100).toFixed(2) : '0.00';
                        return (
                            <div className="flex items-center gap-4 py-3 px-5 rounded-lg border bg-foreground/30 border-border my-10 w-xs sm:w-full" key={index}>
                                <div>
                                    <img
                                        src={p.image || placeholder}
                                        alt={p.name}
                                        className="w-15 h-13 rounded-full object-cover border"
                                    />
                                </div>
                                <div className='flex flex-col gap-2 w-full'>
                                    <div htmlFor={`option-${index}`} className="text-md flex justify-between w-full">
                                        <div className='font-semibold'>{p.name}</div>
                                        <div className='text-primary/80'>
                                            {totalVotes > 0 ? `${percent}%` : t("no_votes_yet")}
                                        </div>
                                    </div>
                                    <div className='bg-foreground w-full rounded-full h-2 overflow-hidden'>
                                        <div
                                            className='bg-primary-foreground h-2 rounded-full origin-left animate-[grow_1.5s_ease-out_0.2s_forwards]'
                                            style={{ '--tw-grow-width': `${percent}%`, width: "0%" }}
                                        />
                                    </div>
                                </div>

                            </div>)
                    })}
                </div>
                <div className='flex justify-center'>
                    <Link to={'/pastpoll'} className='vote-button mt-5 w-fit cursor-pointer'>{t("past_polls")}</Link>
                </div>
            </div>
            <div className='flex items-center flex-col'>
                <div className='border-1 border-border flex flex-col w-sm gap-2 rounded-xl mt-10 sm:mr-15 mx-10 bg-card pb-2'>
                    <div className='flex mx-7 mt-5 items-center gap-2'>
                        <div><TrendingUp size={30} color='#50C878' /></div>
                        <h2 className='text-2xl font-bold'>{t("trending_poll")}</h2>
                    </div>
                    <div>
                        {popular.map((poll, index) => (
                            <div key={index} className='bg-foreground/50 border border-border mx-5 my-3 rounded-md px-3 py-2 hover:bg-foreground cursor-pointer'>
                                <Link to={`/result/${poll._id}`}>
                                    <div className='flex items-start'>
                                        <div className='font-semibold text-md'>#{index + 1} {poll?.poll.title}</div>
                                    </div>
                                    <div className='flex justify-between items-center mt-2'>
                                        <div className='bg-card rounded-2xl px-2 py-1 font-medium text-xs'>{poll?.poll.category}</div>
                                        <div className='text-primary/60 text-xs'>
                                            {poll?.poll.participants.reduce((sum, part) => sum + (part.count || 0), 0).toLocaleString()} {t("votes")}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='border-1 border-border flex flex-col w-sm gap-2 rounded-xl mt-10 sm:mr-15 mx-10 bg-card pb-2'>
                    <div className='flex mx-7 my-5 items-center gap-2'>
                        <div><Zap size={30} color='turquoise' /></div>
                        <h2 className='text-2xl font-bold'>{t("latest_poll")}</h2>
                    </div>
                    <div>
                        {latest.map((poll, index) => (
                            <div key={index} className='bg-foreground/50 border border-border mx-5 my-3 rounded-md px-3 py-2 hover:bg-foreground cursor-pointer'>
                                <Link to={`/result/${poll._id}`}>
                                    <div className='flex items-start'>
                                        <div className='font-semibold text-md'>{poll?.poll.title}</div>
                                    </div>
                                    <div className='flex justify-between items-center mt-3'>
                                        <div className='bg-card rounded-2xl px-2 py-1 font-medium text-xs'>{poll?.poll.category}</div>
                                        <div className='text-primary/60 text-xs'>
                                            {poll?.poll.participants.reduce((sum, part) => sum + (part.count || 0), 0).toLocaleString()} {t("votes")}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div>Loading...</div>
    );
}

export default Result
