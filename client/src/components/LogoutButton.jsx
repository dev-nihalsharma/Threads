import { Button, useToast } from '@chakra-ui/react';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { FiLogOut } from 'react-icons/fi';

const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom);
  const toast = useToast();
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        return;
      }

      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button pos={'fixed'} top={'20px'} right={'30px'} onClick={handleLogout}>
      <FiLogOut />
    </Button>
  );
};

export default LogoutButton;
