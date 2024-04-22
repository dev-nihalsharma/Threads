import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserPost from '../components/UserPost';
import { useToast, Flex, Spinner } from '@chakra-ui/react';
import UserHeader from '../components/UserHeader';
import NotFoundPage from './NotFoundPage';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import Post from '../components/Post';
import getUserProfile from '../hooks/useGetUserProfile';

function UserPage() {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();
  const [isFetchingPost, setIsFetchingPost] = useState();
  const showToast = useShowToast();

  const { user, isLoading } = getUserProfile();
  useEffect(() => {
    const fetchUserPost = async () => {
      if (!user) return;
      try {
        setIsFetchingPost(true);
        const res = await fetch(`/api/posts/user/${username}`, {
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
        setIsFetchingPost(false);
      } catch (error) {
        console.log(error.message);
        showToast('Error', error.message, 'error');
      } finally {
        setIsFetchingPost(false);
      }
    };

    fetchUserPost();
  }, [username, showToast]);

  if (isLoading)
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    );
  if (!user) return <NotFoundPage />;

  return (
    <>
      {user && <UserHeader user={user} />}
      {!isFetchingPost && posts.length == 0 && (
        <Flex justifyContent={'center'}>
          {' '}
          <h1>User has not posted anything</h1>
        </Flex>
      )}
      {isFetchingPost && (
        <Flex justifyContent={'center'}>
          <Spinner size={'xl'}></Spinner>
        </Flex>
      )}

      {posts.map((post) => {
        return <Post key={post._id} post={post} />;
      })}
    </>
  );
}

export default UserPage;
