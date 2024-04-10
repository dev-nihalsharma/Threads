import React, { useEffect, useState } from 'react';
import { useToast, Flex, Spinner } from '@chakra-ui/react';
import Post from '../components/Post';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import useShowToast from '../hooks/useShowToast';

const HomePage = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchFeedPost = async () => {
      try {
        setIsLoading(true);
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
    <>
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
    </>
  );
};

export default HomePage;
