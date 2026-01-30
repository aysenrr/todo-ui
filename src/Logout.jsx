import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('token');
    // Dispatch custom event to notify App component of auth change
    window.dispatchEvent(new CustomEvent('authChange'));
    navigate('/login');
  }, [navigate]);
  return null;
}

export default Logout; 