import { Avatar, Button, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import useHandleFollowUnFollow from '../hooks/useHandleFollowUnFollow';

export const SuggestedUser = ({ user }) => {
  const { following, isFlwBtnLoading, handelFollowUnFollow } = useHandleFollowUnFollow(user);
  return (
    <Flex gap={2} justifyContent={'space-between'} alignItems={'center'}>
      <Flex as={Link} to={`/${user.username}`} gap={2}>
        <Avatar size={'md'} src={user.profilePic} />
        <Flex direction={'column'}>
          <Text fontWeight={600}>{user.username}</Text>
          <Text>{user.name}</Text>
        </Flex>
      </Flex>

      <Button
        size={'sm'}
        color={following ? 'black' : 'white'}
        bg={following ? 'white' : 'blue.400'}
        onClick={handelFollowUnFollow}
        isLoading={isFlwBtnLoading}
        _hover={{
          color: following ? 'black' : 'white',
          opacity: '.8',
        }}
      >
        {following ? 'UnFollow' : 'Follow'}
      </Button>
    </Flex>
  );
};
