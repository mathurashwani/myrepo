export const DataTable = ({ sensors }) => {
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

  return (
    <div data-testid="sensor-data-table" className="bg-card border border-border/50 rounded-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-sm border-collapse">
          <thead className="uppercase tracking-wider text-muted-foreground bg-muted/20">
            <tr>
              <th className="text-left p-4 border-b border-border/50">Sensor ID</th>
              <th className="text-left p-4 border-b border-border/50">Location</th>
              <th className="text-right p-4 border-b border-border/50">Temperature</th>
              <th className="text-right p-4 border-b border-border/50">Humidity</th>
              <th className="text-right p-4 border-b border-border/50">Pressure</th>
              <th className="text-center p-4 border-b border-border/50">Status</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((sensor) => (
              <tr 
                key={sensor.sensor_id} 
                data-testid={`table-row-${sensor.sensor_id}`}
                className="border-b border-border/30 hover:bg-muted/10 transition-colors duration-200"
              >
                <td className="p-4 text-primary">{sensor.sensor_id}</td>
                <td className="p-4 text-foreground/80">{sensor.sensor_name}</td>
                <td className="p-4 text-right text-chart-4">{sensor.temperature}°C</td>
                <td className="p-4 text-right text-chart-1">{sensor.humidity}%</td>
                <td className="p-4 text-right text-chart-3">{sensor.pressure} hPa</td>
                <td className={`p-4 text-center uppercase text-xs ${getStatusColor(sensor.status)}`}>
                  {sensor.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
