import "./UsageChart.css";

function maxValue(series) {
  return Math.max(1, ...series.map((item) => Number(item.value) || 0));
}

export function BarChart({
  data = [],
  height = 180,
  color = "#a78bfa",
  label = "Activity",
}) {
  const max = maxValue(data);
  const width = Math.max(320, data.length * 42);
  const padX = 28;
  const padY = 24;
  const chartH = height - padY * 2;
  const gap = 10;
  const barW = Math.max(
    12,
    (width - padX * 2 - gap * (data.length - 1)) / Math.max(data.length, 1)
  );

  return (
    <div className="usage-chart">
      <div className="usage-chart-head">
        <h3>{label}</h3>
        <span>Last {data.length} days</span>
      </div>
      <svg
        className="usage-chart-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
      >
        {[0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padY + chartH * (1 - ratio);
          return (
            <g key={ratio}>
              <line
                x1={padX}
                x2={width - padX}
                y1={y}
                y2={y}
                className="usage-grid"
              />
              <text x={4} y={y + 4} className="usage-axis">
                {Math.round(max * ratio)}
              </text>
            </g>
          );
        })}
        {data.map((item, index) => {
          const value = Number(item.value) || 0;
          const h = (value / max) * chartH;
          const x = padX + index * (barW + gap);
          const y = padY + chartH - h;
          return (
            <g key={item.label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(h, value > 0 ? 3 : 0)}
                fill={color}
                rx="2"
              >
                <title>
                  {item.label}: {value}
                </title>
              </rect>
              <text
                x={x + barW / 2}
                y={height - 6}
                textAnchor="middle"
                className="usage-axis"
              >
                {item.short || item.label.slice(5)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function BreakdownChart({
  items = [],
  label = "Breakdown",
}) {
  const max = maxValue(items);
  return (
    <div className="usage-chart">
      <div className="usage-chart-head">
        <h3>{label}</h3>
        <span>By action</span>
      </div>
      <div className="usage-breakdown">
        {items.map((item) => {
          const value = Number(item.value) || 0;
          const pct = Math.round((value / max) * 100);
          return (
            <div key={item.label} className="usage-breakdown-row">
              <div className="usage-breakdown-meta">
                <strong>{item.label}</strong>
                <span>{value}</span>
              </div>
              <div className="usage-breakdown-track">
                <div
                  className="usage-breakdown-fill"
                  style={{
                    width: `${pct}%`,
                    background: item.color || "#a78bfa",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
