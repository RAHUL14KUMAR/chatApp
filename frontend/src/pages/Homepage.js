import React,{useEffect} from 'react'
import {
    Container,
    Box,
    Text,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs
} from '@chakra-ui/react';
import {useNavigate} from 'react-router-dom';

import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';

function Homepage() {
    const navigate=useNavigate();

    useEffect(()=>{
      const userInfo=JSON.parse(localStorage.getItem("userInfo"));

      if(userInfo){
        navigate("/chats")
      }
  },[navigate])
    
  return (
    <Container maW='xl' centerContent>
      <Box d='flex' justifyContent='center' p={3} bg={'white'} w='100%'m='40px 0 15px 0' borderRadius='1g' borderWidth='1px'>
        <Text textAlign='center'fontSize='4xl'fontFamily='work sans' color='black'>Lets-Gossips</Text>
      </Box>
      <Box bg='white' w='100%'p={4} borderRadius='lg' borderWidth='1px' color='black'>
      <Tabs variant='soft-rounded' colorScheme='green'>
        <TabList mb='1em'>
            <Tab width='50%'>Login</Tab>
            <Tab width='50%'>Signup</Tab>
        </TabList>
        <TabPanels>
        <TabPanel>
            <Login/>
        </TabPanel>
        <TabPanel>
            <Signup/>
        </TabPanel>
        </TabPanels>
       </Tabs>
      </Box>
    </Container>
  )
}

export default Homepage
