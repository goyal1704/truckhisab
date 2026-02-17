import { useMemo, useState } from 'react';

const emptyValue = (fields) => fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {});

export default function EntityPage({ title, fields, items, onSave, onDelete, onToggle }) {
  const [draft, setDraft] = useState(emptyValue(fields));

  const tableColumns = useMemo(() => ['id', ...fields.map((f) => f.key), 'enabled'], [fields]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(draft);
    setDraft(emptyValue(fields));
  };

  const handleEdit = (item) => setDraft(item);

  return (
    <div className="card">
      <h2>{title}</h2>
      <form className="entity-form" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <label key={field.key}>
            {field.label}
            <input
              value={draft[field.key] || ''}
              onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
              required
            />
          </label>
        ))}
        <button type="submit">{draft.id ? 'Update' : 'Add'}</button>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {tableColumns.map((col) => (
                <th key={col}>{col}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                {tableColumns.map((col) => (
                  <td key={`${item.id}-${col}`}>{String(item[col])}</td>
                ))}
                <td>
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button onClick={() => onDelete(item.id)}>Delete</button>
                  <button onClick={() => onToggle(item.id)}>{item.enabled ? 'Disable' : 'Enable'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
