import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentConversationAtom } from '../atoms/convAtoms';
import useShowToast from '../hooks/useShowToast';
import Message from './Message';
import MessageInput from './MessageInput';
import { useSocket } from '../context/SocketContext';
import userAtom from '../atoms/userAtom';
import messageNotificationSound from '../assets/sounds/message.mp3';
const MessageContainer = () => {
  const currentConversation = useRecoilValue(currentConversationAtom);
  const currentUser = useRecoilValue(userAtom);

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();

  const isOnline = onlineUsers.includes(currentConversation.userId);

  const latestMessageRef = useRef(null);

  useEffect(() => {
    socket.on('newMessage', (newMessage) => {
      setMessages((prevMessages) => {
        return [...prevMessages, newMessage];
      });

      if (!document.hasFocus()) {
        const sound = new Audio(messageNotificationSound);
        sound.play();
      }
    });

    return () => socket.off('newMessage');
  }, [socket]);

  useEffect(() => {
    const lastMessageFromOtherUser =
      messages.length && messages[messages.length - 1].sender !== currentUser._id;

    if (lastMessageFromOtherUser) {
      socket.emit('markMessagesAsSeen', {
        conversationId: currentConversation._id,
        userId: currentConversation.userId,
      });
    }

    socket.on('messagesSeen', ({ conversationId }) => {
      if (conversationId === currentConversation._id) {
        setMessages((prevMessages) => {
          return prevMessages.map((message) => {
            if (message.sender === currentUser._id) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
        });
      }
    });
  }, [socket, currentUser._id, messages, currentConversation]);

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        if (currentConversation.mock) return;
        const res = await fetch(`api/messages/${currentConversation.userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (data.error) {
          showToast('Error', data.error, 'error');
          return;
        }
        setMessages(data);
      } catch (err) {
        console.log(err);
        showToast('Error', err.message, 'error');
      } finally {
        setLoadingMessages(false);
      }
    };

    getMessages();
  }, [showToast, currentConversation._id, currentConversation.mock]);

  return (
    <Flex
      flex={70}
      bg={useColorModeValue('gray.200', 'gray.dark')}
      borderRadius={'md'}
      p={2}
      direction={'column'}
    >
      {/* Header */}
      <NavLink to={`/${currentConversation.username}`}>
        <Flex alignItems={'center'} p={2} gap={2} w={'full'}>
          <Avatar
            src={currentConversation.userProfilePic}
            size={{
              base: 'xs',
              sm: 'sm',
              md: 'md',
            }}
          />
          <Stack gap={1}>
            <Text fontWeight={700} display={'flex'} alignItems={'center'} gap={1}>
              {currentConversation.username} <Image src='/verified.png' w={4} />
            </Text>
            {isOnline ? (
              <Text fontWeight={400} fontSize={'xs'} color={'green.400'}>
                Online
              </Text>
            ) : (
              <Text fontWeight={400} fontSize={'xs'} color={'gray'}>
                Offline
              </Text>
            )}
          </Stack>
        </Flex>
        <Divider />
      </NavLink>

      {/* Body */}
      <Flex flexDirection={'column'} gap={2} overflowY={'auto'} my={4} p={1} h={'550px'}>
        {loadingMessages
          ? [...Array(5)].map((_, i) => (
              <Flex
                key={i}
                gap={2}
                alignItems={'center'}
                p={1}
                borderRadius={'md'}
                alignSelf={i % 2 === 0 ? 'flex-start' : 'flex-end'}
              >
                {i % 2 === 0 && <SkeletonCircle size={7} />}
                <Flex flexDir={'column'} gap={2}>
                  <Skeleton h='8px' w='250px' />
                  <Skeleton h='8px' w='250px' />
                  <Skeleton h='8px' w='250px' />
                </Flex>
                {i % 2 !== 0 && <SkeletonCircle size={7} />}
              </Flex>
            ))
          : messages.map((message) => {
              return (
                <Flex
                  key={message._id}
                  direction={'column'}
                  ref={messages.length - 1 === messages.indexOf(message) ? latestMessageRef : null}
                >
                  <Message message={message} />
                </Flex>
              );
            })}
      </Flex>
      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
