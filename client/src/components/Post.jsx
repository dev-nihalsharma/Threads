import { DeleteIcon } from '@chakra-ui/icons';
import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { formatDistanceToNowStrict } from 'date-fns';
import useShowToast from '../hooks/useShowToast';
import Actions from './Actions';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postsAtom';

function Post({ post }) {
  const [postedByUser, setPostedByUser] = useState(null);
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);

  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${post.postedBy}`, {
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
        setPostedByUser(data);
      } catch (error) {
        showToast('Error', error.message, 'error');
        return;
      }
    };

    getUser();
  });

  const handleDelete = async (e) => {
    try {
      e.preventDefault();
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
      setPosts(
        posts.filter((p) => {
          return p._id !== post._id;
        })
      );
    } catch (error) {
      showToast('Error', error.message, 'error');
    }
  };

  return (
    <>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={'column'} alignItems={'center'}>
          <Link to={`/${postedByUser?.username}`}>
            <Avatar size={'md'} name={postedByUser?.name} src={postedByUser?.profilePic} />
          </Link>
          <Box w='1px' h={'full'} bg={'gray.light'} my={2}></Box>
          <Box position={'relative'} w={'full'}>
            {post.replies.length === 0 && <Text textAlign={'center'}>🤔</Text>}
            {post.replies[0] && (
              <Avatar
                size='xs'
                name='John doe'
                src={post.replies[0].userProfilePic}
                position={'absolute'}
                top={'0px'}
                left='15px'
                padding={'2px'}
              />
            )}

            {post.replies[1] && (
              <Avatar
                size='xs'
                name='John doe'
                src={post.replies[1].userProfilePic}
                position={'absolute'}
                bottom={'0px'}
                right='-5px'
                padding={'2px'}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size='xs'
                name='John doe'
                src={post.replies[2].userProfilePic}
                position={'absolute'}
                bottom={'0px'}
                left='4px'
                padding={'2px'}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={'column'} gap={2}>
          <Flex justifyContent={'space-between'}>
            <Link to={`/${postedByUser?.username}`}>
              <Flex w={'full'} alignItems={'center'}>
                <Text fontSize={'sm'} fontWeight={'bold'}>
                  {postedByUser?.username}
                </Text>
                <Image src='verified.png' w={4} h={4} ml={1} />
              </Flex>
            </Link>
            <Flex alignItems={'center'}>
              <Text fontSize={'sm'} color={'gray.light'}>
                {formatDistanceToNowStrict(new Date(post.createdAt))}
              </Text>

              {currentUser?._id == post.postedBy && (
                <DeleteIcon onClick={handleDelete} ml={2} cursor={'pointer'} />
              )}
            </Flex>
          </Flex>
          <Link to={`/${postedByUser?.username}/post/${post._id}`}>
            <Text fontSize={'sm'}>{post.text}</Text>
            {post.img && (
              <Box borderRadius={6} overflow={'hidden'} border={'1px solid gray.light'}>
                <Image src={post.img} w={'full'} />
              </Box>
            )}
          </Link>

          <Flex gap={3} my={1} alignItems={'center'}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default Post;
