import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface DataPoint {
  timestamp: string;
  score: number;
  time: Date;
}

interface ChartConfig {
  score: {
    label: string;
    color: string;
  };
}

const chartConfig: ChartConfig = {
  score: {
    label: "Performance Score",
    color: "hsl(var(--primary))",
  },
};

// Mock API function to simulate live data
const fetchLiveData = async (): Promise<{ timestamp: string; score: number }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const now = new Date();
  const score = Math.floor(Math.random() * 101); // Random score 0-100
  
  return {
    timestamp: now.toLocaleTimeString(),
    score: score
  };
};

const LivePerformanceChart = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newDataPoint = await fetchLiveData();
        const dataPoint: DataPoint = {
          ...newDataPoint,
          time: new Date()
        };

        setData(prevData => {
          // Keep only last 20 data points for better performance
          const updatedData = [...prevData, dataPoint];
          return updatedData.slice(-20);
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval for live updates every 5 seconds
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number): string => {
    if (score <= 34) return '#ef4444'; // Red for poor
    if (score <= 69) return '#eab308'; // Yellow for average
    return '#22c55e'; // Green for high
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const score = payload[0].value;
      const color = getScoreColor(score);
      const category = score <= 34 ? 'Poor' : score <= 69 ? 'Average' : 'High';
      
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`Time: ${label}`}</p>
          <p className="text-sm" style={{ color }}>
            {`Score: ${score} (${category})`}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload) return null;
    
    const color = getScoreColor(payload.score);
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={color}
        stroke={color}
        strokeWidth={2}
        opacity={0.8}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading live data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Performance Monitor</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Poor (0-34)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Average (35-69)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>High (70-100)</span>
          </div>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="poorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="averageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#eab308" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#eab308" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            
            {/* Performance band reference lines */}
            <ReferenceLine y={34} stroke="#ef4444" strokeDasharray="2 2" opacity={0.5} />
            <ReferenceLine y={69} stroke="#eab308" strokeDasharray="2 2" opacity={0.5} />
            
            <XAxis 
              dataKey="timestamp" 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              label={{ value: 'Performance Score', angle: -90, position: 'insideLeft' }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="text-sm text-muted-foreground text-center">
        Updates every 5 seconds • Showing last 20 data points
      </div>
    </div>
  );
};

export default LivePerformanceChart;
