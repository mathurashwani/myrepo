import { format } from "date-fns";

export const HealthMonitoring = ({ healthData }) => {
  const getHealthColor = (status) => {
    switch (status) {
      case "excellent":
        return "text-chart-2";
      case "good":
        return "text-chart-1";
      case "fair":
        return "text-chart-3";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div data-testid="health-monitoring" className="bg-card border border-border/50 rounded-sm p-4">
      <h3 className="text-lg font-semibold tracking-wide uppercase text-foreground/90 mb-4">
        Sensor Health Monitoring
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthData.map((health) => (
          <div
            key={health.sensor_id}
            data-testid={`health-card-${health.sensor_id}`}
            className="bg-background border border-border/30 rounded-sm p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70">
                  {health.sensor_id}
                </div>
                <div className="font-semibold text-foreground">{health.sensor_name}</div>
              </div>
              <div className={`text-xs font-mono uppercase ${getHealthColor(health.health_status)}`}>
                {health.health_status}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-mono">Uptime</span>
                <span className="font-mono text-chart-2">{health.uptime_percentage}%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground font-mono">Total Readings</span>
                <span className="font-mono text-foreground">{health.total_readings.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground font-mono">Failed</span>
                <span className="font-mono text-chart-4">{health.failed_readings}</span>
              </div>

              <div className="pt-2 mt-2 border-t border-border/30">
                <div className="text-xs font-mono text-muted-foreground/70 mb-1">Last Maintenance</div>
                <div className="text-xs font-mono text-foreground">
                  {format(new Date(health.last_maintenance), "MMM dd, yyyy")}
                </div>
              </div>

              <div>
                <div className="text-xs font-mono text-muted-foreground/70 mb-1">Next Scheduled</div>
                <div className="text-xs font-mono text-primary">
                  {format(new Date(health.next_maintenance), "MMM dd, yyyy")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
