import { useState, useEffect } from "react";
import { RefreshCw, Database } from "lucide-react";
import axios from "axios";
import { SensorCard } from "./components/SensorCard";
import { DataTable } from "./components/DataTable";
import { LineChartComponent, BarChartComponent } from "./components/Charts";
import { GaugeChart } from "./components/GaugeChart";
import { toast, Toaster } from "sonner";
import "@/App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [sensors, setSensors] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchSensors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/sensors`);
      setSensors(response.data);
      setLastUpdate(new Date().toLocaleTimeString());
      toast.success("Sensor data refreshed");
    } catch (error) {
      console.error("Error fetching sensors:", error);
      toast.error("Failed to fetch sensor data");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalData = async (sensorId) => {
    try {
      const response = await axios.get(`${API}/sensors/${sensorId}/history`);
      setHistoricalData(response.data);
      setSelectedSensor(sensorId);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      toast.error("Failed to fetch historical data");
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  useEffect(() => {
    if (sensors.length > 0 && !selectedSensor) {
      fetchHistoricalData(sensors[0].sensor_id);
    }
  }, [sensors]);

  const avgTemp = sensors.length > 0 ? (sensors.reduce((sum, s) => sum + s.temperature, 0) / sensors.length).toFixed(1) : 0;
  const avgHumidity = sensors.length > 0 ? (sensors.reduce((sum, s) => sum + s.humidity, 0) / sensors.length).toFixed(1) : 0;
  const avgPressure = sensors.length > 0 ? (sensors.reduce((sum, s) => sum + s.pressure, 0) / sensors.length).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      
      <div className="relative p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-foreground font-heading flex items-center gap-3">
              <Database className="h-10 w-10 text-primary" />
              IoT Dashboard
            </h1>
            <p className="text-sm leading-relaxed text-foreground/80 mt-2 font-body">
              Environmental Monitoring System - Real-time Sensor Data
            </p>
          </div>
          <button
            data-testid="refresh-button"
            onClick={fetchSensors}
            disabled={loading}
            className="rounded-none font-mono uppercase tracking-wider border border-primary/50 px-6 py-3 bg-transparent hover:bg-primary/10 hover:text-primary transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {lastUpdate && (
          <div className="mb-6 text-xs font-mono text-muted-foreground">
            Last updated: {lastUpdate}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GaugeChart 
              value={parseFloat(avgTemp)} 
              max={35} 
              label="Avg Temperature" 
              unit="°C" 
              color="hsl(var(--chart-4))"
            />
            <GaugeChart 
              value={parseFloat(avgHumidity)} 
              max={100} 
              label="Avg Humidity" 
              unit="%" 
              color="hsl(var(--chart-1))"
            />
            <GaugeChart 
              value={parseFloat(avgPressure)} 
              max={1050} 
              label="Avg Pressure" 
              unit="hPa" 
              color="hsl(var(--chart-3))"
            />
          </div>

          <div>
            {historicalData.length > 0 && (
              <LineChartComponent 
                data={historicalData} 
                title={`24-Hour Trend - ${sensors.find(s => s.sensor_id === selectedSensor)?.sensor_name || ''}`}
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {sensors.map((sensor) => (
              <SensorCard 
                key={sensor.sensor_id} 
                sensor={sensor}
                onClick={() => fetchHistoricalData(sensor.sensor_id)}
              />
            ))}
          </div>

          <div>
            <BarChartComponent 
              data={sensors} 
              title="Sensor Comparison"
            />
          </div>

          <div>
            <DataTable sensors={sensors} />
          </div>
        </div>
      </div>
      
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
};

function App() {
  return <Dashboard />;
}

export default App;
