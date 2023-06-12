import React,{useState} from 'react'
import {InputGroup, InputRightElement, VStack} from '@chakra-ui/react'
import { FormControl,FormLabel,Input,Button} from '@chakra-ui/react'
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import {useNavigate} from 'react-router-dom'

function Login() {

    const navigate=useNavigate();

    const [show,setShow]=useState(false);
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const submitHandler=async()=>{
        setLoading(true);
        if (!email || !password) {
          toast({
            title: "Please Fill all the Feilds",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
          return;
        }
        try {
            const config = {
              headers: {
                "Content-type": "application/json",
              },
            };
      
            const { data } = await axios.post(
              `http://localhost:5000/api/user/login`,
              { email, password },
              config
            );
      
            // console.log(JSON.stringify(data));
            toast({
              title: "Login Successful",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats");
          } catch (error) {
            toast({
              title: "Error Occured!",
              description: error.response.data.message,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
          }
        };
    


    const handleClick=()=>setShow(!show);

  return (
    <VStack spacing='5px' color='black'>
       <FormControl id='email' isRequired>
        <FormLabel>
            EMAIL
        </FormLabel>
        <Input
            placeholder='enter your email'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
        />
        </FormControl>
        <FormControl id='Password' isRequired>
        <FormLabel>
            PASSWORD
        </FormLabel>
        <InputGroup>
        <Input
            type={show?'text':'password'}
            value={password}
            placeholder='enter your password'
            onChange={(e)=>setPassword(e.target.value)}
        />
        <InputRightElement width='4.75rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show?"hide":"show"}
            </Button>
        </InputRightElement>
        </InputGroup>
       </FormControl>
       <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Login
      </Button>
      <Button
        colorScheme="red"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={()=>{
            setEmail("guest@gmail.com");
            setPassword("guest@1234");
        }}
      >
        Get User Credentials
      </Button>
    </VStack>
  )
}

export default Login
