import { atom } from 'recoil';

export const conversationsAtom = atom({
  key: 'conversationsAtom',
  default: [],
});

export const currentConversationAtom = atom({
  key: 'selectedConversationAtom',
  default: {
    _id: '',
    userId: '',
    username: '',
    userProfilePic: '',
  },
});
