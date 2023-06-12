import React,{useState} from 'react';
import { ChatState } from "../../context/chatProvider";
import {BellIcon,ChevronDownIcon} from "@chakra-ui/icons"
import { Tooltip,Box,Button,Text ,Menu,MenuButton,MenuList,MenuItem,MenuDivider, Drawer} from '@chakra-ui/react';
import { Avatar } from "@chakra-ui/avatar";
import ProfileModal from "./ProfileModal";
import { useNavigate } from 'react-router-dom';
import { DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay,Input} from "@chakra-ui/react";
import { useDisclosure } from '@chakra-ui/react'; 
import { useToast } from "@chakra-ui/toast";
import { Spinner } from "@chakra-ui/spinner";
import axios from 'axios';
import ChatLoading from "./ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { getSender } from '../../config/ChatLogic';
import NotificationBadge from "react-notification-badge"
import { Effect } from 'react-notification-badge';

function SideDrawer() {
  const navigate=useNavigate();
  const toast = useToast();

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    console.log(search);

    const {isOpen,onOpen,onClose}=useDisclosure();

    const {
      setSelectedChat,
      user,
      chat,
      setChat,
      notification,
      setNotification
    } = ChatState();
    
    const logoutHandler=()=>{
      localStorage.removeItem("userInfo");
      navigate("/");
    }
    const handleSearch=async()=>{
      console.log(search);
      if (!search) {
        toast({
          title: "Please Enter something in search",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
        return;
      }
      try{
        setLoading(true);

        const config={
          headers:{
            Authorization:`Bearer ${user.token}`
          }
        }
        const {data}=await axios.get(`http://localhost:5000/api/user/all?search=${search}`,config);

        setLoading(false);
        setSearchResult(data);
      }catch(error){
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }

    const accessChat = async (userId) => {
      console.log(userId);
  
      try {
        setLoadingChat(true);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(`http://localhost:5000/api/chat/`, { userId }, config);
  
        if (!chat.find((c) => c._id === data._id)) setChat([data, ...chat]);
        setSelectedChat(data);
        setLoadingChat(false);
        onClose();
      } catch (error) {
        toast({
          title: "Error fetching the chat",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };
  return (
    <>
        <Box display="flex" justifyContent="space-between"alignItems="center" bg="white" w="100%" p="5px 10px 5px 10px" borderWidth="5px">
          <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Let-Gossips
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge 
              count={notification.length}
              effect={Effect.SCALE}
               />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            {/* {menuList} */}
            <MenuList>
              {
                !notification.length&&"NO NEW MESSAGE"
              }
              {
                notification.map((notif)=>{
                  <MenuItem key={notif._id} onClick={()=>{ setSelectedChat(notif.chat);
                  setNotification(notification.filter((n)=>n!==notif))
                  }}>
                    {notif.chat.isGroupChat?`new message in ${notif.chat.chatName}`:`new message from ${getSender(user,notif.chat.users)} `}
                  </MenuItem>
                })
              }
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider /> 
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}/>
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer