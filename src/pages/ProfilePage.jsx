import { useEffect, useState } from 'react';

export default function ProfilePage({ loadProfile, saveProfile }) {
  const [profile, setProfile] = useState({ username: '', fullName: '', email: '', mobile: '' });

  useEffect(() => {
    loadProfile().then(setProfile);
  }, [loadProfile]);

  return (
    <div className="card">
      <h2>Profile</h2>
      <form
        className="entity-form"
        onSubmit={(e) => {
          e.preventDefault();
          saveProfile(profile);
        }}
      >
        {Object.keys(profile).map((key) => (
          <label key={key}>
            {key}
            <input value={profile[key]} onChange={(e) => setProfile({ ...profile, [key]: e.target.value })} />
          </label>
        ))}
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}
