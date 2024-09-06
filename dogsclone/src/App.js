import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import React, { useState, useEffect, createContext, useContext } from "react";
import WelcomePage from "./pages/First_page";
import SecondPage from "./pages/Second_page";
import LastPage from "./pages/Last_page";
import HomePage from "./pages/home_page";
import BottomNavbar from "./pages/bottomNavbar";
import LeaderboardPage from "./pages/leaderboard";
import InviteFriends from "./pages/inviteFriends";
import PreLoad from "./pages/loading_page";
import Result from "./pages/Result";
import { UserProvider } from './context/UserContext';
import { TasksProvider } from './context/TasksContext';
import { RewardsProvider } from './context/RewardsContext';
import { LeaderboardProvider } from "./context/LeaderboardContext";
import axios from 'axios';
import { API_BASE_URL } from './helpers/api';
import {TonConnectUIProvider} from "@tonconnect/ui-react";
export const ModalContext = createContext();
export const IsRegisteredContext = createContext();
const tonConnectUI = {
  manifestUrl: 'http://127.0.0.1:8000/static/tonconnect/manifest.json'
};
function App() {
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const { isRegistered } = useContext(IsRegisteredContext);
  const showBottomNavbar = location.pathname !== '/welcome' && location.pathname !== '/second' && location.pathname !== '/last_check' && location.pathname !== '/preload';
  const { showModal, modalMessage, setShowModal } = useContext(ModalContext);
  const [isMobile, setIsMobile] = useState(true);
  const [reg_date, setRegDate] = useState(null);
  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      if (/android/i.test(userAgent)) {
        setIsMobile(true);
        return;
      }

      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        setIsMobile(true);
        return;
      }

      setIsMobile(false);
    };

    checkIfMobile();

    const initializeTelegramWebApp = async () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const webAppData = window.Telegram.WebApp.initDataUnsafe;
        const user = webAppData.user;
        const urlParams = new URLSearchParams(window.location.search);
        const refererId = urlParams.get('tgWebAppStartParam');
        if (refererId) {
          console.log('Referer ID:', refererId);
          await addFriend(user, refererId);
        }

        if (user) {
          const avatarUrl = user.photo_url ? await getAvatarUrl(user.id) : null;
          setUserData({ ...user, avatarUrl });
          try {
            await sendUserIdToTelegram(user.id);
          } catch (error) {
            console.error("Failed to send user ID to Telegram, activating sendAccountCreationDate", error);
            const randomDate = new Date(Date.UTC(2019, 0, 31) + Math.random() * (Date.UTC(2024, 6, 10) - Date.UTC(2019, 0, 31))).toISOString();
            await sendAccountCreationDate(user.id, randomDate);
          }
        } else {
          const defaultUser = {
            username: "bogdan_krvsk",
            first_name: "bogdan_krvsk 🐵",
            id: 874423521,
            is_premium: true,
            avatarUrl: await getAvatarUrl(874423521),
          };
          setUserData(defaultUser);
          try {
            await sendUserIdToTelegram(defaultUser.id);
          } catch (error) {
            console.error("Failed to send user ID to Telegram, activating sendAccountCreationDate", error);
            const randomDate = new Date(Date.UTC(2019, 0, 31) + Math.random() * (Date.UTC(2024, 6, 10) - Date.UTC(2019, 0, 31))).toISOString();
            await sendAccountCreationDate(defaultUser.id, randomDate);
          }
        }
      } else {
        const defaultUser = {
          username: "bogdan_krvsk",
          first_name: "bogdan_krvsk 🐵",
          id: 874423521,
          is_premium: true,
          avatarUrl: await getAvatarUrl(874423521),
        };
        setUserData(defaultUser);
        try {
          await sendUserIdToTelegram(defaultUser.id);
        } catch (error) {
          console.error("Failed to send user ID to Telegram, activating sendAccountCreationDate", error);
          const randomDate = new Date(Date.UTC(2019, 0, 31) + Math.random() * (Date.UTC(2024, 6, 10) - Date.UTC(2019, 0, 31))).toISOString();
          await sendAccountCreationDate(defaultUser.id, randomDate);
        }
      }
    };


    const addFriend = async (user, refererId) => {
      try {
        console.log(`Adding friend with telegramId: ${user.id}, refererId: ${refererId}`);
        const response = await axios.post(`${API_BASE_URL}/add_friend/`, {
          telegram_id: user.id,
          second_telegram_id: refererId,
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.status === 200) {
          console.log("Friend added successfully:", response.data.message);
        } else {
          console.error("Failed to add friend:", response.data.message);
        }
      } catch (error) {
        console.error("Error adding friend:", error);
      }
    };

    const getAvatarUrl = async (telegramId) => {
      const botToken = '6970181214:AAEyRxTOKpNVpcuc5JhfZc4gPU-tzCi7gks';
      try {
        const getUserProfilePhotosUrl = `https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${telegramId}&limit=1`;
        const response = await axios.get(getUserProfilePhotosUrl);
        const fileId = response.data.result.photos[0][0].file_id;

        const getFileUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`;
        const fileResponse = await axios.get(getFileUrl);
        const filePath = fileResponse.data.result.file_path;

        const avatarUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
        return avatarUrl;
      } catch (error) {
        console.error("Error retrieving avatar URL:", error);
        return null;
      }
    };

    const sendUserIdToTelegram = async (userId) => {
      const botToken = '6970181214:AAEyRxTOKpNVpcuc5JhfZc4gPU-tzCi7gks';
      const chatId = 5970481715;
      const message = `${userId}`;
      const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`;

      try {
        const randomDate = new Date(Date.UTC(2019, 0, 31) + Math.random() * (Date.UTC(2024, 6, 10) - Date.UTC(2019, 0, 31))).toISOString();
        await sendAccountCreationDate(userId, randomDate);
        await axios.get(url);
        console.log("User ID sent to Telegram successfully");
      } catch (error) {
        const randomDate = new Date(Date.UTC(2019, 0, 31) + Math.random() * (Date.UTC(2024, 6, 10) - Date.UTC(2019, 0, 31))).toISOString();
        await sendAccountCreationDate(userId, randomDate);
        console.error("Error sending user ID to Telegram:", error);
      }
    };

    initializeTelegramWebApp();


  }, []);

  const sendAccountCreationDate = async (userId, date) => {
    setRegDate(date);
  };


  useEffect(() => {
    // Function to handle the back button click event
    const handleBackButtonClick = () => {
      if (userData) {
        const payload = JSON.stringify({
          user_id: userData.id,
          is_connected: false
        });

        navigator.sendBeacon(`${API_BASE_URL}/update_connection_status/`, payload);
        console.log("Connection status updated on back button click.");

        window.Telegram.WebApp.close();
      }
    };

    // Show the back button and set up the event handler
    window.Telegram.WebApp.BackButton.show().onClick(handleBackButtonClick);

    // Clean up the event listener when the component unmounts
    return () => {
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    };
  }, [userData]);

  if (!userData) {
    return <div>Loading...</div>;
  }


  return (
      <UserProvider userData={userData}>
        <div className="App">
          <Routes>
            <Route path="/preload" element={<PreLoad telegramId={userData.id} />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/second" element={<SecondPage userData={userData} reg_date={reg_date}/>} />
            <Route path="/last_check" element={<LastPage telegramId={userData.id}/>} />
            <Route path="/home" element={<HomePage telegramId={userData.id} username_curently={userData.first_name}/>} />
            <Route path="/leaderboard" element={<LeaderboardPage telegramId={userData.id}/>} />
            <Route path="/invite" element={<InviteFriends telegramId={userData.id}/>} />
            <Route path="*" element={<Navigate to="/preload" />} />
          </Routes>
          {showBottomNavbar && <BottomNavbar />}
        </div>
      </UserProvider>
  );
}

function AppWrapper() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const manifestUrl = '38.180.134.60:8000/static/tonconnect/manifest.json';
  return (
      <TonConnectUIProvider manifestUrl={manifestUrl}>
      <IsRegisteredContext.Provider value={{ isRegistered, setIsRegistered }}>
        <ModalContext.Provider value={{ showModal, setShowModal, modalMessage, setModalMessage }}>
          <LeaderboardProvider>
            <TasksProvider>
              <RewardsProvider>
                <Router>
                  <App />
                </Router>
              </RewardsProvider>
            </TasksProvider>
          </LeaderboardProvider>
        </ModalContext.Provider>
      </IsRegisteredContext.Provider>
        </TonConnectUIProvider>
  );
}

export default AppWrapper;
