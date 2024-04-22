import { DeleteIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import userAtom from '../atoms/userAtom';
import Actions from '../components/Actions';
import Comment from '../components/Comment';
import getUserProfile from '../hooks/useGetUserProfile';
import useShowToast from '../hooks/useShowToast';
function PostPage() {
  const { postId } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const currentPost = posts[0];
  const navigate = useNavigate();
  const showToast = useShowToast();
  const { user, isLoading } = getUserProfile();

  useEffect(() => {
    setPosts([]);
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}`, {
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
        setPosts([data]);
      } catch (error) {
        showToast('Error', error.message, 'error');
      }
    };

    getPost();
  }, [postId, showToast]);

  const handleDelete = async (e) => {
    try {
      if (!window.confirm('Are you sure you want to delete this post')) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
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

  if (!user && isLoading)
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    );

  if (!currentPost) return null;
  return (
    <>
      <Flex gap={3} mb={4} py={5}>
        <Flex flex={1} flexDirection={'column'} gap={2}>
          <Flex w={'full'} justifyContent={'space-between'}>
            <Flex alignItems={'center'}>
              <Avatar size={'md'} name={user.name} src={user.profilePic} mr={2} />
              <Text fontSize={'sm'} fontWeight={'bold'}>
                {user.username}
              </Text>
              <Image src='/verified.png' w={4} h={4} ml={1} />
            </Flex>
            <Flex alignItems={'center'}>
              <Text fontSize={'sm'} color={'gray.light'}>
                {formatDistanceToNowStrict(new Date(currentPost.createdAt))}
              </Text>

              {currentUser?._id == currentPost.postedBy && (
                <DeleteIcon onClick={handleDelete} ml={2} cursor={'pointer'} />
              )}
            </Flex>
          </Flex>
          <Text fontSize={'sm'}>{currentPost.text}</Text>
          {currentPost.img && (
            <Box borderRadius={6} overflow={'hidden'} border={'1px solid gray.light'}>
              <Image src={currentPost.img} w={'full'} />
            </Box>
          )}

          <Flex gap={3} my={1} alignItems={'center'}>
            <Actions post={currentPost} />
          </Flex>

          <Divider my={4} />
          <Flex justifyContent={'space-between'}>
            <Flex gap={2} alignItems={'center'}>
              <Text fontSize={'2xl'}>👋</Text>
              <Text color={'gray.light'}>Get the app to like, reply and post.</Text>
            </Flex>
            <Button>Get</Button>
          </Flex>
        </Flex>
      </Flex>

      <Divider my={4} />

      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          isLastReply={currentPost.replies[currentPost.replies.length - 1] == reply}
        />
      ))}
    </>
  );
}

export default PostPage;
