import { Activity } from "lucide-react";

export const SensorCard = ({ sensor, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "operational":
        return "text-chart-2";
      case "warning":
        return "text-chart-3";
      case "critical":
        return "text-chart-4";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBorder = (status) => {
    switch (status) {
      case "operational":
        return "border-chart-2/30";
      case "warning":
        return "border-chart-3/30";
      case "critical":
        return "border-chart-4/30";
      default:
        return "border-border/50";
    }
  };

  return (
    <div
      data-testid={`sensor-card-${sensor.sensor_id}`}
      onClick={onClick}
      className={`bg-card border ${getStatusBorder(sensor.status)} rounded-sm p-4 relative overflow-hidden cursor-pointer transition-colors duration-200 hover:border-primary/50`}
    >
      <div className="absolute top-2 right-2">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M0,0 L12,0 L12,12" stroke="currentColor" strokeWidth="1" fill="none" className="text-primary/30" />
        </svg>
      </div>
      
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70 mb-1">
            {sensor.sensor_id}
          </div>
          <h3 className="text-lg font-semibold tracking-wide uppercase text-foreground/90">
            {sensor.sensor_name}
          </h3>
        </div>
        <Activity className="h-5 w-5 text-primary" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70">Temp</span>
          <span className="font-mono text-xl tracking-tight text-chart-4">{sensor.temperature}°C</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70">Humidity</span>
          <span className="font-mono text-xl tracking-tight text-chart-1">{sensor.humidity}%</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70">Pressure</span>
          <span className="font-mono text-xl tracking-tight text-chart-3">{sensor.pressure} hPa</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70">Status</span>
          <span className={`text-xs font-mono uppercase tracking-widest ${getStatusColor(sensor.status)}`}>
            {sensor.status}
          </span>
        </div>
      </div>
    </div>
  );
};
