import { useEffect, useState } from 'react';

const validateProfile = (profile) => {
  const nextErrors = {};

  if (!String(profile.username || '').trim()) nextErrors.username = 'Username is required';
  if (!String(profile.fullName || '').trim()) nextErrors.fullName = 'Full name is required';

  const email = String(profile.email || '').trim();
  if (!email) {
    nextErrors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    nextErrors.email = 'Please enter a valid email';
  }

  const mobile = String(profile.mobile || '').trim();
  if (!mobile) {
    nextErrors.mobile = 'Mobile is required';
  } else if (!/^\d{10}$/.test(mobile)) {
    nextErrors.mobile = 'Mobile must be 10 digits';
  }

  return nextErrors;
};

export default function ProfilePage({ loadProfile, saveProfile }) {
  const [profile, setProfile] = useState({ username: '', fullName: '', email: '', mobile: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    loadProfile().then((data) => {
      setProfile(data);
      setErrors({});
      setSubmitError('');
    });
  }, [loadProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const nextErrors = validateProfile(profile);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await saveProfile(profile);
    } catch (error) {
      setSubmitError(error.message || 'Unable to save profile');
    }
  };

  return (
    <div className="card">
      <h2>Profile</h2>
      <form className="entity-form" onSubmit={handleSubmit} noValidate>
        {Object.keys(profile).map((key) => (
          <label key={key}>
            {key}
            <input
              value={profile[key]}
              onChange={(e) => {
                const nextValue = e.target.value;
                setProfile({ ...profile, [key]: nextValue });
                if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
              }}
            />
            {errors[key] && <span className="field-error">{errors[key]}</span>}
          </label>
        ))}
        {submitError && <p className="form-error">{submitError}</p>}
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}
