import { useState } from 'react';
import useShowToast from './useShowToast';

import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
const useHandleFollowUnFollow = (user) => {
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(user?.followers.includes(currentUser?._id));
  const [isFlwBtnLoading, SetIsFlwBtnLoading] = useState();

  const showToast = useShowToast();

  const handelFollowUnFollow = async () => {
    if (!currentUser) {
      showToast('Error', 'You must be logged in', 'error');
      return;
    }
    if (isFlwBtnLoading) return;
    SetIsFlwBtnLoading(true);
    const res = await fetch(`/api/users/follow/${user?._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (data.error) {
      showToast('Error', data.error, 'error');
    }

    if (following) {
      showToast('UnFollowed', data.message, 'info');
      user?.followers.pop();
    }
    if (!following) {
      showToast('Followed', data.message, 'info');

      user?.followers.push(currentUser?._id);
    }

    setFollowing(!following);
    SetIsFlwBtnLoading(false);
  };

  return { following, isFlwBtnLoading, handelFollowUnFollow };
};

export default useHandleFollowUnFollow;
