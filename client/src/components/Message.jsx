import { Avatar, Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentConversationAtom } from '../atoms/convAtoms';
import userAtom from '../atoms/userAtom';
import { BsCheck2All } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
const Message = ({ message }) => {
  const currentConversation = useRecoilValue(currentConversationAtom);
  const currentUser = useRecoilValue(userAtom);

  const [imgLoaded, setImageLoaded] = useState(false);

  return (
    <>
      {currentUser._id === message.sender ? (
        <Flex gap={2} alignSelf={'flex-end'}>
          {message.text && (
            <Flex bg={'green.800'} p={1.5} borderRadius={'md'} maxW={'350px'}>
              <Text color={'white'}>{message.text}</Text>

              <Box alignSelf={'flex-end'} ml={1} color={message.seen ? 'blue.400' : ''}>
                <BsCheck2All size={12} />
              </Box>
            </Flex>
          )}

          {message.img && !imgLoaded && (
            <Flex w={'200px'}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setImageLoaded(true)}
                alt='Message Media'
                borderRadius={4}
              />
              <Skeleton w={'200px'} h={'200px'} borderRadius={4} />
            </Flex>
          )}

          {message.img && imgLoaded && (
            <NavLink target={'_blank'} to={message.img}>
              <Flex w={'200px'}>
                <Image src={message.img} alt='Message Media' borderRadius={4} />
                <Box alignSelf={'flex-end'} ml={1} color={message.seen ? 'blue.400' : ''}>
                  <BsCheck2All size={12} />
                </Box>
              </Flex>
            </NavLink>
          )}

          <Avatar src={currentUser.profilePic} w={7} h={7}></Avatar>
        </Flex>
      ) : (
        <Flex gap={2} alignSelf={'flex-start'}>
          <Avatar src={currentConversation.userProfilePic} w={7} h={7}></Avatar>
          {message.text && (
            <Text bg={'gray.500'} p={1.5} borderRadius={'md'} maxW={'350px'}>
              {message.text}
            </Text>
          )}

          {message.img && !imgLoaded && (
            <Flex w={'200px'}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setImageLoaded(true)}
                alt='Message Media'
                borderRadius={4}
              />
              <Skeleton w={'200px'} h={'200px'} borderRadius={4} />
            </Flex>
          )}

          {message.img && imgLoaded && (
            <NavLink target={'_blank'} to={message.img}>
              <Flex w={'200px'}>
                <Image src={message.img} alt='Message Media' borderRadius={4} />
              </Flex>
            </NavLink>
          )}
        </Flex>
      )}
    </>
  );
};

export default Message;
