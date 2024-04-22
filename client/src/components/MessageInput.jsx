import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { IoSendSharp } from 'react-icons/io5';
import useShowToast from '../hooks/useShowToast';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { conversationsAtom, currentConversationAtom } from '../atoms/convAtoms';
import usePreviewImage from '../hooks/usePreviewImage';
import { BsFillImageFill } from 'react-icons/bs';

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState();

  const currentConversation = useRecoilValue(currentConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);

  const { handleImageChange, previewImage, setPreviewImage } = usePreviewImage();
  const messageMediaRef = useRef();
  const { onClose } = useDisclosure();
  const showToast = useShowToast();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !previewImage) return;
    if (isSendingMessage) return;

    setIsSendingMessage(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: currentConversation.userId,
          text: messageText,
          img: previewImage,
        }),
      });

      const data = await res.json();

      if (data.error) return showToast('Error', data.error, 'error');

      setConversations((prevConv) => {
        return prevConv.map((conv) => {
          if (conv._id === currentConversation._id) {
            return {
              ...conv,
              lastMessage: { text: messageText, sender: data.sender },
            };
          }
          return conv;
        });
      });

      setMessageText('');
      setPreviewImage('');
      setMessages((prevState) => [...prevState, data]);
    } catch (error) {
      showToast('Error', error.message, 'error');
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <Flex gap={2} align={'center'}>
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup>
          <Input
            placeholder='Type Your Message...'
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          ></Input>
          <InputRightElement>
            {isSendingMessage ? (
              <Spinner size={'sm'} />
            ) : (
              <IoSendSharp onClick={handleSendMessage} cursor={'pointer'} />
            )}
          </InputRightElement>
        </InputGroup>
      </form>

      <Flex flex={5} cursor={'pointer'}>
        <Input type={'file'} hidden ref={messageMediaRef} onChange={handleImageChange} />
        <BsFillImageFill onClick={() => messageMediaRef.current.click()} size={20} />
      </Flex>

      <Modal
        isOpen={previewImage}
        onClose={() => {
          onClose();
          setPreviewImage('');
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Selected Media</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex w={'full'}>
              <Image src={previewImage} alt='Message Media' />
            </Flex>
            <Flex justifyContent={'flex-end'} my={2}>
              {isSendingMessage ? (
                <Spinner size={'md'} />
              ) : (
                <IoSendSharp size={24} cursor={'pointer'} onClick={handleSendMessage} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MessageInput;
