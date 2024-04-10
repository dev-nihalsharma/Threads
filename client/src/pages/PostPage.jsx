import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Text,
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  Input,
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Comment from '../components/Comment';
import getUserProfile from '../hooks/useGetUserProfile';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { formatDistanceToNowStrict } from 'date-fns';
import Actions from '../components/Actions';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { DeleteIcon } from '@chakra-ui/icons';
import postsAtom from '../atoms/postsAtom';
function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const showToast = useShowToast();
  const { user, isLoading } = getUserProfile();

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/posts/${postId}`, {
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
        setPost(data);
      } catch (error) {
        showToast('Error', error.message, 'error');
      }
    };

    getPost();
  }, [postId, showToast]);

  const handleDelete = async (e) => {
    try {
      if (!window.confirm('Are you sure you want to delete this post')) return;

      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (data.error) {
        showToast('Error', data.error, 'error');
        return;
      }
      showToast('Success', 'Post deleted', 'success');
      navigate(`/${user.username}`);
    } catch (error) {
      showToast('Error', error.message, 'error');
    }
  };
  const handleReply = async () => {
    if (!user)
      return showToast(
        'Error',
        'You must be logged in to reply to a post',
        'error'
      );
    if (isReplying) return;
    setIsReplying(true);
    try {
      const res = await fetch('/api/posts/reply/' + post._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: reply }),
      });
      const data = await res.json();

      if (data.error) return showToast('Error', data.error, 'error');

      setPost({ ...post, replies: [...post.replies, data] });
      showToast('Success', 'Reply posted successfully', 'success');
      onClose();
      setReply('');
    } catch (error) {
      showToast('Error', error.message, 'error');
    } finally {
      setIsReplying(false);
    }
  };

  if (!user && isLoading)
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    );

  if (!post) return null;
  return (
    <>
      <Flex gap={3} mb={4} py={5}>
        <Flex flex={1} flexDirection={'column'} gap={2}>
          <Flex w={'full'} justifyContent={'space-between'}>
            <Flex alignItems={'center'}>
              <Avatar
                size={'md'}
                name={user.name}
                src={user.profilePic}
                mr={2}
              />
              <Text fontSize={'sm'} fontWeight={'bold'}>
                {user.username}
              </Text>
              <Image src='/verified.png' w={4} h={4} ml={1} />
            </Flex>
            <Flex alignItems={'center'}>
              <Text fontSize={'sm'} color={'gray.light'}>
                {formatDistanceToNowStrict(new Date(post.createdAt))}
              </Text>

              {currentUser?._id == post.postedBy && (
                <DeleteIcon onClick={handleDelete} ml={2} cursor={'pointer'} />
              )}
            </Flex>
          </Flex>
          <Text fontSize={'sm'}>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={6}
              overflow={'hidden'}
              border={'1px solid gray.light'}
            >
              <Image src={post.img} w={'full'} />
            </Box>
          )}

          {/* <Flex gap={3} my={1} alignItems={'center'}>
            <Actions post={post} />
          </Flex> */}

          <Divider my={4} />
          <Flex justifyContent={'space-between'}>
            <Flex gap={2} alignItems={'center'}>
              <Text fontSize={'2xl'}>👋</Text>
              <Text color={'gray.light'}>
                Get the app to like, reply and post.
              </Text>
            </Flex>
            <Button onClick={onOpen}>Get</Button>
          </Flex>
        </Flex>
      </Flex>

      <Divider my={4} />

      {post.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          isLastReply={post.replies[post.replies.length - 1] == reply}
        />
      ))}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Write your comment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input
                placeholder='Reply goes here..'
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='blue'
              size={'sm'}
              mr={3}
              isLoading={isReplying}
              onClick={handleReply}
            >
              Reply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PostPage;
