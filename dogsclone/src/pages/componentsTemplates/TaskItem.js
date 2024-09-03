import React, { useState, useContext, useEffect } from 'react';
import { TasksContext } from '../../context/TasksContext';
import '../../Styles/mainStyles.css'; // Підключення стилів для кнопки
import axios from 'axios';
import { UserContext } from "../../context/UserContext";
import { RewardsContext } from "../../context/RewardsContext";
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../../App';
import { API_BASE_URL } from '../../helpers/api';

const TaskItem = ({ title, footerText, url, index, setAnimated,username_curently }) => {
    const [isChecked, setIsChecked] = useState(false);
    const [timerExpired, setTimerExpired] = useState(false);
    const { setShowModal, setModalMessage } = useContext(ModalContext);
    const { completeTask } = useContext(TasksContext);
    const { user, setUser, updateUserBalance } = useContext(UserContext);
    const { rewards, setRewards } = useContext(RewardsContext);
    const history = useNavigate();
    const taskDuration = 86400000; // 24 hours in milliseconds

    // Unique keys for localStorage
    const storageKey = `task-${index}-checked`;
    const startTimeKey = `task-${index}-startTime`;

    // Retrieve isChecked state and startTime from localStorage on component mount
    useEffect(() => {
        const storedCheckedState = localStorage.getItem(storageKey);
        const storedStartTime = localStorage.getItem(startTimeKey);

        if (storedCheckedState !== null) {
            setIsChecked(JSON.parse(storedCheckedState));
        }

        if (storedStartTime) {
            const elapsedTime = Date.now() - parseInt(storedStartTime, 10);
            if (elapsedTime >= taskDuration) {
                // If the time limit is exceeded, reset the task
                setIsChecked(false);
                setTimerExpired(true);
                localStorage.removeItem(storageKey);
                localStorage.removeItem(startTimeKey);
            } else {
                // If not yet expired, start the timer
                const remainingTime = taskDuration - elapsedTime;
                setTimeout(() => {
                    setIsChecked(false);
                    setTimerExpired(true);
                    localStorage.removeItem(storageKey);
                    localStorage.removeItem(startTimeKey);
                }, remainingTime);
            }
        }
    }, [storageKey, startTimeKey]);

    const handleShowModal = () => {
        setModalMessage("Time expired. Start the task again.");
        setShowModal(true);
    };

    const verifyTask = async (telegramId, taskTitle, reward) => {
        try {
            const rewardValue = parseInt(reward.replace('+', ''), 10);
            const response = await axios.post(`${API_BASE_URL}/tasks/verify/`, {
                telegram_id: telegramId,
                task: taskTitle,
                reward: rewardValue,
                username:username_curently
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.status === "success") {
                window.scrollTo({top: 0, behavior: 'smooth'});
                const updatedBalance = user.balance + rewardValue;
                updateUserBalance(updatedBalance);
                setRewards(prevRewards => ({
                    ...prevRewards,
                    tasks: prevRewards.tasks + rewardValue,
                    total: prevRewards.total + rewardValue
                }));
                completeTask(index);
                setAnimated(true);
            } else {
                // Handle task expired or not started yet
                console.error("Task failed:", response.data.message);
                setIsChecked(false);
                localStorage.removeItem(storageKey);  // Remove key from localStorage
                localStorage.removeItem(startTimeKey);
                handleShowModal();
            }
        } catch (error) {
            console.error("Error verifying task:", error);
            handleShowModal();
        }
    };


    const handleButtonClick = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');


            if (!isChecked) {
                if(url) {
                    window.open(url, '_blank');
                }
                setIsChecked(true);
                localStorage.setItem(storageKey, true);
                localStorage.setItem(startTimeKey, Date.now().toString());
            } else {
                verifyTask(user.telegram_id, title, footerText);
            }

    };
    const renderSVG = (title) => {

        if (title.includes("channel")) {
            return (
                <svg width="20" height="16" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M13.4463 0.088937C13.6307 0.010188 13.8325 -0.0169719 14.0308 0.0102836C14.2291 0.0375392 14.4166 0.118214 14.5737 0.243911C14.7308 0.369609 14.8519 0.535733 14.9242 0.724994C14.9966 0.914254 15.0176 1.11973 14.9852 1.32004L13.2925 11.736C13.1283 12.7407 12.0417 13.3169 11.1334 12.8164C10.3737 12.3977 9.24525 11.7526 8.23027 11.0795C7.72277 10.7426 6.1682 9.66368 6.35926 8.89594C6.52345 8.2395 9.13555 5.77275 10.6282 4.30618C11.214 3.73 10.9469 3.39762 10.255 3.92761C8.537 5.24352 5.77863 7.24463 4.86663 7.80794C4.0621 8.30462 3.64267 8.38942 3.14115 8.30462C2.22617 8.15016 1.37761 7.91091 0.685033 7.61941C-0.250845 7.2257 -0.20532 5.9204 0.684286 5.54031L13.4463 0.088937Z"
                          fill="#F6F6F6"/>
                </svg>

            );
        } else if (title.includes("friends")) {
            return (
                <svg width="20" height="16" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M13.4463 0.088937C13.6307 0.010188 13.8325 -0.0169719 14.0308 0.0102836C14.2291 0.0375392 14.4166 0.118214 14.5737 0.243911C14.7308 0.369609 14.8519 0.535733 14.9242 0.724994C14.9966 0.914254 15.0176 1.11973 14.9852 1.32004L13.2925 11.736C13.1283 12.7407 12.0417 13.3169 11.1334 12.8164C10.3737 12.3977 9.24525 11.7526 8.23027 11.0795C7.72277 10.7426 6.1682 9.66368 6.35926 8.89594C6.52345 8.2395 9.13555 5.77275 10.6282 4.30618C11.214 3.73 10.9469 3.39762 10.255 3.92761C8.537 5.24352 5.77863 7.24463 4.86663 7.80794C4.0621 8.30462 3.64267 8.38942 3.14115 8.30462C2.22617 8.15016 1.37761 7.91091 0.685033 7.61941C-0.250845 7.2257 -0.20532 5.9204 0.684286 5.54031L13.4463 0.088937Z"
                          fill="#F6F6F6"/>
                </svg>
            );
        } else if (title.includes("🐵")) {
            return (
                <svg width="20" height="16" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M13.4463 0.088937C13.6307 0.010188 13.8325 -0.0169719 14.0308 0.0102836C14.2291 0.0375392 14.4166 0.118214 14.5737 0.243911C14.7308 0.369609 14.8519 0.535733 14.9242 0.724994C14.9966 0.914254 15.0176 1.11973 14.9852 1.32004L13.2925 11.736C13.1283 12.7407 12.0417 13.3169 11.1334 12.8164C10.3737 12.3977 9.24525 11.7526 8.23027 11.0795C7.72277 10.7426 6.1682 9.66368 6.35926 8.89594C6.52345 8.2395 9.13555 5.77275 10.6282 4.30618C11.214 3.73 10.9469 3.39762 10.255 3.92761C8.537 5.24352 5.77863 7.24463 4.86663 7.80794C4.0621 8.30462 3.64267 8.38942 3.14115 8.30462C2.22617 8.15016 1.37761 7.91091 0.685033 7.61941C-0.250845 7.2257 -0.20532 5.9204 0.684286 5.54031L13.4463 0.088937Z"
                          fill="#F6F6F6"/>
                </svg>
            );
        } else if (title.includes("X")) {
            return (
                <svg width="20" height="16" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M13.4463 0.088937C13.6307 0.010188 13.8325 -0.0169719 14.0308 0.0102836C14.2291 0.0375392 14.4166 0.118214 14.5737 0.243911C14.7308 0.369609 14.8519 0.535733 14.9242 0.724994C14.9966 0.914254 15.0176 1.11973 14.9852 1.32004L13.2925 11.736C13.1283 12.7407 12.0417 13.3169 11.1334 12.8164C10.3737 12.3977 9.24525 11.7526 8.23027 11.0795C7.72277 10.7426 6.1682 9.66368 6.35926 8.89594C6.52345 8.2395 9.13555 5.77275 10.6282 4.30618C11.214 3.73 10.9469 3.39762 10.255 3.92761C8.537 5.24352 5.77863 7.24463 4.86663 7.80794C4.0621 8.30462 3.64267 8.38942 3.14115 8.30462C2.22617 8.15016 1.37761 7.91091 0.685033 7.61941C-0.250845 7.2257 -0.20532 5.9204 0.684286 5.54031L13.4463 0.088937Z"
                          fill="#F6F6F6"/>
                </svg>
            );
        } else {
            return (
                <svg width="20" height="16" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M13.4463 0.088937C13.6307 0.010188 13.8325 -0.0169719 14.0308 0.0102836C14.2291 0.0375392 14.4166 0.118214 14.5737 0.243911C14.7308 0.369609 14.8519 0.535733 14.9242 0.724994C14.9966 0.914254 15.0176 1.11973 14.9852 1.32004L13.2925 11.736C13.1283 12.7407 12.0417 13.3169 11.1334 12.8164C10.3737 12.3977 9.24525 11.7526 8.23027 11.0795C7.72277 10.7426 6.1682 9.66368 6.35926 8.89594C6.52345 8.2395 9.13555 5.77275 10.6282 4.30618C11.214 3.73 10.9469 3.39762 10.255 3.92761C8.537 5.24352 5.77863 7.24463 4.86663 7.80794C4.0621 8.30462 3.64267 8.38942 3.14115 8.30462C2.22617 8.15016 1.37761 7.91091 0.685033 7.61941C-0.250845 7.2257 -0.20532 5.9204 0.684286 5.54031L13.4463 0.088937Z"
                          fill="#F6F6F6"/>
                </svg>
            );
        }
    };

    const renderRequiredFriends = (title) => {
        const match = title.match(/(\d+)/); // Match any number in the title
        if (match) {
            const number = match[0];
            return <span style={{color: 'yellow'}}>{number}</span>;
        }
        return null;
    };
    const renderTitleWithHighlightedNumbers = (title) => {
        return title.replace(/(\d+|\+)/g, (match) => `<span style="color: #1e89d6 ">${match}</span>`);
    };

    return (

        <div className="_listItem_1wi4k_1">
            <div className="_media_1wi4k_8">
                {renderSVG(title)}
            </div>
            <div className="_body_1wi4k_22">
                <div
                    className="_title_1wi4k_29"
                >{title}</div>
                <div className="_footer_1wi4k_38"
                     dangerouslySetInnerHTML={{__html: renderTitleWithHighlightedNumbers(footerText)}}></div>
            </div>
            <div className="_after_1wi4k_45">
                <div
                    className={isChecked ? "_type-white_ip8lu_54 _root_oar9p_1 _size-s_oar9p_31" : "_type-dark_oar9p_58 _root_oar9p_1 _size-s_oar9p_31"}
                    onClick={handleButtonClick}>  {isChecked ? "Check" : "Start"}</div>
            </div>
        </div>
    );
};

export default TaskItem;