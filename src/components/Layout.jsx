export default function Layout({
  currentPage,
  setCurrentPage,
  onLogout,
  username,
  children,
  onMenu,
  isMobileMenuOpen,
}) {
  const items = ['dashboard', 'users', 'trucks', 'locations', 'entries', 'history', 'profile'];

  return (
    <div className="shell">
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`} data-open={isMobileMenuOpen ? 'true' : 'false'}>
        <h2>TruckHisab</h2>
        <nav>
          {items.map((item) => (
            <button key={item} className={currentPage === item ? 'active' : ''} onClick={() => setCurrentPage(item)} >
                {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </nav>
      </aside>
      {isMobileMenuOpen && <button className="menu-overlay" aria-label="Close menu" onClick={onMenu} />}
      <main>
        
        <header className="header">
          <button className="menu-btn" onClick={onMenu}>{isMobileMenuOpen ? "✕" : "☰"}</button>
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
