export const GaugeChart = ({ value, max, label, unit, color }) => {
  const percentage = (value / max) * 100;
  const rotation = (percentage / 100) * 180 - 90;

  return (
    <div data-testid={`gauge-${label.toLowerCase()}`} className="bg-card border border-border/50 rounded-sm p-4">
      <div className="absolute top-2 right-2">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M0,0 L12,0 L12,12" stroke="currentColor" strokeWidth="1" fill="none" className="text-primary/30" />
        </svg>
      </div>
      
      <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70 mb-4 text-center">
        {label}
      </h4>
      
      <div className="relative w-32 h-32 mx-auto">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
            className="transition-all duration-500"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-mono text-2xl font-bold" style={{ color }}>
            {value}
          </div>
          <div className="text-xs text-muted-foreground font-mono">{unit}</div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-xs font-mono text-muted-foreground">
          Max: {max} {unit}
        </div>
      </div>
    </div>
  );
};
