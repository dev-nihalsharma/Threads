import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { Avatar, Image } from '@chakra-ui/react';
import React, { useState } from 'react';
import {
  BsChat,
  BsHeart,
  BsRepeat,
  BsSend,
  BsThreeDotsVertical,
} from 'react-icons/bs';
import Actions from './Actions';

function UserPost({ postTitle, postImg, likes, replies }) {
  return (
    <Link to={'/mark/post/1'}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={'column'} alignItems={'center'}>
          <Avatar size={'md'} name={'Mark Zuckerberg'} src='/zuck-avatar.png' />
          <Box w='1px' h={'full'} bg={'gray.light'} my={2}></Box>
          <Box position={'relative'} w={'full'}>
            <Avatar
              size={'xs'}
              name='John Doe'
              src='https://bit.ly/prosper-baba'
              position={'absolute'}
              top={'0px'}
              left={'15px'}
              padding={'2px'}
            />
            <Avatar
              size={'xs'}
              name='John Doe'
              src='https://bit.ly/kent-c-dodds'
              position={'absolute'}
              bottom={'0px'}
              right={'-5px'}
              padding={'2px'}
            />
            <Avatar
              size={'xs'}
              name='John Doe'
              src='https://bit.ly/ryan-florence'
              position={'absolute'}
              bottom={'0px'}
              left={'4px'}
              padding={'2px'}
            />
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={'column'} gap={2}>
          <Flex justifyContent={'space-between'}>
            <Flex w={'full'} alignItems={'center'}>
              <Text fontSize={'sm'} fontWeight={'bold'}>
                markzuck
              </Text>
              <Image src='verified.png' w={4} h={4} ml={1} />
            </Flex>
            <Flex alignItems={'center'}>
              <Text fontSize={'sm'} color={'gray.light'}>
                23hr
              </Text>

              <BsThreeDotsVertical />
            </Flex>
          </Flex>
          <Text fontSize={'sm'}>{postTitle}</Text>
          {postImg && (
            <Box
              borderRadius={6}
              overflow={'hidden'}
              border={'1px solid gray.light'}
            >
              <Image src={postImg} w={'full'} />
            </Box>
          )}

          <Flex gap={3} my={1} alignItems={'center'}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
}

export default UserPost;
