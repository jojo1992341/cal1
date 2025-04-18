// Chart for displaying user's progress history
import React, { useState } from 'react';

// Helper to compute rolling average
function rollingAverage(data, window = 3) {
  if (data.length === 0) return [];
  const avg = [];
  for (let i = 0; i < data.length; i++) {
    const from = Math.max(0, i - window + 1);
    const slice = data.slice(from, i + 1);
    avg.push(slice.reduce((sum, d) => sum + d.calories, 0) / slice.length);
  }
  return avg;
}

const LEGEND = [
  { key: 'calories', color: '#007bff', label: 'Calories/séance' },
  { key: 'average', color: '#ff9800', label: 'Moyenne mobile' },
  { key: 'total', color: '#28a745', label: 'Total cumulé' },
];

function HistoryChart({ data, showAverage = false, showTotal = false, onLegendClick }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  if (!data || data.length === 0) return null;

  // Chart setup
  const width = 380, height = 160, padding = 38;
  const calories = data.map(d => d.calories);
  const maxCalories = Math.max(...calories);
  const minCalories = Math.min(...calories);
  const avgData = rollingAverage(data, 3);
  const maxAvg = Math.max(...avgData);
  const minAvg = Math.min(...avgData);
  let total = 0;
  const totalData = data.map(d => (total += d.calories));
  const maxTotal = Math.max(...totalData);
  const yTicks = 4;
  const xTicks = Math.min(data.length, 8);

  // Polyline helpers
  const points = calories.map((c, i) => {
    const x = padding + (i * (width - 2 * padding)) / (data.length - 1 || 1);
    const y = height - padding - ((c - minCalories) * (height - 2 * padding)) / ((maxCalories - minCalories) || 1);
    return `${x},${y}`;
  });
  const avgPoints = avgData.map((c, i) => {
    const x = padding + (i * (width - 2 * padding)) / (data.length - 1 || 1);
    const y = height - padding - ((c - minAvg) * (height - 2 * padding)) / ((maxAvg - minAvg) || 1);
    return `${x},${y}`;
  });
  const totalPoints = totalData.map((c, i) => {
    const x = padding + (i * (width - 2 * padding)) / (data.length - 1 || 1);
    const y = height - padding - ((c) * (height - 2 * padding)) / (maxTotal || 1);
    return `${x},${y}`;
  });

  // Colors
  const color = showTotal ? '#28a745' : showAverage ? '#ff9800' : '#007bff';
  const areaColor = showTotal ? 'rgba(40,167,69,0.10)' : showAverage ? 'rgba(255,152,0,0.10)' : 'rgba(0,123,255,0.10)';

  // Area under curve
  const areaPoints = (showTotal ? totalPoints : showAverage ? avgPoints : points)
    .map(p => p.split(',').map(Number))
    .map(([x, y]) => `${x},${y}`)
    .join(' ');
  const areaPolygon = `${areaPoints} ${padding + (data.length-1)*(width-2*padding)/(data.length-1||1)},${height-padding} ${padding},${height-padding}`;

  // Y axis labels
  const yLabels = [];
  for (let i = 0; i <= yTicks; i++) {
    const val = showTotal
      ? Math.round((maxTotal * (yTicks - i)) / yTicks)
      : showAverage
      ? Math.round((maxAvg * (yTicks - i)) / yTicks)
      : Math.round((minCalories + (maxCalories - minCalories) * (yTicks - i) / yTicks));
    yLabels.push(val);
  }

  // X axis labels (dates)
  const xLabels = [];
  for (let i = 0; i < xTicks; i++) {
    const idx = Math.round(i * (data.length - 1) / (xTicks - 1 || 1));
    xLabels.push({
      x: padding + (idx * (width - 2 * padding)) / (data.length - 1 || 1),
      label: new Date(data[idx].date).toLocaleDateString('fr-FR', { month: '2-digit', day: '2-digit' })
    });
  }

  // Interactive legend state
  const legendItems = [
    { key: 'calories', active: !showAverage && !showTotal, color: '#007bff', label: 'Calories/séance' },
    { key: 'average', active: showAverage, color: '#ff9800', label: 'Moyenne mobile' },
    { key: 'total', active: showTotal, color: '#28a745', label: 'Total cumulé' },
  ];

  // Tooltip helpers
  let tooltip = null;
  if (hoverIdx !== null) {
    let value, label, x, y, date;
    if (showTotal) {
      value = totalData[hoverIdx];
      label = 'Total';
      x = padding + (hoverIdx * (width - 2 * padding)) / (data.length - 1 || 1);
      y = height - padding - ((value) * (height - 2 * padding)) / (maxTotal || 1);
    } else if (showAverage) {
      value = Math.round(avgData[hoverIdx]);
      label = 'Moyenne';
      x = padding + (hoverIdx * (width - 2 * padding)) / (data.length - 1 || 1);
      y = height - padding - ((value - minAvg) * (height - 2 * padding)) / ((maxAvg - minAvg) || 1);
    } else {
      value = calories[hoverIdx];
      label = 'Calories';
      x = padding + (hoverIdx * (width - 2 * padding)) / (data.length - 1 || 1);
      y = height - padding - ((value - minCalories) * (height - 2 * padding)) / ((maxCalories - minCalories) || 1);
    }
    date = new Date(data[hoverIdx].date).toLocaleDateString('fr-FR');
    tooltip = { x, y, value, label, date };
  }

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 440, margin: '0 auto' }}>
      {/* Interactive legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 2 }}>
        {legendItems.map(item => (
          <span
            key={item.key}
            onClick={() => onLegendClick && onLegendClick(item.key)}
            style={{
              cursor: 'pointer',
              color: item.active ? item.color : '#888',
              fontWeight: item.active ? 'bold' : 'normal',
              background: item.active ? item.color + '15' : 'transparent',
              borderRadius: 6,
              padding: '3px 12px',
              fontSize: 14,
              border: item.active ? `1.5px solid ${item.color}` : '1.5px solid transparent',
              transition: 'all 0.15s',
              userSelect: 'none',
            }}
            aria-label={item.label}
            tabIndex={0}
          >
            <svg width={12} height={12} style={{ marginRight: 5, verticalAlign: 'middle' }}>
              <circle cx={6} cy={6} r={5} fill={item.color} />
            </svg>
            {item.label}
          </span>
        ))}
      </div>
      <svg width={width} height={height} className="svg-theme" style={{ background: 'var(--nav-bg)', border: '1px solid #e5e5e5', margin: '1rem 0', width: '100%', maxWidth: 440, borderRadius: 12, boxShadow: '0 1px 8px #e7edf3', display: 'block' }}>
        {/* Axes */}
        <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="#bbb" strokeWidth="1.2" />
        <line x1={padding} y1={padding} x2={padding} y2={height-padding} stroke="#bbb" strokeWidth="1.2" />
        {/* Y ticks and labels */}
        {yLabels.map((val, i) => {
          const y = padding + ((height-2*padding) * i) / yTicks;
          return (
            <g key={i}>
              <line x1={padding-4} y1={y} x2={padding} y2={y} stroke="#bbb" />
              <text x={padding-8} y={y+4} fontSize="11" fill="#888" textAnchor="end">{val}</text>
            </g>
          );
        })}
        {/* X ticks and labels */}
        {xLabels.map(({x, label}, i) => (
          <g key={i}>
            <line x1={x} y1={height-padding} x2={x} y2={height-padding+4} stroke="#bbb" />
            <text x={x} y={height-padding+17} fontSize="11" fill="#888" textAnchor="middle">{label}</text>
          </g>
        ))}
        {/* Area under curve */}
        <polygon points={areaPolygon} fill={areaColor} />
        {/* Polyline */}
        {showTotal && (
          <polyline fill="none" stroke={color} strokeWidth="2.5" points={totalPoints.join(' ')} />
        )}
        {showAverage && (
          <polyline fill="none" stroke={color} strokeWidth="2.5" points={avgPoints.join(' ')} />
        )}
        {!showAverage && !showTotal && (
          <polyline fill="none" stroke={color} strokeWidth="2.5" points={points.join(' ')} />
        )}
        {/* Points + hover */}
        {(showTotal ? totalData : showAverage ? avgData : calories).map((c, i) => {
          const x = padding + (i * (width - 2 * padding)) / (data.length - 1 || 1);
          let y;
          if (showTotal) y = height - padding - ((c) * (height - 2 * padding)) / (maxTotal || 1);
          else if (showAverage) y = height - padding - ((c - minAvg) * (height - 2 * padding)) / ((maxAvg - minAvg) || 1);
          else y = height - padding - ((c - minCalories) * (height - 2 * padding)) / ((maxCalories - minCalories) || 1);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={hoverIdx === i ? 7 : 4}
              fill={color}
              stroke={hoverIdx === i ? '#222' : '#fff'}
              strokeWidth={hoverIdx === i ? 2 : 1.2}
              style={{ cursor: 'pointer', transition: 'all 0.13s' }}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              tabIndex={0}
              aria-label={`Séance ${i+1}`}
            />
          );
        })}
        {/* Labels */}
        <text x={padding} y={padding-14} fontSize="13" fill={color} fontWeight="bold">
          {showTotal ? 'Total cumulé (kcal)' : showAverage ? 'Moyenne mobile (kcal)' : 'Calories/séance'}
        </text>
        <text x={width-padding} y={height-padding+32} fontSize="12" fill="#555" textAnchor="end">Séances</text>
        {/* Tooltip value */}
        {tooltip && (
          <g>
            <rect
              x={tooltip.x - 48}
              y={tooltip.y - 44}
              width={96}
              height={38}
              rx={7}
              fill="#fff"
              stroke={color}
              strokeWidth={1.5}
              filter="url(#shadow)"
            />
            <text x={tooltip.x} y={tooltip.y - 28} fontSize="13" fill={color} textAnchor="middle" fontWeight="bold">
              {tooltip.value} kcal
            </text>
            <text x={tooltip.x} y={tooltip.y - 12} fontSize="12" fill="#444" textAnchor="middle">
              {tooltip.date}
            </text>
          </g>
        )}
        {/* SVG filter for shadow */}
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#bbb" floodOpacity="0.28" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export default HistoryChart;
