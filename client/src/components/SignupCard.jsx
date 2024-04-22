import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom.js';
import userAtom from '../atoms/userAtom.js';

function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [_, setAuthSceen] = useRecoilState(authScreenAtom);
  const [inputs, setInputs] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const setUser = useSetRecoilState(userAtom);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      });

      const data = await res.json();
      console.log(data);
      if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      } else {
        toast({
          title: 'Successfully Signed in',
          description: '',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <Flex minH={'80vh'} align={'center'} justify={'center'}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Sign up
            </Heading>
          </Stack>
          <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.dark')} boxShadow={'lg'} p={8}>
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      type='text'
                      onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                      value={inputs.name}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input
                      type='text'
                      onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                      value={inputs.username}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type='email'
                  onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                  value={inputs.email}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                    value={inputs.password}
                  />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() => setShowPassword((showPassword) => !showPassword)}
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText='Signing In...'
                  size='lg'
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  type={'submit'}
                  isLoading={isLoading}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a user?{' '}
                  <Link color={'blue.400'} onClick={() => setAuthSceen('login')}>
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
}

export default SignupCard;
