import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom.js';

function UserHeader({ user }) {
  const toast = useToast();
  const CopyUrl = async () => {
    const currentURL = window.location.href;
    await navigator.clipboard.writeText(currentURL);
    console.log(currentURL);
    toast({ title: 'Coppied!', status: 'success' });
  };

  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(
    user?.followers.includes(currentUser?._id)
  );
  const [isFlwBtnLoading, SetIsFlwBtnLoading] = useState();

  const handelFollowUnFollow = async () => {
    if (!currentUser) {
      toast({
        title: 'You must be logged in',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (isFlwBtnLoading) return;
    SetIsFlwBtnLoading(true);
    const res = await fetch(`/api/users/follow/${user?._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (data.error) {
      toast({
        title: 'Error',
        description: data.error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    if (following) {
      toast({
        title: 'Unfollowed',
        description: data.message,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      user?.followers.pop();
    }
    if (!following) {
      toast({
        title: 'Followed',
        description: data.message,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      user?.followers.push(currentUser?._id);
    }

    setFollowing(!following);
    SetIsFlwBtnLoading(false);
  };

  return (
    <VStack alignItems={'start'}>
      <Flex justifyContent={'space-between'} w={'full'}>
        <Box>
          <Text fontSize={'2xl'} fontWeight={'bold'}>
            {user?.name}
          </Text>
          <Flex alignItems={'center'} gap={4}>
            <Text size={'sm'}>{user?.username}</Text>
            <Text
              size={'xs'}
              bg={'gray.dark'}
              color={'gray.light'}
              p={1}
              borderRadius={8}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name={user?.name}
            size={{ base: 'md', md: 'xl' }}
            src={user?.profilePic}
          ></Avatar>
        </Box>
      </Flex>
      <Text>{user?.bio}</Text>
      <Flex justifyContent={'space-between'} w={'full'}>
        <Flex gap={2} alignItems={'center'}>
          <Text color={'gray.light'}>{user?.followers.length} Followers</Text>
          <Box w={1} p={1} borderRadius={'full'} bg={'gray.light'}></Box>
          <Link
            href={`https://instagram.com/${user?.username}`}
            target='_blank'
            color={'gray.light'}
          >
            instagram.com
          </Link>
        </Flex>
        <Flex alignItems={'center'} gap={2}>
          <Box className='icon-container'>
            <BsInstagram size={24} cursor={'pointer'}></BsInstagram>
          </Box>
          <Box className='icon-container'>
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={'pointer'}></CgMoreO>
              </MenuButton>
              <Portal>
                <MenuList bg={'gray.dark'}>
                  <MenuItem onClick={CopyUrl}>Copy Link</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      {currentUser?._id === user?._id && (
        <NavLink to='/edit-profile'>
          <Button>Edit Profile</Button>
        </NavLink>
      )}
      {currentUser?._id !== user?._id && (
        <Button
          onClick={handelFollowUnFollow}
          size={'sm'}
          isLoading={isFlwBtnLoading}
        >
          {following ? 'Un-Follow' : 'Follow'}
        </Button>
      )}

      <Flex w={'full'}>
        <Flex
          flex={1}
          borderBottom={'1.5px solid white'}
          justifyContent={'center'}
          pb='3'
          cursor={'pointer'}
        >
          <Text fontWeight={'bold'}> Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={'1px solid gray'}
          justifyContent={'center'}
          color={'gray.light'}
          pb='3'
          cursor={'pointer'}
        >
          <Text fontWeight={'bold'}> Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
}

export default UserHeader;
