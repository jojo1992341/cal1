import React, { useEffect, useState } from 'react';
import { loadHistory } from '../services/storage';
import HistoryChart from '../components/HistoryChart';
import EditSessionModal from '../components/EditSessionModal';
import { calculateCalories } from '../utils/calorieCalculator';

function History() {
  const [history, setHistory] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [chartType, setChartType] = useState('calories'); // 'calories', 'average', 'total'

  useEffect(() => {
    setHistory(loadHistory().sort((a, b) => new Date(a.date) - new Date(b.date)));
  }, []);

  // Effacer l'historique
  const handleClear = () => {
    localStorage.removeItem('bikeHistory');
    setHistory([]);
  };

  // Exporter l'historique en CSV
  const handleExport = () => {
    if (!history.length) return;
    const header = 'Date,Calories,Durée (min),Résistance,Poids,Âge,Sexe\n';
    const rows = history.map(s => `${new Date(s.date).toLocaleDateString()},${s.calories},${s.duration},${s.resistance},${s.weight},${s.age},${s.sex}`).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historique_velo.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Suppression individuelle d'une séance
  const handleDelete = (idx) => {
    if (!window.confirm('Supprimer cette séance ?')) return;
    const newHistory = history.filter((_, i) => i !== idx);
    localStorage.setItem('bikeHistory', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  // Sauvegarde de l'édition
  const handleEditSave = (session) => {
    const newHistory = [...history];
    // recalculer les calories avec les nouvelles données
    session.calories = calculateCalories(session);
    newHistory[editIdx] = session;
    localStorage.setItem('bikeHistory', JSON.stringify(newHistory));
    setHistory(newHistory);
    setEditIdx(null);
  };

  // Statistiques globales
  const totalCalories = history.reduce((sum, s) => sum + (s.calories || 0), 0);
  const totalSessions = history.length;
  const bestSession = history.reduce((best, s) => (!best || (s.calories || 0) > (best.calories || 0)) ? s : best, null);
  const avgCalories = totalSessions ? Math.round(totalCalories / totalSessions) : 0;
  const totalMinutes = history.reduce((sum, s) => sum + (s.duration || 0), 0);

  // UI/UX améliorée : regroupement par date, badges, meilleure lisibilité, feedback visuel
  const grouped = history.reduce((acc, s) => {
    const date = new Date(s.date).toLocaleDateString();
    acc[date] = acc[date] || [];
    acc[date].push(s);
    return acc;
  }, {});

  // Gestion du clic sur la légende interactive du graphique
  const handleLegendClick = (key) => {
    setChartType(key);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: 24 }}>Historique de vos séances</h2>
      {history.length > 0 && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center', marginBottom: 30 }}>
            <div style={{ background: 'var(--nav-bg)', borderRadius: 8, padding: '1rem 1.3rem', minWidth: 160, textAlign: 'center', boxShadow: '0 1px 8px #e7edf3' }}>
              <div style={{ fontSize: 15, color: '#888' }}>Total calories</div>
              <div style={{ fontWeight: 'bold', fontSize: 23, color: '#007bff' }}>{totalCalories} kcal</div>
            </div>
            <div style={{ background: 'var(--nav-bg)', borderRadius: 8, padding: '1rem 1.3rem', minWidth: 160, textAlign: 'center', boxShadow: '0 1px 8px #e7edf3' }}>
              <div style={{ fontSize: 15, color: '#888' }}>Nombre de séances</div>
              <div style={{ fontWeight: 'bold', fontSize: 23, color: '#007bff' }}>{totalSessions}</div>
            </div>
            <div style={{ background: 'var(--nav-bg)', borderRadius: 8, padding: '1rem 1.3rem', minWidth: 160, textAlign: 'center', boxShadow: '0 1px 8px #e7edf3' }}>
              <div style={{ fontSize: 15, color: '#888' }}>Durée totale</div>
              <div style={{ fontWeight: 'bold', fontSize: 23, color: '#007bff' }}>{totalMinutes} min</div>
            </div>
            <div style={{ background: 'var(--nav-bg)', borderRadius: 8, padding: '1rem 1.3rem', minWidth: 160, textAlign: 'center', boxShadow: '0 1px 8px #e7edf3' }}>
              <div style={{ fontSize: 15, color: '#888' }}>Moyenne/séance</div>
              <div style={{ fontWeight: 'bold', fontSize: 23, color: '#007bff' }}>{avgCalories} kcal</div>
            </div>
            {bestSession && (
              <div style={{ background: 'var(--nav-bg)', borderRadius: 8, padding: '1rem 1.3rem', minWidth: 160, textAlign: 'center', boxShadow: '0 1px 8px #e7edf3' }}>
                <div style={{ fontSize: 15, color: '#888' }}>Meilleure séance</div>
                <div style={{ fontWeight: 'bold', fontSize: 23, color: '#28a745' }}>{bestSession.calories} kcal</div>
                <div style={{ fontSize: 13, color: '#333', marginTop: 2 }}>{bestSession.duration} min, résistance {bestSession.resistance}</div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
            <button
              onClick={() => setChartType('calories')}
              style={{ background: chartType === 'calories' ? 'var(--primary)' : '#e0e0e0', color: chartType === 'calories' ? '#fff' : '#234', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer' }}
            >Calories/séance</button>
            <button
              onClick={() => setChartType('average')}
              style={{ background: chartType === 'average' ? 'var(--primary)' : '#e0e0e0', color: chartType === 'average' ? '#fff' : '#234', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer' }}
            >Moyenne mobile</button>
            <button
              onClick={() => setChartType('total')}
              style={{ background: chartType === 'total' ? 'var(--primary)' : '#e0e0e0', color: chartType === 'total' ? '#fff' : '#234', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer' }}
            >Total cumulé</button>
          </div>
          <HistoryChart
            data={history}
            showAverage={chartType === 'average'}
            showTotal={chartType === 'total'}
            onLegendClick={handleLegendClick}
          />
        </>
      )}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button onClick={handleClear} disabled={!history.length} style={{ background: '#e0e0e0', color: '#234', border: 'none', borderRadius: 6, padding: '0.6rem 1.2rem', fontWeight: 'bold', fontSize: 15, cursor: history.length ? 'pointer' : 'not-allowed' }}>Effacer l'historique</button>
        <button onClick={handleExport} disabled={!history.length} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '0.6rem 1.2rem', fontWeight: 'bold', fontSize: 15, cursor: history.length ? 'pointer' : 'not-allowed' }}>Exporter en CSV</button>
      </div>
      {history.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', marginTop: 60, fontSize: 18 }}>
          <span role="img" aria-label="Aucune séance">🚲</span> <br />
          Aucune séance enregistrée pour le moment.
        </div>
      ) : (
        <>
          <div className="history-list" style={{ marginTop: '2rem', background: 'var(--nav-bg)', borderRadius: 10, boxShadow: '0 1px 8px #e7edf3', padding: '1.5rem' }}>
            {Object.entries(grouped).map(([date, sessions]) => (
              <div key={date} style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: 17, marginBottom: 6 }}>{date}</div>
                <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                  {sessions.map((session, idx) => (
                    <li key={session.date + '-' + idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                      <span>
                        <span style={{ fontWeight: 'bold', fontSize: 17, color: '#007bff' }}>{session.calories} kcal</span> — {session.duration} min, résistance {session.resistance}, poids {session.weight} kg
                        <span style={{ marginLeft: 6, fontSize: 13, color: '#888' }}>({session.sex === 'H' ? 'Homme' : session.sex === 'F' ? 'Femme' : 'Autre'}, {session.age} ans)</span>
                      </span>
                      <span>
                        <button
                          aria-label={`Modifier la séance du ${date}`}
                          onClick={() => setEditIdx(history.indexOf(session))}
                          style={{ marginLeft: 10, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 5, padding: '0.3rem 0.7rem', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          Modifier
                        </button>
                        <button
                          aria-label={`Supprimer la séance du ${date}`}
                          onClick={() => handleDelete(history.indexOf(session))}
                          style={{ marginLeft: 10, background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 5, padding: '0.3rem 0.7rem', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          Supprimer
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
      {editIdx !== null && (
        <EditSessionModal
          session={history[editIdx]}
          onSave={handleEditSave}
          onClose={() => setEditIdx(null)}
        />
      )}
    </div>
  );
}

export default History;
