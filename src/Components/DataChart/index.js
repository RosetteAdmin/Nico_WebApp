// src/components/DataChart.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useLabels } from '../../context/LabelContext';
import "./DataChart.css";

const DataChart = ({ deviceId }) => {
  const { getLabel, fetchLabels, isLoaded } = useLabels();
  const [chartData, setChartData] = useState({ nb: [], ozone: [], oxygen: [] });
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Hour');
  const [selectedGenerator, setSelectedGenerator] = useState('nb');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const totalCharts = 6;

  // Ensure labels are loaded for this device
  useEffect(() => {
    if (deviceId) fetchLabels(deviceId);
  }, [deviceId, fetchLabels]);

  // ===== GET CHART TITLE FROM CONTEXT =====
  const getChartTitle = (metric) => {
    switch (metric) {
      case 'flowRate': return getLabel(deviceId, 'chart_flow_rate');
      case 'pressure': return getLabel(deviceId, 'chart_pressure');
      case 'totalWaterOutlet': return getLabel(deviceId, 'chart_total_water_outlet');
      case 'totalRunningHours': return getLabel(deviceId, 'chart_total_running_hours');
      case 'pumpMotorFrequency': return getLabel(deviceId, 'chart_pump_motor_frequency');
      case 'pumpMotorCurrent': return getLabel(deviceId, 'chart_pump_motor_current');
      default: return metric;
    }
  };

  const getUnit = (metric) => {
    switch (metric) {
      case 'flowRate': return 'L/min';
      case 'pressure': return 'bar';
      case 'totalWaterOutlet': return 'L';
      case 'totalRunningHours': return 'hrs';
      case 'pumpMotorFrequency': return 'Hz';
      case 'pumpMotorCurrent': return 'A';
      default: return '';
    }
  };

  const getGeneratorLabel = (type) => {
    switch (type) {
      case 'nb': return '';
      case 'ozone': return 'Ozone Generator';
      case 'oxygen': return 'Oxygen Generator';
      default: return type;
    }
  };

  // ===== ALL YOUR EXISTING FETCH/PROCESS LOGIC (unchanged) =====
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setError(null);
        if (!process.env.REACT_APP_EP) throw new Error('Backend URL not configured.');
        if (!deviceId || deviceId === 'undefined') throw new Error('Invalid device ID.');

        const apiUrl = `${process.env.REACT_APP_EP}/data/devices/${deviceId}/generator-logs?timeRange=${selectedTimeRange}&ts=${Date.now()}`;
        const response = await fetch(apiUrl, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' } });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        if (data.status === 'success' && data.data) {
          if (data.data.history && data.data.history.length > 0) {
            const processedData = processRealHistoricalData(data.data.history);
            setChartData(processedData);
          } else {
            setChartData({ nb: [], ozone: [], oxygen: [] });
          }
        }
         else if (data.status === 'error') { throw new Error(data.message); }
        else { throw new Error('Invalid response structure'); }
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(err.message);
        setChartData({ nb: [], ozone: [], oxygen: [] });
      }
    };

    if (deviceId) {
      fetchChartData();
      const interval = setInterval(fetchChartData, 5000);
      return () => clearInterval(interval);
    }
  }, [deviceId, selectedTimeRange]);

  const processRealHistoricalData = (historyData) => {
    if (!Array.isArray(historyData) || historyData.length === 0) return { nb: [], ozone: [], oxygen: [] };
    const generators = { nb: [], ozone: [], oxygen: [] };

    const generateTimePoints = () => {
      const now = new Date();
      let startTime, interval, pointsCount;
      switch (selectedTimeRange) {
        case 'Hour': startTime = new Date(now.getTime() - 60 * 60 * 1000); interval = 10 * 60 * 1000; pointsCount = 7; break;
        case 'Day': startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); interval = 4 * 60 * 60 * 1000; pointsCount = 7; break;
        case 'Week': startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); interval = 24 * 60 * 60 * 1000; pointsCount = 8; break;
        default: startTime = new Date(now.getTime() - 60 * 60 * 1000); interval = 10 * 60 * 1000; pointsCount = 7;
      }
      const timeLabels = [];
      for (let i = 0; i < pointsCount; i++) {
        const tp = new Date(startTime.getTime() + i * interval);
        let ft;
        if (selectedTimeRange === 'Hour' || selectedTimeRange === 'Day') ft = tp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        else ft = tp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        timeLabels.push(ft);
      }
      return timeLabels;
    };

    const timePoints = generateTimePoints();
    historyData.forEach((record, index) => {
      try {
        const timeIndex = index % timePoints.length;
        generators.nb.push({
          time: timePoints[timeIndex],
          flowRate: parseFloat(record.waterFlow) || 0,
          pressure: parseFloat(record.waterPressure) || 0,
          totalWaterOutlet: parseFloat(record.totalWaterOutlet) || 0,
          totalRunningHours: parseFloat(record.totalRunningHours) || 0,
          pumpMotorFrequency: parseFloat(record.pumpMotorFrequency) || 0,
          pumpMotorCurrent: parseFloat(record.pumpMotorCurrent) || 0,
          timestamp: new Date(record.timestamp)
        });
      } catch (e) { console.error('Error processing record:', e); }
    });

    const pointsCount = selectedTimeRange === 'Week' ? 8 : 7;
    Object.keys(generators).forEach(type => {
      generators[type] = generators[type].sort((a, b) => a.timestamp - b.timestamp).slice(-pointsCount)
        .map((point, index) => ({ ...point, time: timePoints[index] || timePoints[timePoints.length - 1] }));
    });

    return generators;
  };

  const getYAxisDomain = (metric) => {
    // const data = chartData[selectedGenerator] || [];
    let data = chartData[selectedGenerator] || [];

if (!data || data.length === 0) {
  data = Array.from({ length: 7 }, (_, i) => ({
    time: `T${i + 1}`,
    flowRate: 0,
    pressure: 0,
    totalWaterOutlet: 0,
    totalRunningHours: 0,
    pumpMotorFrequency: 0,
    pumpMotorCurrent: 0
  }));
}
    if (data.length === 0) {
      switch (metric) {
        case 'flowRate': return [0, 50]; case 'pressure': return [0, 10]; case 'totalWaterOutlet': return [0, 1000];
        case 'totalRunningHours': return [0, 100]; case 'pumpMotorFrequency': return [0, 60]; case 'pumpMotorCurrent': return [0, 20];
        default: return [0, 50];
      }
    }
    const values = data.map(d => d[metric] || 0);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    return [Math.max(0, Math.floor(minValue * 0.9)), Math.ceil(maxValue * 1.1) || 10];
  };

  const getYAxisTicks = (metric) => {
    const [min, max] = getYAxisDomain(metric);
    const step = Math.ceil((max - min) / 5);
    const ticks = [];
    for (let i = 0; i < 6; i++) ticks.push(min + step * i);
    return ticks;
  };

  const handlePrevSlide = () => setCurrentSlide(prev => prev === 0 ? totalCharts - 1 : prev - 1);
  const handleNextSlide = () => setCurrentSlide(prev => prev === totalCharts - 1 ? 0 : prev + 1);
  const goToSlide = (index) => setCurrentSlide(index);

  const renderChart = (metric) => {
    const data = chartData[selectedGenerator] || [];
    const title = getChartTitle(metric);
    const unit = getUnit(metric);

    // if (!data || data.length === 0) {
    //   return (
    //     <div className="chart-container">
    //       <div className="chart-header"><h4 className="chart-title">No data available for {getGeneratorLabel(selectedGenerator)}</h4></div>
    //       <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
    //         <div style={{ textAlign: 'center', color: '#6b7280' }}>
    //           <p style={{ margin: '0 0 8px 0', fontSize: '16px' }}>📊</p>
    //           <p style={{ margin: '0', fontSize: '14px' }}>No sensor data available</p>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // }

    const currentValue = data.length > 0 ? data[data.length - 1][metric] : 0;

    return (
      <div className="chart-container">
        <div className="chart-header">
          <h4 className="chart-title">
            {getGeneratorLabel(selectedGenerator)} {title}:
            <span className="chart-value">{currentValue !== undefined && currentValue !== null ? currentValue.toFixed(1) : '0.0'} {unit}</span>
          </h4>
          <div className="chart-controls">
            <select value={selectedTimeRange} onChange={(e) => setSelectedTimeRange(e.target.value)} className="time-range-select">
              <option value="Hour">Hour</option>
              <option value="Day">Day</option>
              <option value="Week">Week</option>
            </select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200} className="chart-responsive-container">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id={`colorGradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0d6efd" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} axisLine={{ stroke: '#e0e0e0' }} interval={0}
              angle={selectedTimeRange === 'Day' ? -45 : 0} textAnchor={selectedTimeRange === 'Day' ? 'end' : 'middle'}
              height={selectedTimeRange === 'Day' ? 60 : 30} />
            <YAxis domain={getYAxisDomain(metric)} ticks={getYAxisTicks(metric)} tick={{ fontSize: 12 }} axisLine={{ stroke: '#e0e0e0' }} />
            <Tooltip formatter={(value) => [`${parseFloat(value).toFixed(1)} ${unit}`, title]} labelFormatter={(value) => `Time: ${value}`}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px' }} />
            <Line type="monotone" dataKey={metric} stroke="#0d6efd" strokeWidth={2.5} dot={false}
              activeDot={{ r: 6, stroke: '#0d6efd', fill: '#fff', strokeWidth: 2 }} fillOpacity={1} fill={`url(#colorGradient-${metric})`} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // const hasAnyData = Object.values(chartData).some(d => d.length > 0);

  return (
    <div className="device-info-card charts-container">
      <div>
        <hr className="sensor-divider" />
        {error && <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px' }}>
          <p style={{ color: '#dc2626', fontSize: '14px', margin: '0' }}>❌ Database Error: {error}</p>
        </div>}
        {/* {!error && !hasAnyData && 
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '4px' }}>
          <p style={{ color: '#92400e', fontSize: '14px', margin: '0' }}>⚠️ No sensor data found for device ID: {deviceId}</p>
        </div>} */}

        <div className="carousel-wrapper">
          <button className="carousel-btn carousel-btn-prev" onClick={handlePrevSlide}>‹</button>
          <div className="charts-carousel">
            <div className="charts-carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              <div className="carousel-slide">{renderChart('flowRate')}</div>
              <div className="carousel-slide">{renderChart('pressure')}</div>
              <div className="carousel-slide">{renderChart('totalWaterOutlet')}</div>
              <div className="carousel-slide">{renderChart('totalRunningHours')}</div>
              <div className="carousel-slide">{renderChart('pumpMotorFrequency')}</div>
              <div className="carousel-slide">{renderChart('pumpMotorCurrent')}</div>
            </div>
          </div>
          <button className="carousel-btn carousel-btn-next" onClick={handleNextSlide}>›</button>
        </div>

        <div className="carousel-indicators">
          {[...Array(totalCharts)].map((_, index) => (
            <button key={index} className={`carousel-dot ${currentSlide === index ? 'active' : ''}`} onClick={() => goToSlide(index)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataChart;