import { Container } from '@chakra-ui/react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';
import CreatePost from './components/CreatePost';
import Header from './components/Header';
import LogoutButton from './components/LogoutButton';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import UpdateProfilePage from './pages/UpdateProfilePage';
import UserPage from './pages/UserPage';

function App() {
  const user = useRecoilValue(userAtom);
  return (
    <Container maxW='620px'>
      <Header />
      <Routes>
        <Route
          path='/'
          element={user ? <HomePage /> : <Navigate to={'/auth'} />}
        />
        <Route
          path='/auth'
          element={!user ? <AuthPage /> : <Navigate to={'/'} />}
        />
        <Route path='/edit-profile' element={<UpdateProfilePage />} />
        <Route path='/:username' element={<UserPage />} />
        <Route path='/:username/post/:postId' element={<PostPage />} />
      </Routes>
      {user && <LogoutButton />}
      {user && <CreatePost />}
    </Container>
  );
}

export default App;
