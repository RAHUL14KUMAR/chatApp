import React, { useState } from 'react'
import { ChatState } from '../context/chatProvider'
import axios from 'axios'
import SideDrawer from '../components/miscellaneous/SideDrawer';
import ChatBox from '../components/miscellaneous/ChatBox';
import MyChat from '../components/miscellaneous/MyChat';
import { Box } from '@chakra-ui/react';

function ChatPage() {

  const {user}=ChatState();
  const [fetchAgain,setFetchAgain]=useState(false)
  return (
    <div style={{width:"100%"}}>
      {user&&<SideDrawer/>}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="92vh"
        padding="10px"
      >
        {user&&<MyChat fetchAgain={fetchAgain}/>}
        {user&&<ChatBox fetchAgain={fetchAgain}/>}
      </Box>
    </div>
  )
}

export default ChatPage
