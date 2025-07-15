import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import TodoList from './TodoList';
import Logout from './Logout';
import './theme.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <>
      {/* Hareketli bloblar */}
      <div className="bg-blob bg-blob1"></div>
      <div className="bg-blob bg-blob2"></div>
      <div className="bg-blob bg-blob3"></div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/todos"
            element={isAuthenticated ? <TodoList /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/todos" : "/login"} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
