import { useEffect, useMemo, useState } from 'react';

const emptyValue = (fields) => fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {});

export default function EntityPage({ title, fields, items, onSave, onDelete, onToggle, entityLabel = 'Record' }) {
  const [draft, setDraft] = useState(emptyValue(fields));
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [confirmState, setConfirmState] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);

  useEffect(() => {
    if (!showFormModal) {
      setDraft(emptyValue(fields));
      setFormMode('add');
    }
  }, [fields, showFormModal]);

  useEffect(() => {
    const onEsc = (event) => {
      if (event.key === 'Escape') {
        setShowFormModal(false);
        setConfirmState(null);
        setActionMenuId(null);
      }
    };

    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const tableColumns = useMemo(() => ['id', ...fields.map((f) => f.key), 'enabled'], [fields]);

  const openAddModal = () => {
    setDraft(emptyValue(fields));
    setFormMode('add');
    setShowFormModal(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(draft);
    setShowFormModal(false);
  };

  const handleEdit = (item) => {
    setDraft(item);
    setFormMode('edit');
    setShowFormModal(true);
    setActionMenuId(null);
  };

  const openDeleteConfirm = (item) => {
    setConfirmState({
      type: 'delete',
      id: item.id,
      title: 'Delete record?',
      message: `Are you sure you want to delete ID ${item.id}?`,
    });
    setActionMenuId(null);
  };

  const openToggleConfirm = (item) => {
    const nextAction = item.enabled ? 'disable' : 'enable';
    setConfirmState({
      type: 'toggle',
      id: item.id,
      title: `${nextAction[0].toUpperCase() + nextAction.slice(1)} record?`,
      message: `Do you want to ${nextAction} ID ${item.id}?`,
    });
    setActionMenuId(null);
  };

  const handleConfirm = () => {
    if (!confirmState) return;

    if (confirmState.type === 'delete') {
      onDelete(confirmState.id);
    } else {
      onToggle(confirmState.id);
    }

    setConfirmState(null);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>{title}</h2>
        <button type="button" onClick={openAddModal}>Add {entityLabel}</button>
      </div>

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
                  <div className="action-menu-wrap">
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => setActionMenuId(actionMenuId === item.id ? null : item.id)}
                    >
                      ⋮
                    </button>
                    {actionMenuId === item.id && (
                      <div className="action-menu">
                        <button type="button" onClick={() => handleEdit(item)}>Edit</button>
                        <button type="button" onClick={() => openToggleConfirm(item)}>
                          {item.enabled ? 'Disable' : 'Enable'}
                        </button>
                        <button type="button" className="danger" onClick={() => openDeleteConfirm(item)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showFormModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setShowFormModal(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h3>{formMode === 'edit' ? `Edit ${entityLabel}` : `Add ${entityLabel}`}</h3>
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
                <button type="button" className="secondary" onClick={() => setShowFormModal(false)}>
                  Cancel
                </button>
                <button type="submit">{formMode === 'edit' ? `Update ${entityLabel}` : `Add ${entityLabel}`}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmState && (
        <div className="modal-overlay" role="alertdialog" aria-modal="true" onClick={() => setConfirmState(null)}>
          <div className="modal-card confirm-box" onClick={(event) => event.stopPropagation()}>
            <h3>{confirmState.title}</h3>
            <p>{confirmState.message}</p>
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setConfirmState(null)}>
                Cancel
              </button>
              <button type="button" className="danger" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
