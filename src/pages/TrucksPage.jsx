import EntityPage from '../components/EntityPage';

export default function TrucksPage({ items, onSave, onDelete, onToggle }) {
  return (
    <EntityPage
      title="Truck"
      fields={[
        { key: 'name', label: 'Truck Name' },
        { key: 'number', label: 'Truck Number' },
      ]}
      items={items}
      onSave={onSave}
      onDelete={onDelete}
      onToggle={onToggle}
    />
  );
}
