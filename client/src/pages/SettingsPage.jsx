import { Button, Text } from '@chakra-ui/react';
import React from 'react';
import useShowToast from '../hooks/useShowToast';
import useLogout from '../hooks/useLogout';

const SettingsPage = () => {
  const showToast = useShowToast();
  const logout = useLogout();

  const freezeAccount = async () => {
    if (!window.confirm('Are you sure you want to freeze your account?')) return;
    try {
      const res = await fetch('/api/users/freeze', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();

      if (data.error) {
        showToast('Error', data.error, 'error');
        return;
      }

      showToast('Success', data.message, 'success');
      await logout();
    } catch (error) {
      showToast({ status: 'error', title: error.message });
    }
  };
  return (
    <div>
      <Text fontWeight={'bold'}>Freeze Your Account</Text>
      <Text>You can unfreeze your account anytime by logging in</Text>

      <Button mt={2} size={'sm'} colorScheme='red' onClick={freezeAccount}>
        Freeze
      </Button>
    </div>
  );
};

export default SettingsPage;
