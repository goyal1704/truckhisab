import { useMemo, useState } from 'react';

const emptyValue = (fields) => fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {});

export default function EntityPage({ title, fields, items, onSave, onDelete, onToggle }) {
  const [draft, setDraft] = useState(emptyValue(fields));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tableColumns = useMemo(() => ['id', ...fields.map((f) => f.key), 'enabled'], [fields]);

  const openAddModal = () => {
    setDraft(emptyValue(fields));
    setIsModalOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateDraft()) return;
    onSave(draft);
    setDraft(emptyValue(fields));
    setIsModalOpen(false);
  };

  const handleEdit = (item) => {
    setDraft(item);
    setIsModalOpen(true);
  };

  return (
    <div className="card">
      <div className="entity-header">
        <h2>{title}</h2>
        <button type="button" onClick={openAddModal}>Add</button>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h3>{draft.id ? 'Edit Record' : 'Add Record'}</h3>
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
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit">{draft.id ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <td key={`${item.id}-${col}`} data-label={col}>{String(item[col])}</td>
                ))}
                <td data-label="actions">
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
