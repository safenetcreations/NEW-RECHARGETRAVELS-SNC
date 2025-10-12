
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface LiveFlowMeterProps {
  waterfallName: string;
  currentFlow?: number;
  unit?: string;
  status?: 'low' | 'moderate' | 'high' | 'extreme';
}

export function LiveFlowMeter({ 
  waterfallName, 
  currentFlow = 0, 
  unit = 'm³/s',
  status = 'moderate' 
}: LiveFlowMeterProps) {
  const [flow, setFlow] = useState(currentFlow);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * 0.4;
      const newFlow = Math.max(0.1, flow + variation);
      
      setHistory(prev => [...prev.slice(-19), flow]);
      setFlow(newFlow);
      
      if (newFlow > flow + 0.1) setTrend('up');
      else if (newFlow < flow - 0.1) setTrend('down');
      else setTrend('stable');
    }, 2000);

    return () => clearInterval(interval);
  }, [flow]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'moderate': return 'text-green-600 bg-green-100';
      case 'high': return 'text-blue-600 bg-blue-100';
      case 'extreme': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const flowPercentage = Math.min(100, (flow / 5) * 100);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-teal-50 border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-800">
            Live Flow Meter
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-600 font-medium">LIVE</span>
          </div>
        </div>
        <p className="text-sm text-slate-600">{waterfallName}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Flow Display */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Droplets className="w-6 h-6 text-blue-500" />
            <span className="text-3xl font-bold text-slate-800">
              {flow.toFixed(1)}
            </span>
            <span className="text-lg text-slate-600">{unit}</span>
            {getTrendIcon()}
          </div>
          
          <Badge className={`${getStatusColor(status)} font-medium`}>
            {status.toUpperCase()} FLOW
          </Badge>
        </div>

        {/* Visual Flow Meter */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Flow Rate</span>
            <span>{flowPercentage.toFixed(0)}%</span>
          </div>
          
          <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 via-teal-400 to-blue-500 transition-all duration-1000 ease-in-out"
              style={{ width: `${flowPercentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-700">24-Hour Trend</div>
          <div className="flex items-end space-x-1 h-16 bg-slate-100 rounded p-2">
            {history.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-blue-400 to-teal-400 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                style={{ height: `${(value / 5) * 100}%` }}
              />
            ))}
            <div
              className="flex-1 bg-gradient-to-t from-blue-500 to-teal-500 rounded-sm animate-pulse"
              style={{ height: `${flowPercentage}%` }}
            />
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-200">
          <div className="text-center">
            <div className="text-sm font-bold text-slate-800">
              {Math.max(...history, flow).toFixed(1)}
            </div>
            <div className="text-xs text-slate-600">Peak</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-slate-800">
              {(history.reduce((a, b) => a + b, 0) / history.length || flow).toFixed(1)}
            </div>
            <div className="text-xs text-slate-600">Average</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-slate-800">
              {Math.min(...history, flow).toFixed(1)}
            </div>
            <div className="text-xs text-slate-600">Low</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
