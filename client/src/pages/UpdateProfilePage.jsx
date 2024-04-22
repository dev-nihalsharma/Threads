import React, { useRef, useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
} from '@chakra-ui/react';

import { NavLink } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useToast } from '@chakra-ui/react';
import userAtom from '../atoms/userAtom';
import usePreviewImage from '../hooks/usePreviewImage';
import { useNavigate } from 'react-router-dom';

const UpdateProfilePage = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio || '',
    password: '',
  });
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState();
  const profilePicRef = useRef();
  const { handleImageChange, previewImage } = usePreviewImage();
  const toast = useToast();
  const navigate = useNavigate();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitBtnLoading(true);
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...inputs, profilePic: previewImage }),
      });
      const data = await res.json();
      if (data) {
        toast({
          title: 'Success',
          description: data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsSubmitBtnLoading(false);

        navigate(`/${user.username}`);
      }
    } catch (error) {
      toast({
        title: 'Failed To Update Profile',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleUpdateProfile}>
      <Flex minH={'70vh'} align={'center'} justify={'center'}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.dark')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}></Heading>
          <FormControl>
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size='xl' src={previewImage || user.profilePic}></Avatar>
              </Center>
              <Center w='full'>
                <Button
                  w='full'
                  onClick={() => {
                    profilePicRef.current.click();
                  }}
                >
                  Change Profile Pic
                </Button>

                <Input type='file' hidden ref={profilePicRef} onChange={handleImageChange} />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full Name</FormLabel>
            <Input
              placeholder='John Doe'
              _placeholder={{ color: 'gray.500' }}
              type='text'
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder='johndoe'
              _placeholder={{ color: 'gray.500' }}
              type='text'
              value={inputs.username}
              onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>email</FormLabel>
            <Input
              placeholder='your-email@example.com'
              _placeholder={{ color: 'gray.500' }}
              type='email'
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder='Busy...'
              _placeholder={{ color: 'gray.500' }}
              type='text'
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder='password'
              _placeholder={{ color: 'gray.500' }}
              type='password'
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            />
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'red.400'}
              color={'white'}
              _hover={{
                bg: 'red.500',
              }}
              w={'full'}
            >
              <NavLink to={`/${user.username}`}>Cancel</NavLink>
            </Button>
            <Button
              bg={'blue.400'}
              color={'white'}
              w='full'
              _hover={{
                bg: 'blue.500',
              }}
              type='submit'
              isLoading={isSubmitBtnLoading}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
};

export default UpdateProfilePage;
