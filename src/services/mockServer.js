const STORE_KEY = 'truckhisab_admin_store';

const defaultStore = {
  users: [
    { id: 1, name: 'Admin User', username: 'admin', email: 'admin@example.com', enabled: true },
  ],
  trucks: [{ id: 1, name: 'Truck-100', number: 'GJ01AB1001', enabled: true }],
  locations: [{ id: 1, name: 'Ahmedabad', state: 'Gujarat', enabled: true }],
  entries: [
    {
      id: 1,
      truckId: 'Truck-100',
      locationId: 'Ahmedabad',
      loadType: 'Steel',
      enabled: true,
      date: new Date().toISOString().slice(0, 10),
    },
  ],
  history: [
    {
      id: 1,
      action: 'Seed Data Created',
      item: 'System',
      date: new Date().toISOString(),
      enabled: true,
    },
  ],
  profile: {
    username: 'admin',
    fullName: 'Admin User',
    email: 'admin@example.com',
    mobile: '9999999999',
  },
};

function getStore() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) return structuredClone(defaultStore);
  try {
    return JSON.parse(raw);
  } catch {
    return structuredClone(defaultStore);
  }
}

function saveStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function upsertRecord(collection, payload) {
  if (payload.id) {
    return collection.map((item) => (item.id === payload.id ? { ...item, ...payload } : item));
  }
  const nextId = collection.length ? Math.max(...collection.map((x) => Number(x.id))) + 1 : 1;
  return [...collection, { ...payload, id: nextId, enabled: payload.enabled ?? true }];
}

export async function handleMockPost(endpoint, payload) {
  await new Promise((resolve) => setTimeout(resolve, 120));
  const store = getStore();

  if (endpoint === '/auth/login') {
    if (payload.username && payload.password) {
      return { token: 'mock-token', user: { username: payload.username } };
    }
    throw new Error('Invalid credentials');
  }

  if (endpoint === '/auth/forgot-password') {
    return { message: `Reset link sent to ${payload.username || payload.email}` };
  }

  if (endpoint === '/profile/get') return store.profile;

  if (endpoint === '/profile/update') {
    const profile = { ...store.profile, ...payload };
    saveStore({ ...store, profile });
    return profile;
  }

  const entityMap = {
    '/users/list': 'users',
    '/trucks/list': 'trucks',
    '/locations/list': 'locations',
    '/entries/list': 'entries',
    '/history/list': 'history',
  };

  const createMap = {
    '/users/save': 'users',
    '/trucks/save': 'trucks',
    '/locations/save': 'locations',
    '/entries/save': 'entries',
    '/history/save': 'history',
  };

  const deleteMap = {
    '/users/delete': 'users',
    '/trucks/delete': 'trucks',
    '/locations/delete': 'locations',
    '/entries/delete': 'entries',
    '/history/delete': 'history',
  };

  const toggleMap = {
    '/users/toggle': 'users',
    '/trucks/toggle': 'trucks',
    '/locations/toggle': 'locations',
    '/entries/toggle': 'entries',
    '/history/toggle': 'history',
  };

  if (entityMap[endpoint]) {
    return store[entityMap[endpoint]];
  }

  if (createMap[endpoint]) {
    const key = createMap[endpoint];
    const updated = upsertRecord(store[key], payload);
    saveStore({ ...store, [key]: updated });
    return updated;
  }

  if (deleteMap[endpoint]) {
    const key = deleteMap[endpoint];
    const updated = store[key].filter((item) => item.id !== payload.id);
    saveStore({ ...store, [key]: updated });
    return updated;
  }

  if (toggleMap[endpoint]) {
    const key = toggleMap[endpoint];
    const updated = store[key].map((item) =>
      item.id === payload.id ? { ...item, enabled: !item.enabled } : item
    );
    saveStore({ ...store, [key]: updated });
    return updated;
  }

  throw new Error(`Unknown mock endpoint: ${endpoint}`);
}
