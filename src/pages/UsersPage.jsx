import EntityPage from '../components/EntityPage';

export default function UsersPage({ items, onSave, onDelete, onToggle }) {
  return (
    <EntityPage
      title="User"
      fields={[
        { key: 'name', label: 'Name' },
        { key: 'username', label: 'Username' },
        { key: 'email', label: 'Email' },
      ]}
      items={items}
      onSave={onSave}
      onDelete={onDelete}
      onToggle={onToggle}
    />
  );
}
