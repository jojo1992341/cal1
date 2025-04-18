// Card to display calories burned result
import React from 'react';

function ResultCard({ calories }) {
  if (calories == null) return null;

  let message = '';
  if (calories < 100) message = "Séance courte, n'hésitez pas à augmenter la durée ou la résistance pour plus de résultats !";
  else if (calories < 250) message = "Bonne séance, continuez ainsi pour progresser !";
  else message = "Excellente dépense calorique, bravo pour votre engagement !";

  return (
    <div style={{
      margin: '2rem auto',
      padding: '1.5rem',
      background: '#f8fafd',
      border: '1px solid #dde4ec',
      borderRadius: 12,
      boxShadow: '0 2px 8px #e7edf3',
      maxWidth: 340,
      textAlign: 'center',
      color: '#234',
      fontSize: 18
    }}>
      <div style={{ fontWeight: 'bold', fontSize: 26, color: '#007bff' }}>{calories} kcal</div>
      <div style={{ marginTop: 8 }}>{message}</div>
    </div>
  );
}

export default ResultCard;
