import React, { useRef, useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useColorModeValue,
  useDisclosure,
  Textarea,
  Input,
  Text,
  CloseButton,
  Flex,
  FormControl,
  useToast,
} from '@chakra-ui/react';
import usePreviewImage from '../hooks/usePreviewImage';
import { BsFileImageFill } from 'react-icons/bs';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom.js';
import postsAtom from '../atoms/postsAtom.js';
import { useLocation, useParams } from 'react-router-dom';

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState('');
  const postMediaRef = useRef();
  const { handleImageChange, previewImage, setPreviewImage } = usePreviewImage();
  const user = useRecoilValue(userAtom);
  const toast = useToast();
  const [isCreatePostLoading, setIsCreatePostLoading] = useState();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();
  const { pathname } = useLocation();

  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };
  const handleCreatePost = async () => {
    try {
      setIsCreatePostLoading(true);
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: previewImage,
        }),
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
      } else if (data) {
        toast({
          title: 'Post Created',
          description: data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      onClose();
      setIsCreatePostLoading(false);
      if (username === user.username || pathname === '/') {
        setPosts([data.post, ...posts]);
      }
      setPostText('');
      setPreviewImage('');
    } catch (error) {
      toast({
        title: 'Failed To Create Post',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <Button
        position={'fixed'}
        bottom={10}
        right={10}
        bg={useColorModeValue('gray.300', 'gray.dark')}
        leftIcon={<AddIcon />}
        onClick={onOpen}
      >
        Post
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Textarea
                placeholder='Write your post details here'
                onChange={handleTextChange}
                value={postText}
                maxLength={500}
              />
              <Text size={'xs'} color={'gray.800'} textAlign={'right'} fontWeight={'bold'} m={1}>
                {postText.length}/500
              </Text>
              <Input type='file' hidden ref={postMediaRef} onChange={handleImageChange} />

              <BsFileImageFill
                style={{ marginLeft: '5px', cursor: 'pointer' }}
                size={16}
                onClick={() => postMediaRef.current.click()}
              />

              {previewImage && (
                <Flex m={'5px'} w={'full'} position={'relative'}>
                  <img src={previewImage} />
                  <CloseButton onClick={() => setPreviewImage('')} position={'absolute'} top={2} right={2} />
                </Flex>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={2} onClick={handleCreatePost} isLoading={isCreatePostLoading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CreatePost;
