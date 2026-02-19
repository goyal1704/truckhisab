import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthForm from './components/AuthForm';
import Layout from './components/Layout';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import TrucksPage from './pages/TrucksPage';
import LocationsPage from './pages/LocationsPage';
import EntriesPage from './pages/EntriesPage';
import HistoryPage from './pages/HistoryPage';
import { postApi } from './services/api';



export default function App() 
{
  const [authView, setAuthView] = useState('login');

  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem('truckhisab_session');
    return raw ? JSON.parse(raw) : null;
  });

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPage]);

  if (!session) {
    return (
      <div className="auth-shell">
        {toast && <div className="toast">{toast}</div>}
        <AuthForm type={authView} onSubmit={login} onSwitch={() => setAuthView((prev) => (prev === 'login' ? 'forgot' : 'login'))}/>
      </div>
    );
  }

  return (
    <>
      {toast && <div className="toast">{toast}</div>}
      <Layout
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isMobileMenuOpen={isMobileMenuOpen}
        onMenu={() => setIsMobileMenuOpen((prev) => !prev)}
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

        {currentPage === 'users' && (
          <UsersPage
            items={data.users}
            onSave={(record) => saveEntity('users', record)}
            onDelete={(id) => deleteEntity('users', id)}
            onToggle={(id) => toggleEntity('users', id)}
          />
        )}

        {currentPage === 'trucks' && (
          <TrucksPage
            items={data.trucks}
            onSave={(record) => saveEntity('trucks', record)}
            onDelete={(id) => deleteEntity('trucks', id)}
            onToggle={(id) => toggleEntity('trucks', id)}
          />
        )}

        {currentPage === 'locations' && (
          <LocationsPage
            items={data.locations}
            onSave={(record) => saveEntity('locations', record)}
            onDelete={(id) => deleteEntity('locations', id)}
            onToggle={(id) => toggleEntity('locations', id)}
          />
        )}

        {currentPage === 'entries' && (
          <EntriesPage
            items={data.entries}
            onSave={(record) => saveEntity('entries', record)}
            onDelete={(id) => deleteEntity('entries', id)}
            onToggle={(id) => toggleEntity('entries', id)}
          />
        )}

        {currentPage === 'history' && (
          <HistoryPage
            items={data.history}
            onSave={(record) => saveEntity('history', record)}
            onDelete={(id) => deleteEntity('history', id)}
            onToggle={(id) => toggleEntity('history', id)}
          />
        )}

        {currentPage === 'profile' && <ProfilePage {...profileHandlers} />}
      </Layout>
    </>
  );
}
