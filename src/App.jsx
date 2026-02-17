import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthForm from './components/AuthForm';
import Layout from './components/Layout';
import EntityPage from './components/EntityPage';
import ProfilePage from './pages/ProfilePage';
import { postApi } from './services/api';

const entityConfig = {
  users: { title: 'User List', fields: [{ key: 'name', label: 'Name' }, { key: 'username', label: 'Username' }, { key: 'email', label: 'Email' }] },
  trucks: { title: 'Truck List', fields: [{ key: 'name', label: 'Truck Name' }, { key: 'number', label: 'Truck Number' }] },
  locations: { title: 'Location List', fields: [{ key: 'name', label: 'Location' }, { key: 'state', label: 'State' }] },
  entries: { title: 'Truck Entry', fields: [{ key: 'truckId', label: 'Truck Name' }, { key: 'locationId', label: 'Location' }, { key: 'loadType', label: 'Load Type' }, { key: 'date', label: 'Date' }] },
  history: { title: 'Truck Entry History', fields: [{ key: 'action', label: 'Action' }, { key: 'item', label: 'Item' }, { key: 'date', label: 'Date/Time' }] },
};

export default function App() {
  const [authView, setAuthView] = useState('login');
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem('truckhisab_session');
    return raw ? JSON.parse(raw) : null;
  });
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [data, setData] = useState({ users: [], trucks: [], locations: [], entries: [], history: [] });
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  };

  const loadEntity = useCallback(async (entity) => {
    const list = await postApi(`/${entity}/list`, {});
    setData((prev) => ({ ...prev, [entity]: list }));
  }, []);

  useEffect(() => {
    if (session) {
      ['users', 'trucks', 'locations', 'entries', 'history'].forEach(loadEntity);
    }
  }, [loadEntity, session]);

  const login = async (payload) => {
    if (authView === 'forgot') {
      const res = await postApi('/auth/forgot-password', payload);
      showToast(res.message || 'Reset link sent');
      return;
    }
    const res = await postApi('/auth/login', payload);
    const newSession = { token: res.token, username: res.user?.username || payload.username };
    localStorage.setItem('truckhisab_session', JSON.stringify(newSession));
    setSession(newSession);
  };

  const saveEntity = async (entity, record) => {
    const updated = await postApi(`/${entity}/save`, record);
    setData((prev) => ({ ...prev, [entity]: updated }));
    showToast(`${entity} saved`);
  };

  const deleteEntity = async (entity, id) => {
    const updated = await postApi(`/${entity}/delete`, { id });
    setData((prev) => ({ ...prev, [entity]: updated }));
    showToast(`${entity} deleted`);
  };

  const toggleEntity = async (entity, id) => {
    const updated = await postApi(`/${entity}/toggle`, { id });
    setData((prev) => ({ ...prev, [entity]: updated }));
    showToast(`${entity} status updated`);
  };

  const profileHandlers = useMemo(
    () => ({
      loadProfile: () => postApi('/profile/get', {}),
      saveProfile: (payload) => postApi('/profile/update', payload).then(() => showToast('Profile updated')),
    }),
    []
  );

  if (!session) {
    return (
      <div className="auth-shell">
        {toast && <div className="toast">{toast}</div>}
        <AuthForm
          type={authView}
          onSubmit={login}
          onSwitch={() => setAuthView((prev) => (prev === 'login' ? 'forgot' : 'login'))}
        />
      </div>
    );
  }

  return (
    <>
      {toast && <div className="toast">{toast}</div>}
      <Layout
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        username={session.username}
        onLogout={() => {
          localStorage.removeItem('truckhisab_session');
          setSession(null);
        }}
      >
        {currentPage === 'dashboard' && (
          <div className="card">
            <h2>Dashboard</h2>
            <div className="stats">
              <p>Users: {data.users.length}</p>
              <p>Trucks: {data.trucks.length}</p>
              <p>Locations: {data.locations.length}</p>
              <p>Entries: {data.entries.length}</p>
            </div>
          </div>
        )}

        {['users', 'trucks', 'locations', 'entries', 'history'].includes(currentPage) && (
          <EntityPage
            title={entityConfig[currentPage].title}
            fields={entityConfig[currentPage].fields}
            items={data[currentPage]}
            onSave={(record) => saveEntity(currentPage, record)}
            onDelete={(id) => deleteEntity(currentPage, id)}
            onToggle={(id) => toggleEntity(currentPage, id)}
          />
        )}

        {currentPage === 'profile' && <ProfilePage {...profileHandlers} />}
      </Layout>
    </>
  );
}
