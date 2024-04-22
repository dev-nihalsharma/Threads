import { useEffect, useState } from 'react';
import useShowToast from './useShowToast';
import { useParams } from 'react-router-dom';

const getUserProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/users/profile/${username}`, {
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
        if (data.isFrozen) {
          setUser(null);
          return;
        }

        setUser(data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

  return { user, isLoading };
};

export default getUserProfile;
