import EntityPage from '../components/EntityPage';

export default function EntriesPage({ items, onSave, onDelete, onToggle }) {
  return (
    <EntityPage
      title="Entry"
      fields={[
        { key: 'truckId', label: 'Truck Name' },
        { key: 'locationId', label: 'Location' },
        { key: 'loadType', label: 'Load Type' },
        { key: 'date', label: 'Date' },
      ]}
      items={items}
      onSave={onSave}
      onDelete={onDelete}
      onToggle={onToggle}
    />
  );
}
