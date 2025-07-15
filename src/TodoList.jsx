import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // API helper
  const authFetch = (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {})
      }
    });
  };

  // Todo'ları getir
  const fetchTodos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch('http://localhost:8082/api/task');
      if (res.ok) {
        const data = await res.json();
        setTodos(data);
      } else {
        setError('Liste alınamadı!');
      }
    } catch {
      setError('Sunucu hatası!');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) navigate('/login');
    else fetchTodos();
    // eslint-disable-next-line
  }, []);

  // Todo ekle
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setError('');
    try {
      const res = await authFetch('http://localhost:8082/api/task', {
        method: 'POST',
        body: JSON.stringify({ title: newTask })
      });
      if (res.ok) {
        setNewTask('');
        fetchTodos();
      } else {
        setError('Ekleme başarısız!');
      }
    } catch {
      setError('Sunucu hatası!');
    }
  };

  // Todo sil
  const handleDelete = async (id) => {
    setError('');
    try {
      const res = await authFetch(`http://localhost:8082/api/task/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchTodos();
      else setError('Silme başarısız!');
    } catch {
      setError('Sunucu hatası!');
    }
  };

  // Todo güncelle
  const handleEdit = async (id) => {
    if (!editText.trim()) return;
    setError('');
    try {
      const res = await authFetch(`http://localhost:8082/api/task?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title: editText })
      });
      if (res.ok) {
        setEditId(null);
        setEditText('');
        fetchTodos();
      } else {
        setError('Güncelleme başarısız!');
      }
    } catch {
      setError('Sunucu hatası!');
    }
  };

  // Todo tamamla
  const handleToggleComplete = async (todo) => {
    setError('');
    try {
      const res = await authFetch(`http://localhost:8082/api/task?id=${todo.id}`, {
        method: 'PUT',
        body: JSON.stringify({ title: todo.title, completed: !todo.completed })
      });
      if (res.ok) {
        fetchTodos();
      } else {
        setError('Güncelleme başarısız!');
      }
    } catch {
      setError('Sunucu hatası!');
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-main-box">
        <div className="todo-header">
          <h2>Yapılacaklar</h2>
          <button className="logout-btn" onClick={() => navigate('/logout')}>Çıkış Yap</button>
        </div>
        <form className="todo-add-form" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Yeni görev..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
          />
          <button type="submit">Ekle</button>
        </form>
        {error && <div className="todo-error">{error}</div>}
        {loading ? (
          <div className="todo-loading">Yükleniyor...</div>
        ) : (
          <ul className="todo-list">
            {todos.length === 0 && <li>Henüz görev yok.</li>}
            {todos.map(todo => (
              <li key={todo.id} className={`todo-item${todo.completed ? ' completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo)}
                  className="todo-checkbox"
                />
                {editId === todo.id ? (
                  <>
                    <input
                      className="todo-edit-input"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                    />
                    <button className="todo-btn" onClick={() => handleEdit(todo.id)}>Kaydet</button>
                    <button className="todo-btn grey" onClick={() => { setEditId(null); setEditText(''); }}>İptal</button>
                  </>
                ) : (
                  <>
                    <span>{todo.title}</span>
                    <button className="todo-btn" onClick={() => { setEditId(todo.id); setEditText(todo.title); }}>Düzenle</button>
                    <button className="todo-btn grey" onClick={() => handleDelete(todo.id)}>Sil</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TodoList; 