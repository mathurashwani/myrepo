import { useState, useEffect, useRef } from "react";
import { RefreshCw, Database, Download, Bell, Activity, Play, Pause } from "lucide-react";
import axios from "axios";
import { SensorCard } from "./components/SensorCard";
import { DataTable } from "./components/DataTable";
import { LineChartComponent, BarChartComponent } from "./components/Charts";
import { GaugeChart } from "./components/GaugeChart";
import { ExportModal } from "./components/ExportModal";
import { AlertConfigModal } from "./components/AlertConfigModal";
import { HealthMonitoring } from "./components/HealthMonitoring";
import { toast, Toaster } from "sonner";
import "@/App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [sensors, setSensors] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const intervalRef = useRef(null);

  // PWA Install Prompt Handler
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success('App installed successfully!');
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const fetchSensors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/sensors`);
      setSensors(response.data);
      setLastUpdate(new Date().toLocaleTimeString());
      if (!autoRefresh) {
        toast.success("Sensor data refreshed");
      }
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

  const fetchHealthData = async () => {
    try {
      const response = await axios.get(`${API}/sensors/health/all`);
      setHealthData(response.data);
    } catch (error) {
      console.error("Error fetching health data:", error);
    }
  };

  useEffect(() => {
    fetchSensors();
    fetchHealthData();

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch((err) => console.log('Service Worker registration failed:', err));
    }
  }, []);

  useEffect(() => {
    if (sensors.length > 0 && !selectedSensor) {
      fetchHistoricalData(sensors[0].sensor_id);
    }
  }, [sensors]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchSensors();
      }, 30000);
      toast.success("Auto-refresh enabled (every 30 seconds)");
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh]);

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
      
      <div className="relative p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-foreground font-heading flex items-center gap-3">
              <Database className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              Ethos Automation IoT Dashboard
            </h1>
            <p className="text-xs md:text-sm leading-relaxed text-foreground/80 mt-2 font-body">
              Environmental Monitoring System
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {showInstallButton && (
              <button
                data-testid="install-pwa-button"
                onClick={handleInstallClick}
                className="rounded-none font-mono uppercase tracking-wider border border-primary bg-primary text-primary-foreground px-4 py-2 text-xs transition-colors duration-200 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Install App
              </button>
            )}

            <button
              data-testid="auto-refresh-toggle"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`rounded-none font-mono uppercase tracking-wider border px-3 py-2 text-xs transition-colors duration-200 flex items-center gap-2 ${
                autoRefresh 
                  ? 'border-primary bg-primary/20 text-primary' 
                  : 'border-primary/50 bg-transparent hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {autoRefresh ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              <span className="hidden sm:inline">Auto</span>
            </button>

            <button
              data-testid="configure-alerts-button"
              onClick={() => setShowAlertModal(true)}
              className="rounded-none font-mono uppercase tracking-wider border border-primary/50 px-3 py-2 text-xs bg-transparent hover:bg-primary/10 hover:text-primary transition-colors duration-200 flex items-center gap-2"
            >
              <Bell className="h-3 w-3" />
              <span className="hidden sm:inline">Alerts</span>
            </button>

            <button
              data-testid="export-data-button"
              onClick={() => setShowExportModal(true)}
              className="rounded-none font-mono uppercase tracking-wider border border-primary/50 px-3 py-2 text-xs bg-transparent hover:bg-primary/10 hover:text-primary transition-colors duration-200 flex items-center gap-2"
            >
              <Download className="h-3 w-3" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              data-testid="refresh-button"
              onClick={fetchSensors}
              disabled={loading}
              className="rounded-none font-mono uppercase tracking-wider border border-primary/50 px-4 py-2 text-xs bg-transparent hover:bg-primary/10 hover:text-primary transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {lastUpdate && (
          <div className="mb-4 flex items-center gap-4 flex-wrap">
            <div className="text-xs font-mono text-muted-foreground">
              Last updated: {lastUpdate}
            </div>
            {autoRefresh && (
              <div className="flex items-center gap-2 text-xs font-mono text-primary">
                <Activity className="h-3 w-3 animate-pulse" />
                Auto-refreshing every 30s
              </div>
            )}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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

          {healthData.length > 0 && (
            <HealthMonitoring healthData={healthData} />
          )}

          <div>
            <DataTable sensors={sensors} />
          </div>
        </div>
      </div>
      
      <ExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
        sensors={sensors}
      />
      
      <AlertConfigModal 
        isOpen={showAlertModal} 
        onClose={() => setShowAlertModal(false)} 
        sensors={sensors}
      />
      
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
};

function App() {
  return <Dashboard />;
}

export default App;
