import { createContext, useContext, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const user = useRecoilValue(userAtom);
  const [onlineUsers, setOnlineUsers] = useState();

  useEffect(() => {
    const socket = io('/', {
      query: {
        userId: user?._id,
      },
    });

    socket.on('getOnlineUsers', (users) => {
      setOnlineUsers(users);
    });

    setSocket(socket);

    return () => socket && socket.close();
  }, [user?._id]);

  return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
