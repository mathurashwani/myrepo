import { useState } from "react";
import { X, Bell, Mail } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AlertConfigModal = ({ isOpen, onClose, sensors }) => {
  const [formData, setFormData] = useState({
    sensor_id: sensors[0]?.sensor_id || "",
    metric: "temperature",
    threshold_min: "",
    threshold_max: "",
    email: "",
    enabled: true
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        threshold_min: formData.threshold_min ? parseFloat(formData.threshold_min) : null,
        threshold_max: formData.threshold_max ? parseFloat(formData.threshold_max) : null
      };

      await axios.post(`${API}/alerts`, payload);
      toast.success("MOCKED: Alert configuration saved. Email notifications will be sent when thresholds are exceeded.");
      onClose();
    } catch (error) {
      console.error("Error creating alert:", error);
      toast.error("Failed to create alert");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" data-testid="alert-config-modal">
      <div className="bg-card border border-primary/50 rounded-sm p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold tracking-wide uppercase text-foreground/90 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Alert Configuration
          </h3>
          <button
            data-testid="close-alert-modal"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70 block mb-2">
              Sensor
            </label>
            <select
              data-testid="alert-sensor-select"
              value={formData.sensor_id}
              onChange={(e) => setFormData({ ...formData, sensor_id: e.target.value })}
              className="w-full bg-background border border-border rounded-sm p-2 text-foreground font-mono text-sm"
            >
              {sensors.map(s => (
                <option key={s.sensor_id} value={s.sensor_id}>
                  {s.sensor_id} - {s.sensor_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70 block mb-2">
              Metric
            </label>
            <select
              data-testid="alert-metric-select"
              value={formData.metric}
              onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
              className="w-full bg-background border border-border rounded-sm p-2 text-foreground font-mono text-sm"
            >
              <option value="temperature">Temperature</option>
              <option value="humidity">Humidity</option>
              <option value="pressure">Pressure</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70 block mb-2">
                Min Threshold
              </label>
              <input
                type="number"
                step="0.1"
                data-testid="alert-threshold-min"
                value={formData.threshold_min}
                onChange={(e) => setFormData({ ...formData, threshold_min: e.target.value })}
                className="w-full bg-background border border-border rounded-sm p-2 text-foreground font-mono text-sm"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70 block mb-2">
                Max Threshold
              </label>
              <input
                type="number"
                step="0.1"
                data-testid="alert-threshold-max"
                value={formData.threshold_max}
                onChange={(e) => setFormData({ ...formData, threshold_max: e.target.value })}
                className="w-full bg-background border border-border rounded-sm p-2 text-foreground font-mono text-sm"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70 block mb-2">
              <Mail className="inline h-3 w-3 mr-1" />
              Email (MOCKED)
            </label>
            <input
              type="email"
              data-testid="alert-email-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-background border border-border rounded-sm p-2 text-foreground font-mono text-sm"
              placeholder="your@email.com"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              * Email notifications are mocked (not actually sent)
            </p>
          </div>

          <button
            type="submit"
            data-testid="save-alert-button"
            className="w-full mt-6 rounded-none font-mono uppercase tracking-wider border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 px-6 py-3"
          >
            Save Alert
          </button>
        </form>
      </div>
    </div>
  );
};
