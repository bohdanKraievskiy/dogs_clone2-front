import React, { useContext, useEffect,useState,useRef } from "react";
import "../Styles/mainStyles.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';
import { RewardsContext } from '../context/RewardsContext';
import CommunitySlide from './componentsTemplates/CommunitySlide';
import TaskItem from './componentsTemplates/TaskItem';
import RewardItem from './componentsTemplates/RewardItem';
import {TasksContext} from "../context/TasksContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/bundle';
import SwiperCore from 'swiper';
import { Pagination } from 'swiper/modules';
SwiperCore.use([Pagination]);
const HomePage = ({telegramId,username_curently}) => {
    const navigate = useNavigate();
    const { user,fetchUser,updateUserBalance} = useContext(UserContext);
    const { rewards,fetchUserRewards } = useContext(RewardsContext);
    const {tasks,fetchTasks} = useContext(TasksContext);

    const userFetchedRef = useRef(false);
    const rewardsFetchedRef = useRef(false);
    const tasksFetchedRef = useRef(false);

    const handleGoToScore = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        navigate("/last_check");
    };
    const [animated, setAnimated] = useState(false);
    useEffect(() => {
        const loadData = async () => {
            // Check if user data is already fetched
            if (!userFetchedRef.current) {
                await fetchUser(telegramId);
                userFetchedRef.current = true;
            }

            // Check if rewards data is already fetched
            if (!rewardsFetchedRef.current) {
                if (!rewards || Object.keys(rewards).length === 0) {
                    navigate("/preload");
                } else {
                    rewardsFetchedRef.current = true;
                }
            }

            // Check if tasks data is already fetched
            if (!tasksFetchedRef.current) {
                if (!tasks || tasks.length === 0) {
                    navigate("/preload");
                } else {
                    tasksFetchedRef.current = true;
                }
            }
        };

        loadData();
    }, []); // Ensure the effect runs only once
    const handleConnectWallet = () => {
        // Здесь ваша логика для открытия меню кошелька
        if (window.Telegram && window.Telegram.WebApp) {
            // Проверка доступности API Telegram WebApp
            const app = window.Telegram.WebApp;
            if (app) {
                // В зависимости от API Telegram, возможно вам нужно будет открыть ссылку или вызвать метод
                app.showPopup('https://example.com/connect-wallet'); // Замените URL на URL вашего кошелька
            } else {
                alert('Telegram WebApp API не доступен.');
            }
        } else {
            alert('Telegram WebApp API не доступен.');
        }
    };
    useEffect(() => {
        if (animated) {
            setAnimated(true)
            const timer = setTimeout(() => setAnimated(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [user.balance]);

    const imageSrc = animated
        ? `${process.env.PUBLIC_URL}/resources_directory/Frame7.webp`
        : `${process.env.PUBLIC_URL}/resources_directory/xw7juHs6u5b7AP1eDKX-removebg-preview.png`;

    return (
        <div class="_page_1ulsb_1" style={{zIndex:100000}}>
            <div className="_gameView_1cr97_1" id="game-view">
                <div className="_backdrop_wo9zh_1"></div>
                <div className="_replay_1vo1r_24" onClick={handleGoToScore}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="56" viewBox="0 0 390 56" fill="none">
                        <path
                            d="M-46.4377 -224.551L-66.3162 -179.798C-66.6099 -179.137 -66.1259 -178.392 -65.4023 -178.392H-31.3581C-30.5329 -178.392 -30.0628 -177.449 -30.5596 -176.79L-72.5672 -121.072C-73.064 -120.414 -72.594 -119.47 -71.7688 -119.47H-30.9876C-30.2399 -119.47 -29.7567 -118.68 -30.0975 -118.015L-90.411 -0.262921C-90.869 0.631202 -89.8703 1.5667 -89.008 1.05137L13.8333 -60.4048C14.6369 -60.885 15.6007 -60.0965 15.2894 -59.2137L-46.4377 115.79M95.9446 -256.67L67.7278 -210.589C67.3435 -209.962 67.746 -209.148 68.4782 -209.072L90.7756 -206.775C91.2855 -206.723 91.6731 -206.293 91.6731 -205.78V-140.416C91.6731 -139.804 92.218 -139.335 92.8231 -139.427L198.093 -155.397C199.145 -155.556 199.685 -154.179 198.805 -153.581L48.4903 -51.3759C47.8339 -50.9295 47.9341 -49.9331 48.6663 -49.6265L172.684 2.30102C173.316 2.56535 173.501 3.37147 173.048 3.8848L95.9446 91.3278M313.789 -299L271.934 -222.297C271.559 -221.609 272.084 -220.777 272.866 -220.819L340.703 -224.512C341.127 -224.535 341.52 -224.287 341.682 -223.894L369.232 -156.959C369.439 -156.457 369.207 -155.882 368.711 -155.663L236.776 -97.437C235.829 -97.0191 236.063 -95.6142 237.094 -95.5258L389.717 -82.4499C390.601 -82.3741 390.956 -81.2693 390.281 -80.693L292.667 2.63851C292.514 2.76934 292.404 2.94342 292.351 3.13794L259.683 123.9C259.46 124.725 260.307 125.432 261.078 125.064L422 48.3599"
                            stroke="#007AFF" stroke-width="79" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>

                    <div className="_replayTitle_1vo1r_48"></div>

                </div>
                <div className="_view_sf2n5_1 _view_1vo1r_1" style={{opacity: 1}}>
                    <div className="_mascote_94k9d_1 _centered_94k9d_13"
                         style={{marginTop: "20%", alignItems: "center"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1906" height="676" viewBox="0 0 1906 676"
                             fill="none" className="_glass_94k9d_29">
                            <path
                                d="M1883.31 89.9479C1883.31 53.1478 1853.48 23.3154 1816.68 23.3154H1201.73C1162.44 23.3154 1127.14 40.388 1102.85 67.4479H824.909C809.553 41.0733 780.975 23.3154 748.209 23.3154H320.821C156.058 23.3154 22.4922 156.881 22.4922 321.644V509.207C22.4922 588.661 86.9024 653.071 166.357 653.071H483.414C678.643 653.071 836.908 494.807 836.908 299.577V200.713H1068.9V354.743C1068.9 519.505 1202.46 653.071 1367.23 653.071H1397.42C1665.77 653.071 1883.31 435.53 1883.31 167.18V89.9479Z"
                                fill="black" stroke="white" stroke-width="45"></path>
                        </svg>
                        <img id="home-mascote"
                             src={imageSrc}
                             className="_doggy_94k9d_6 _width-82_94k9d_23 _mascote_1vo1r_60 _isRendered_1vo1r_63">

                        </img>
                    </div>
                    <div className="_title_1vo1r_5">
                        <div style={{flexDirection: "row "}}
                             className={`_balance_eubs4_1 balance-text  ${animated ? 'balance-animated' : ''}`}>
                            <span style={{fontSize: "6vw", color: "white"}}>{user?.balance} </span>
                            &nbsp;
                            <span
                                className="_symbol_eubs4_9">DOGS</span>
                        </div>
                    </div>
                    <div className="_root_oar9p_1 _type-white_oar9p_43" onClick={handleConnectWallet}>Claim rewards (coming soon)</div>
                    <div className="_socialCarousel_1xku1_1">
                        <div className="swiper swiper-initialized swiper-horizontal swiper-backface-hidden">
                            <div className="swiper-wrapper">
                                <div className="swiper-slide swiper-slide-active" style={{width: "100%"}}>
                                    <div className="_itemWrap_1xku1_16 _itemWrapFirst_1xku1_20">
                                        <div className="social-carousel">
                                            <Swiper
                                                spaceBetween={50}
                                                slidesPerView={1}
                                                pagination={{clickable: true}}
                                            >
                                                <SwiperSlide>
                                                    <CommunitySlide
                                                        title="DOGS COMMUNITY"
                                                        text="Home for Telegram OGs"
                                                        buttonText="Join"
                                                        url="https://t.me/WeArePrimeNews"
                                                    />
                                                </SwiperSlide>
                                            </Swiper>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="_taskList_dti3z_1">
                        <div className="_title_dti3z_5">Tasks</div>
                        <div>
                            {tasks.map((task, index) => (
                                !task.completed && (
                                    <TaskItem
                                        key={index}
                                        index={index}
                                        title={task.title}
                                        footerText={task.reward}
                                        url={task.url}
                                        setAnimated={animated}
                                        username_curently={username_curently}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                    <div className="_rewardList_1a8v0_1">
                        <div className="_title_1a8v0_5">Your rewards</div>
                        {rewards.age != null && rewards.age !== 0 &&
                            <RewardItem text="Account age" details={rewards.age.toString()}/>}
                        {rewards.boost !== 0 && <RewardItem text="Boosts reward" details={rewards.boost}/>}
                        {rewards.game !== 0 && <RewardItem text="Game reward" details={rewards.game}/>}
                        {rewards.daily !== 0 && <RewardItem text="Daily reward" details={rewards.daily}/>}
                        {rewards.frens !== 0 && <RewardItem text="Friends reward" details={rewards.frens}/>}
                        {rewards.premium !== 0 && <RewardItem text="Telegram Premium" details={rewards.premium}/>}
                        {rewards.tasks !== 0 && <RewardItem text="Tasks reward" details={rewards.tasks}/>}
                        {rewards.total !== 0 && <RewardItem text="Total reward" details={rewards.total}/>}
                        {tasks.map((task, index) => (
                            task.completed && <RewardItem key={index} text={task.title} details={task.reward}/>
                        ))}
                    </div>
                    <a className="_policyLink_1vo1r_85"
                    >Privacy
                        policy</a></div>
            </div>
        </div>
    )
        ;
};

export default HomePage;