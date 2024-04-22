import {
  Avatar,
  AvatarBadge,
  Flex,
  Image,
  Stack,
  Text,
  WrapItem,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { BsCheck2All, BsFillImageFill, BsFolder } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentConversationAtom } from '../atoms/convAtoms';
import userAtom from '../atoms/userAtom';

const Conversation = ({ conversation, isOnline }) => {
  const otherUser = conversation.participants[0];
  const lastMessage = conversation.lastMessage;

  const currentUser = useRecoilValue(userAtom);
  const [currentConversation, setCurrentConversation] = useRecoilState(currentConversationAtom);
  const colorMode = useColorMode();

  return (
    <Flex
      gap={3}
      my={1}
      alignItems={'center'}
      p={1}
      _hover={{
        cursor: 'pointer',
        bg: useColorModeValue('gray.600', 'gray.800'),
        color: 'white',
      }}
      bg={
        currentConversation?._id === conversation._id
          ? colorMode.colorMode === 'light'
            ? 'gray.400'
            : 'gray.dark'
          : ''
      }
      onClick={() =>
        setCurrentConversation({
          _id: conversation._id,
          mock: conversation.mock,
          userId: otherUser._id,
          username: otherUser.username,
          userProfilePic: otherUser.profilePic,
        })
      }
    >
      <WrapItem>
        <Avatar
          src={otherUser.profilePic}
          size={{
            base: 'xs',
            sm: 'sm',
            md: 'md',
          }}
        >
          {isOnline && <AvatarBadge bg={'green.500'} boxSize={'1em'} />}
        </Avatar>
      </WrapItem>

      <Stack direction={'column'} fontSize={'sm'}>
        <Text fontWeight={700} display={'flex'} alignItems={'center'} gap={1}>
          {otherUser.username}
          <Image src='/verified.png' w={4} />
        </Text>
        <Text fontSize={'xs'} display={'flex'} alignItems={'center'} gap={1}>
          {currentUser._id.toString() === otherUser._id.toString() ? (
            <Box alignSelf={'flex-end'} ml={1} color={lastMessage.seen ? 'blue.400' : ''}>
              <BsCheck2All size={12} />
            </Box>
          ) : (
            ''
          )}
          {lastMessage.text
            ? lastMessage.text.length > 18
              ? lastMessage.text.substring(0, 18) + '...'
              : lastMessage.text
            : lastMessage.sender && (
                <>
                  <BsFillImageFill size={12} />
                  Sent A Photo
                </>
              )}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;
