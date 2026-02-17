export default function Layout({
  currentPage,
  setCurrentPage,
  onLogout,
  username,
  children,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  const items = ['dashboard', 'users', 'trucks', 'locations', 'entries', 'history', 'profile'];

  const onSelectPage = (item) => {
    setCurrentPage(item);
    setMobileMenuOpen(false);
  };

  return (
    <div className="shell">
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <h2>TruckHisab</h2>
        <nav>
          {items.map((item) => (
            <button
              key={item}
              className={currentPage === item ? 'active' : ''}
              onClick={() => onSelectPage(item)}
            >
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </nav>
      </aside>

      {mobileMenuOpen && <button className="backdrop" onClick={() => setMobileMenuOpen(false)} />}

      <main>
        <header className="header">
          <button className="menu-btn" onClick={() => setMobileMenuOpen((prev) => !prev)}>
            ☰
          </button>
          <div className="header-right">
            <span>{username}</span>
            <button onClick={onLogout}>Logout</button>
          </div>
        </header>
        <section>{children}</section>
      </main>
    </div>
  );
}
