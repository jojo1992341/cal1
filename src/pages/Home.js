// Main homepage with form and result
import React, { useState } from 'react';
import UserForm from '../components/UserForm';
import ResultCard from '../components/ResultCard';
import { calculateCalories } from '../utils/calorieCalculator';
import { saveSession } from '../services/storage';

function Home() {
  const [result, setResult] = useState(null);

  const handleSubmit = (data) => {
    const calories = calculateCalories(data);
    setResult(calories);
    saveSession({ ...data, calories, date: new Date().toISOString() });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Calculateur de calories brûlées à vélo</h2>
      <UserForm onSubmit={handleSubmit} />
      <ResultCard calories={result} />
    </div>
  );
}

export default Home;
