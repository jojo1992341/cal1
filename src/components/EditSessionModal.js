import React, { useState } from 'react';

function EditSessionModal({ session, onSave, onClose }) {
  const [weight, setWeight] = useState(session.weight);
  const [age, setAge] = useState(session.age);
  const [sex, setSex] = useState(session.sex);
  const [duration, setDuration] = useState(session.duration);
  const [resistance, setResistance] = useState(session.resistance);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weight || !age || !duration) {
      setError('Merci de remplir tous les champs obligatoires.');
      return;
    }
    setError('');
    onSave({
      ...session,
      weight: Number(weight),
      age: Number(age),
      sex,
      duration: Number(duration),
      resistance: Number(resistance)
    });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <form onSubmit={handleSubmit} style={{ background: 'var(--bg-color)', borderRadius: 10, boxShadow: '0 2px 16px #0002', padding: '2rem', minWidth: 320, color: 'var(--text)' }}>
        <h3>Modifier la séance</h3>
        <label htmlFor="edit-weight">Poids (kg)
          <input id="edit-weight" type="number" min="30" max="200" required value={weight} onChange={e => setWeight(e.target.value)} />
        </label><br />
        <label htmlFor="edit-age">Âge
          <input id="edit-age" type="number" min="10" max="100" required value={age} onChange={e => setAge(e.target.value)} />
        </label><br />
        <label htmlFor="edit-sex">Sexe
          <select id="edit-sex" value={sex} onChange={e => setSex(e.target.value)}>
            <option value="H">Homme</option>
            <option value="F">Femme</option>
            <option value="A">Autre</option>
          </select>
        </label><br />
        <label htmlFor="edit-duration">Durée (minutes)
          <input id="edit-duration" type="number" min="1" max="180" required value={duration} onChange={e => setDuration(e.target.value)} />
        </label><br />
        <label htmlFor="edit-resistance">Résistance
          <input id="edit-resistance" type="range" min="1" max="10" value={resistance} onChange={e => setResistance(e.target.value)} />
          <span style={{ marginLeft: 10 }}>{resistance}</span>
        </label><br />
        {error && <div style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: 14 }}>{error}</div>}
        <div style={{ marginTop: '1rem', display: 'flex', gap: 12 }}>
          <button type="submit" style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>Enregistrer</button>
          <button type="button" onClick={onClose} style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

export default EditSessionModal;
