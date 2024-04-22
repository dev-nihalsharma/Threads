import { Box, Button, Flex, Image, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { RxAvatar } from 'react-icons/rx';
import { AiFillHome } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom.js';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { MdOutlineSettings } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import useLogout from '../hooks/useLogout.js';

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();

  return (
    <Flex alignItems={'center'} justifyContent={user ? 'space-between' : 'center'} mt={6} mb={12}>
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
        <Flex alignItems={'center'} gap={4}>
          <NavLink to={`/${user.username}`}>
            <RxAvatar size={24} />
          </NavLink>
          <NavLink to={`/chat`}>
            <BsFillChatDotsFill size={20} />
          </NavLink>
          <NavLink to={`/settings`}>
            <MdOutlineSettings size={20} />
          </NavLink>
          <Button onClick={logout} size={'xs'}>
            <FiLogOut />
          </Button>
        </Flex>
      )}
    </Flex>
  );
}

export default Header;
