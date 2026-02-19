import EntityPage from '../components/EntityPage';

export default function HistoryPage({ items, onSave, onDelete, onToggle }) {
  return (
    <EntityPage
      title="History"
      fields={[
        { key: 'action', label: 'Action' },
        { key: 'item', label: 'Item' },
        { key: 'date', label: 'Date/Time' },
      ]}
      items={items}
      onSave={onSave}
      onDelete={onDelete}
      onToggle={onToggle}
    />
  );
}
