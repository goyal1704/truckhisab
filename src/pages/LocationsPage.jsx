import EntityPage from '../components/EntityPage';

export default function LocationsPage({ items, onSave, onDelete, onToggle }) {
  return (
    <EntityPage
      title="Location"
      fields={[
        { key: 'name', label: 'Location' },
        { key: 'state', label: 'State' },
      ]}
      items={items}
      onSave={onSave}
      onDelete={onDelete}
      onToggle={onToggle}
    />
  );
}
