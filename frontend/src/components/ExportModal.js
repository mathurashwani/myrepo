import { useState } from "react";
import { X, Calendar } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export const ExportModal = ({ isOpen, onClose, sensors }) => {
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [exportFormat, setExportFormat] = useState("csv");

  if (!isOpen) return null;

  const generateCSV = () => {
    const headers = ["Sensor ID", "Location", "Temperature (°C)", "Humidity (%)", "Pressure (hPa)", "Status"];
    const rows = sensors.map(s => [
      s.sensor_id,
      s.sensor_name,
      s.temperature,
      s.humidity,
      s.pressure,
      s.status
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach(row => {
      csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sensor_data_${startDate}_to_${endDate}.csv`;
    a.click();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("IoT Dashboard - Sensor Data Report", 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Report Period: ${startDate} to ${endDate}`, 14, 30);
    doc.text(`Generated: ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`, 14, 36);

    const tableData = sensors.map(s => [
      s.sensor_id,
      s.sensor_name,
      `${s.temperature}°C`,
      `${s.humidity}%`,
      `${s.pressure} hPa`,
      s.status.toUpperCase()
    ]);

    autoTable(doc, {
      startY: 45,
      head: [["Sensor ID", "Location", "Temperature", "Humidity", "Pressure", "Status"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [0, 240, 255], textColor: [0, 0, 0] },
      styles: { fontSize: 9 }
    });

    doc.save(`sensor_report_${startDate}_to_${endDate}.pdf`);
  };

  const handleExport = () => {
    if (exportFormat === "csv") {
      generateCSV();
    } else {
      generatePDF();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" data-testid="export-modal">
      <div className="bg-card border border-primary/50 rounded-sm p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold tracking-wide uppercase text-foreground/90">
            Export Data
          </h3>
          <button
            data-testid="close-export-modal"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70 block mb-2">
              <Calendar className="inline h-3 w-3 mr-1" />
              Start Date
            </label>
            <input
              type="date"
              data-testid="export-start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-background border border-border rounded-sm p-2 text-foreground font-mono text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70 block mb-2">
              <Calendar className="inline h-3 w-3 mr-1" />
              End Date
            </label>
            <input
              type="date"
              data-testid="export-end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-background border border-border rounded-sm p-2 text-foreground font-mono text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70 block mb-2">
              Format
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  data-testid="export-format-csv"
                  name="format"
                  value="csv"
                  checked={exportFormat === "csv"}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="text-primary"
                />
                <span className="text-sm font-mono text-foreground">CSV</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  data-testid="export-format-pdf"
                  name="format"
                  value="pdf"
                  checked={exportFormat === "pdf"}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="text-primary"
                />
                <span className="text-sm font-mono text-foreground">PDF</span>
              </label>
            </div>
          </div>

          <button
            data-testid="export-confirm-button"
            onClick={handleExport}
            className="w-full mt-6 rounded-none font-mono uppercase tracking-wider border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 px-6 py-3"
          >
            Export {exportFormat.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};
