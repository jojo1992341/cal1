// Utility: local storage management for sessions
export function saveSession(session) {
  const history = JSON.parse(localStorage.getItem('bikeHistory') || '[]');
  history.push(session);
  localStorage.setItem('bikeHistory', JSON.stringify(history));
}

export function loadHistory() {
  return JSON.parse(localStorage.getItem('bikeHistory') || '[]');
}
