import { useState, useEffect } from "react";
import './London.css';

export const LondonTime = ({color}) => {
const [londonDateTime, setLondonDateTime] = useState({ date: '', time: '' });
    useEffect (() => {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-GB', {
                timeZone: 'Europe/London',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            const dateString = now.toLocaleDateString('en-GB', {
                timeZone: 'Europe/London',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            setLondonDateTime({ date: dateString, time: timeString });
        };
        updateTime();
        const interval = setInterval(updateTime,1000);
        return () => clearInterval(interval);//очишает при размонтировании setInterval
    },[])
    return(
        <div>
            <img className="I" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Supreme_Logo.svg/1024px-Supreme_Logo.svg.png" alt="" />
            <div style={{color}}>{londonDateTime.date}-{londonDateTime.time}</div>
        </div>
    )
}