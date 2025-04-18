import React, { useState } from 'react';

function UserForm({ onSubmit }) {
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('H');
  const [duration, setDuration] = useState('');
  const [resistance, setResistance] = useState(5);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weight || !age || !duration) {
      setError('Merci de remplir tous les champs obligatoires.');
      return;
    }
    setError('');
    onSubmit({
      weight: Number(weight),
      age: Number(age),
      sex,
      duration: Number(duration),
      resistance: Number(resistance)
    });
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Formulaire de calcul de calories" style={{ maxWidth: 350, margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fff', borderRadius: 10, boxShadow: '0 1px 8px #e7edf3', padding: '1.5rem' }}>
      <label htmlFor="weight">Poids (kg)
        <input id="weight" type="number" min="30" max="200" required value={weight} onChange={e => setWeight(e.target.value)} aria-required="true" aria-label="Poids en kilogrammes" />
      </label>
      <label htmlFor="age">Âge
        <input id="age" type="number" min="10" max="100" required value={age} onChange={e => setAge(e.target.value)} aria-required="true" aria-label="Âge" />
      </label>
      <label htmlFor="sex">Sexe
        <select id="sex" value={sex} onChange={e => setSex(e.target.value)} aria-label="Sexe">
          <option value="H">Homme</option>
          <option value="F">Femme</option>
          <option value="A">Autre</option>
        </select>
      </label>
      <label htmlFor="duration">Durée (minutes)
        <input id="duration" type="number" min="1" max="180" required value={duration} onChange={e => setDuration(e.target.value)} aria-required="true" aria-label="Durée de l'exercice en minutes" />
      </label>
      <label htmlFor="resistance">Résistance
        <input id="resistance" type="range" min="1" max="10" value={resistance} onChange={e => setResistance(e.target.value)} aria-valuenow={resistance} aria-valuemin={1} aria-valuemax={10} />
        <span style={{ marginLeft: 10 }}>{resistance}</span>
      </label>
      {error && <div style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: 14 }}>{error}</div>}
      <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, padding: '0.7rem', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>
        Calculer
      </button>
    </form>
  );
}

export default UserForm;
