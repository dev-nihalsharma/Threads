import { Avatar, Divider, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

function Comment({ reply, isLastReply }) {
  return (
    <div>
      <Flex gap={4} py={2} my={2} w={'full'}>
        <Avatar size={'sm'} src={reply.userProfilePic} />
        <Flex w={'full'} gap={1} flexDirection={'column'}>
          <Flex
            w={'full'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Text fontSize={'sm'} fontWeight={'bold'}>
              {reply.username}
            </Text>
          </Flex>

          <Text>{reply.text}</Text>
        </Flex>
      </Flex>
      {!isLastReply ? <Divider /> : null}
    </div>
  );
}

export default Comment;
