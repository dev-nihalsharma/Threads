import { Box, Container, Flex } from '@chakra-ui/react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
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
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();
  return (
    <Box position={'relative'} w={'full'}>
      <Container maxW={pathname !== '/' ? '720px' : '950px'}>
        <Header />
        <Routes>
          <Route
            path='/'
            element={
              user ? (
                <>
                  <HomePage /> <CreatePost />{' '}
                </>
              ) : (
                <Navigate to={'/auth'} />
              )
            }
          />
          <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to={'/'} />} />
          <Route path='/edit-profile' element={<UpdateProfilePage />} />
          <Route
            path='/:username'
            element={
              user ? (
                <>
                  <UserPage /> <CreatePost />{' '}
                </>
              ) : (
                <UserPage />
              )
            }
          />
          <Route path='/:username/post/:postId' element={<PostPage />} />
          <Route path='/chat' element={user ? <ChatPage /> : <Navigate to={'/auth'} />} />
          <Route path='/settings' element={user ? <SettingsPage /> : <Navigate to={'/auth'} />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
