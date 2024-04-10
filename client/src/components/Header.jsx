import { Flex, Image, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { RxAvatar } from 'react-icons/rx';
import { AiFillHome } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom.js';

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);

  return (
    <Flex justifyContent={'space-between'} mt={6} mb={12}>
      {user && (
        <NavLink to={'/'}>
          <AiFillHome size={24} />
        </NavLink>
      )}
      <Image
        cursor={'pointer'}
        alt='logo'
        w={6}
        src={colorMode == 'dark' ? '/light-logo.svg' : '/dark-logo.svg'}
        onClick={toggleColorMode}
      />

      {user && (
        <NavLink to={`/${user.username}`}>
          <RxAvatar size={24} />
        </NavLink>
      )}
    </Flex>
  );
}

export default Header;
