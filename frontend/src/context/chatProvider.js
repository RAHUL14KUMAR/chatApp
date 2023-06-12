import {createContext,useContext,useState,useEffect} from 'react';
import {useNavigate} from "react-router-dom";


const chatContext=createContext();

const ChatProvider=({children})=>{
    // const navigate=useNavigate();
    const [user,setUser]=useState();
    const [selectedChat,setSelectedChat]=useState();
    const [chat,setChat]=useState([]);
    const [notification,setNotification]=useState([]);

    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if(!userInfo){
            // navigate("/login")
        }
    },[])
    return(
        <chatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chat,setChat,notification,setNotification}}>
            {children}
        </chatContext.Provider>
    )
}

export const ChatState=()=>{
    return useContext(chatContext)
}

export default ChatProvider

