import React, { useState, useContext, useEffect } from "react";
import "../Styles/mainStyles.css";
import { useNavigate } from "react-router-dom";
import { LeaderboardContext } from "../context/LeaderboardContext";

const InvitePage = ({ telegramId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [copyMessage, setCopyMessage] = useState(false);
    const { friends_stats,fetchLeaderboard } = useContext(LeaderboardContext);
    const [activeTab, setActiveTab] = useState('Frens');
    const friendsArray = Array.isArray(friends_stats) ? friends_stats : [];
    useEffect(() => {
        const loadData = async () => {
            fetchLeaderboard(telegramId)
        };

        loadData();
    }, []);
    // Determine if the device is an iPhone
    const isIPhone = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);

    const handleGoToScore = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        setIsLoading(true);
        // You may want to navigate or perform another action here.
    };

    const handleClose = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        setIsLoading(false);
    };

    const handleCopyInviteLink = () => {
        const inviteLink = `https://t.me/WeArePrime_Bot/app?startapp=${telegramId}`;
        navigator.clipboard.writeText(inviteLink).then(() => {
            if (isIPhone()) {
                alert('Link was copied to the clipboard!!');
            } else {
                setCopyMessage(true);
                setTimeout(() => setCopyMessage(false), 5000);
            }
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const handleShareInviteLink = () => {
        const shareLink = `https://t.me/share/url?url=https://t.me/WeArePrime_Bot/app?startapp=${telegramId}\n`;
        window.open(shareLink, '_blank');
    };

    const renderFriendsList = () => {
        return friends_stats?.map((friend, index) => (

            <div key={index} className="_item_iud9y_1">
                <div className="_media_iud9y_8">
                    <img
                        className="_avatar_iud9y_19"
                        src={`https://ui-avatars.com/api/?name=${friend.username}&background=random&color=fff`}
                        loading="lazy"
                        alt="Avatar"
                    />
                </div>
                <div className="_body_iud9y_25">
                    <div className="_text_iud9y_47">{friend.username}</div>
                    <div className="_footer_iud9y_32">{friend.score} Pandos</div>
                </div>

            </div>

        ));
    };

    const handleTabChange = (tab) => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        setActiveTab(tab);
    };

    const renderPrimeList = () => {
        return friends_stats.map((friend, index) => {
            // Преобразуем дату в нужный формат
            const date = new Date(friend.date_added);
            const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

            return (
                <div key={index} className="_item_iud9y_1">
                    <div className="_body_iud9y_25">
                        <div className="_text_iud9y_47 " style={{
                            display: "flex",
                            flexDirection: "row",
                            textAlign: "start",
                            alignItems: "start",
                            placeItems: "start",
                            justifyContent: "start"
                        }}>
                            <div
                                style={{color: "white"}}>+ {(friend?.friend_bonus ?? 0) + (friend?.balance_increment ?? 0)}</div>
                            &nbsp;
                            <div style={{color: "#F7C605"}}> Pando</div>
                        </div>

                        <div className="_footer_iud9y_32">{formattedDate}</div>
                    </div>
                    <div className="_details_iud9y_56">
                        <span className="_medal_iud9y_66">by 🐵 {friend.username}</span>
                        <div className="_footer_iud9y_32">
                            {friend.checked_id ? 'Authorized' : 'Checking in'}
                        </div>
                    </div>
                </div>
            );
        });
    };


    return (
        <div className="_page_1ulsb_1">
            <div className="_gameView_1cr97_1" id="game-view">
                <div className="_view_sf2n5_1 _view_1x19s_1" style={{opacity: 1}}>
                    <div className={`_backdrop_wo9zh_1  ${isLoading ? '_opened_wo9zh_16' : ''}`}></div>
                    <div className={`_content_wo9zh_21 ${isLoading ? '_opened_wo9zh_16' : ''}`}>
                        <div className={`_cross_wo9zh_61 ${isLoading ? '_opened_wo9zh_16' : ''}`}
                             onClick={handleClose}></div>
                        <div className={`_contentInner_wo9zh_44 ${isLoading ? '_opened_wo9zh_16' : ''}`}>
                            <div className="_sheetTitle_1x19s_93">Invite friends</div>
                            <div className="_separator_1x19s_86"></div>
                            <div className="_buttons_1x19s_79">
                                <div className="_root_oar9p_1 _type-white_oar9p_43" onClick={handleCopyInviteLink}>Copy
                                    invite link
                                </div>
                                <div className="_root_oar9p_1 _type-white_oar9p_43"
                                     onClick={handleShareInviteLink}>Share invite link
                                </div>
                            </div>
                            {copyMessage && (
                                <div className="_widget_8wj">
                                    Link was copied to the clipboard!
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="_title_1x19s_5">Invite friends<br/> and get more Pando</div>
                    <div className="_mascote_94k9d_1 _centered_94k9d_13">
                        <img
                            id="home-mascote"
                            src={`${process.env.PUBLIC_URL}/resources_directory/xw7juHs6u5b7AP1eDKX-removebg-preview.png`}
                            className="_doggy_94k9d_6 _width-82_94k9d_23 _mascote_1vo1r_60 _isRendered_1vo1r_63"
                            alt="Mascote"
                        />
                    </div>
                    {friendsArray.length === 0 ? (
                        <div className="_subtitleEmpty_1x19s_19">Tap on the button to invite your friends</div>
                    ) : (
                        <>
                            <div className="_boardTitle_zhpdf_23">{friendsArray.length} friends</div>
                            {friendsArray.map((user, index) => (
                                <div key={index} className="_item_iud9y_1">
                                    <div className="_media_iud9y_8">
                                        <img
                                            className="_avatar_iud9y_19"
                                            src={`https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff`}
                                            loading="lazy"
                                            alt="Avatar"
                                        />
                                    </div>
                                    <div className="_body_iud9y_25">
                                        <div className="_text_iud9y_47">{user.username}</div>
                                        <div className="_footer_iud9y_32">{user.score} OGs</div>
                                    </div>
                                    <div className="_details_iud9y_56">
                                        <span className="_medal_iud9y_66">+250 OGs</span>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                    <div className="_buttonWrap_1x19s_70">
                        <div className="_root_oar9p_1 _type-white_oar9p_43" style={{width:"100%"}} onClick={handleGoToScore}>Invite friends
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvitePage;
