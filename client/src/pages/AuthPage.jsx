import react from 'react';
import { useRecoilValue } from 'recoil';
import SignupCard from '../components/SignupCard';
import LoginCard from '../components/LoginCard';
import authScreenAtom from '../atoms/authAtom.js';

function AuthPage() {
  const authScreenState = useRecoilValue(authScreenAtom);

  return (
    <div>{authScreenState === 'login' ? <LoginCard /> : <SignupCard />}</div>
  );
}

export default AuthPage;
