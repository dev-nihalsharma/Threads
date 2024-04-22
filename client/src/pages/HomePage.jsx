import React, { useEffect, useState } from 'react';
import { useToast, Flex, Spinner, Box } from '@chakra-ui/react';
import Post from '../components/Post';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import useShowToast from '../hooks/useShowToast';
import SuggestedUsers from '../components/SuggestedUsers';

const HomePage = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchFeedPost = async () => {
      setIsLoading(true);
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/feed`, {
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
        setPosts(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
        showToast('Error', error.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedPost();
  }, [showToast]);

  return (
    <Flex gap={10} alignItems={'flex-start'}>
      <Box flex={70}>
        {isLoading ? (
          <Flex justifyContent={'center'}>
            <Spinner size={'xl'} />
          </Flex>
        ) : posts.length == 0 ? (
          <Flex justifyContent={'center'} mt={20}>
            <h1>You must follow someone to view posts</h1>
          </Flex>
        ) : (
          posts.map((post) => {
            return <Post key={post._id} post={post} />;
          })
        )}
      </Box>
      <Box flex={30}>
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
