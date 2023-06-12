import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {InputGroup, InputRightElement, VStack} from '@chakra-ui/react'
import { FormControl,FormLabel,Input,Button,useToast} from '@chakra-ui/react'
import axios from 'axios';

function Signup() {

    const navigate=useNavigate();

    const [show,setShow]=useState(false);
    const [name,setName]=useState();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const [confirmpassword,setConfirmpassword]=useState();
    const [pic,setPic]=useState();
    // const [loading,setLoading]=useState(false);

    const toast=useToast();

    const handleClick=()=>setShow(!show);

    const postDetails=(pics)=>{
        // setLoading(true);
        if(pics===undefined){
            toast({
                title:"please select an image",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
            })
            return;
        }
        console.log(pics);
        if(pics.type==='image/jpeg'||pics.type==='image/png'){
            const data=new FormData();
            data.append("file",pics);
            data.append("upload_preset","chat-app");
            data.append("cloud_name","dxdctwwyf");
            fetch("https://api.cloudinary.com/v1_1/dxdctwwyf/image/upload",{
                method:'post',
                body:data
            })
            .then((res)=>res.json())
            .then((data)=>{
                setPic(data.url.toString());
                console.log(""+data.url);
                // setLoading(false);
            })
            .catch((err)=>{
                console.log(err);
                // setLoading(false);
            })
        }else{
            toast({
                title:"please select an image",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
            })
            return;
        }

    }
    const submitHandler=async()=>{
        //  setLoading(true);
         if(!name||!email||!password||!confirmpassword){
            toast({
                title:"please fill al the fields",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
            })
            // setLoading(false);
            return;
         }
         if(password!=confirmpassword){
            toast({
                title:"password does not match",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
            })
            return;
         }
         try{
            const config={
                headers:{
                    "Content-Type":"application/json"
                }
            }
            const data=await axios.post(`http://localhost:5000/api/user/signup`,{name,email,password,pic},config);
            toast({
                title:"registeration successfull",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"top"
            })
            console.log(data);
            localStorage.setItem("userInfo",JSON.Stringify(data.data));
            // setLoading(false);
            navigate('/chats');

         }catch(error){
            toast({
                title:"ERROR OCCURED",
                // description:error.response.data.message,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"top"
            })
            // setLoading(false);
         }
    }

  return (
    <VStack spacing='5px' color='black'>
      <FormControl id='first-name' isRequired>
        <FormLabel>
            NAME
        </FormLabel>
        <Input
            placeholder='enter your name'
            value={name}
            onChange={(e)=>setName(e.target.value)}
        />
      </FormControl>
      <FormControl id='email' isRequired>
        <FormLabel>
            EMAIL
        </FormLabel>
        <Input
            value={email}
            placeholder='enter your email'
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
            placeholder='enter your password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
        />
        <InputRightElement width='4.75rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show?"hide":"show"}
            </Button>
        </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="passwords" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='pic'>
        <FormLabel>
            UPLOAD YOUR PROFILE PIC
        </FormLabel>
        <Input
            type='file' p={1.5} accept='image/*'
            // value={pic}
            onChange={(e)=>postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        // isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  )
}

export default Signup
