import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const LineChartComponent = ({ data, title }) => {
  return (
    <div data-testid="line-chart" className="bg-card border border-border/50 rounded-sm p-4">
      <div className="absolute top-2 right-2">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M0,0 L12,0 L12,12" stroke="currentColor" strokeWidth="1" fill="none" className="text-primary/30" />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold tracking-wide uppercase text-foreground/90 mb-4">{title}</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" opacity={0.2} />
          <XAxis 
            dataKey="timestamp" 
            stroke="hsl(var(--muted-foreground))" 
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0',
              fontFamily: 'JetBrains Mono',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }} />
          <Line type="monotone" dataKey="temperature" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} name="Temp (°C)" />
          <Line type="monotone" dataKey="humidity" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} name="Humidity (%)" />
          <Line type="monotone" dataKey="pressure" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} name="Pressure (hPa)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BarChartComponent = ({ data, title }) => {
  return (
    <div data-testid="bar-chart" className="bg-card border border-border/50 rounded-sm p-4">
      <div className="absolute top-2 right-2">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M0,0 L12,0 L12,12" stroke="currentColor" strokeWidth="1" fill="none" className="text-primary/30" />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold tracking-wide uppercase text-foreground/90 mb-4">{title}</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" opacity={0.2} />
          <XAxis 
            dataKey="sensor_name" 
            stroke="hsl(var(--muted-foreground))" 
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0',
              fontFamily: 'JetBrains Mono',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }} />
          <Bar dataKey="temperature" fill="hsl(var(--chart-4))" name="Temp (°C)" />
          <Bar dataKey="humidity" fill="hsl(var(--chart-1))" name="Humidity (%)" />
          <Bar dataKey="pressure" fill="hsl(var(--chart-3))" name="Pressure (hPa)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
