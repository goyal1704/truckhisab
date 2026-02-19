import { useMemo, useState } from 'react';

const emptyValue = (fields) => fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {});

const getFieldError = (field, value) => {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return `${field.label} is required`;

  if (field.key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return 'Please enter a valid email';
  }

  if (field.key === 'number' && !/^[A-Za-z0-9-]{6,15}$/.test(trimmed)) {
    return 'Truck number must be 6-15 letters/numbers';
  }

  return '';
};

export default function EntityPage({ title, fields, items, onSave, onDelete, onToggle }) {
  const [draft, setDraft] = useState(emptyValue(fields));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const tableColumns = useMemo(() => ['id', ...fields.map((f) => f.key), 'enabled'], [fields]);

  const openAddModal = () => {
    setDraft(emptyValue(fields));
    setErrors({});
    setSubmitError('');
    setIsModalOpen(true);
  };

  const validateDraft = () => {
    const nextErrors = {};
    fields.forEach((field) => {
      const fieldError = getFieldError(field, draft[field.key]);
      if (fieldError) nextErrors[field.key] = fieldError;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    if (!validateDraft()) return;

    try {
      await onSave(draft);
      setDraft(emptyValue(fields));
      setErrors({});
      setIsModalOpen(false);
    } catch (error) {
      setSubmitError(error.message || 'Unable to save data');
    }
  };

  const handleEdit = (item) => {
    setDraft(item);
    setErrors({});
    setSubmitError('');
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
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      setDraft({ ...draft, [field.key]: nextValue });
                      const fieldError = getFieldError(field, nextValue);
                      setErrors((prev) => ({ ...prev, [field.key]: fieldError }));
                    }}
                  />
                  {errors[field.key] && <span className="field-error">{errors[field.key]}</span>}
                </label>
              ))}
              {submitError && <p className="form-error">{submitError}</p>}
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
