import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../config/Axios'; // Your axios configuration

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        // Get token before clearing localStorage
        const token = localStorage.getItem('token');
        if (token) {
          await instance.post('/logout');
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        navigate('/login', { replace: true });
      } catch (error) {
        console.error('Logout error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        navigate('/login', { replace: true });
      }
    };
    logout();
  }, [navigate]);

  return null;
};

export default Logout;
