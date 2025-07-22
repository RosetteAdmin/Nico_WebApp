import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "./DataChart.css";

const DataChart = ({ deviceId }) => {
  const [chartData, setChartData] = useState({
    nb: [],
    ozone: [],
    oxygen: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Hour');
  const [selectedGenerator, setSelectedGenerator] = useState('nb');

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!process.env.REACT_APP_EP) {
          throw new Error('Backend URL not configured. Check REACT_APP_EP environment variable.');
        }
        
        if (!deviceId || deviceId === 'undefined') {
          throw new Error('Invalid device ID provided.');
        }
        
        // Use the SAME API path as your working LogDetails component
        const apiUrl = `${process.env.REACT_APP_EP}/data/devices/${deviceId}/generator-logs?ts=${Date.now()}`;
        console.log('Fetching real data from:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
        });
        
        console.log('Response status:', response.status);
        console.log('Response OK:', response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Real API Response:', data);
        
        if (data.status === 'success' && data.data) {
          // Process real historical data using the SAME structure as LogDetails
          if (data.data.history && data.data.history.length > 0) {
            const processedData = processRealHistoricalData(data.data.history);
            setChartData(processedData);
            console.log('Using real data from database');
          } else {
            console.warn('No historical data found in database');
            setChartData({ nb: [], ozone: [], oxygen: [] });
          }
        } else if (data.status === 'error') {
          throw new Error(data.message);
        } else {
          throw new Error('Invalid response structure from backend');
        }
        
      } catch (err) {
        console.error('Error fetching real chart data:', err);
        setError(err.message || 'Failed to load chart data');
        setChartData({ nb: [], ozone: [], oxygen: [] });
      } finally {
        setLoading(false);
      }
    };

    if (deviceId) {
      fetchChartData();
      // Refresh every 5 seconds 
      const interval = setInterval(fetchChartData, 5000);
      return () => clearInterval(interval);
    } else {
      setError('No device ID provided');
      setLoading(false);
    }
  }, [deviceId]);

  const processRealHistoricalData = (historyData) => {
  if (!Array.isArray(historyData) || historyData.length === 0) {
    console.log('No real history data to process');
    return { nb: [], ozone: [], oxygen: [] };
  }
  
  console.log('Processing real historical data:', historyData.length, 'records');
  
  const generators = {
    nb: [],
    ozone: [],
    oxygen: []
  };

  // Generate time points: 30 minutes before and after current time with 10-minute gaps
  const generateTimePoints = () => {
    const now = new Date();
    const startTime = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes before
    
    const timeLabels = [];
    for (let i = 0; i < 7; i++) { // 7 points total (30 min before + current + 30 min after)
      const timePoint = new Date(startTime.getTime() + i * 10 * 60 * 1000); // 10-minute intervals
      timeLabels.push(timePoint.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    }
    
    return timeLabels;
  };

  const timePoints = generateTimePoints();

  // Group data by generator type - using EXACT field names from your database
  historyData.forEach((record, index) => {
    try {
      // Use generated time points for X-axis instead of actual timestamps
      const timeIndex = index % timePoints.length;
      const timeStr = timePoints[timeIndex];
      
      const dataPoint = {
        time: timeStr, // X-axis will use generated time points
        timeValue: timeStr,
        // Use exact database field names (snake_case) from your LogDetails
        flowRate: parseFloat(record.flow_rate) || 0,
        pressure: parseFloat(record.pressure) || 0,
        waterTemperature: parseFloat(record.water_temperature) || 0,
        systemTemperature: parseFloat(record.system_temperature) || 0,
        totalWaterOutlet: parseFloat(record.total_water_outlet) || 0,
        powerStatus: record.power_status,
        timestamp: new Date(record.timestamp)
      };

      // Map generator types from your database (exactly as in LogDetails)
      if (record.generator_type && generators[record.generator_type]) {
        generators[record.generator_type].push(dataPoint);
      } else {
        console.warn('Unknown generator type:', record.generator_type);
      }
    } catch (recordError) {
      console.error('Error processing real record:', recordError, record);
    }
  });

  // Sort by original timestamp but keep the generated time labels
  Object.keys(generators).forEach(type => {
    generators[type] = generators[type]
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-7) // Keep exactly 7 data points to match time points
      .map((point, index) => ({
        ...point,
        time: timePoints[index] || timePoints[timePoints.length - 1]
      }));
  });

  console.log('Processed real data summary:', {
    nb: generators.nb.length,
    ozone: generators.ozone.length,
    oxygen: generators.oxygen.length
  });

  return generators;
};


  const getChartTitle = (metric) => {
    switch (metric) {
      case 'flowRate':
        return 'Water Flow Rate';
      case 'pressure':
        return 'Water Pressure';
      case 'waterTemperature':
        return 'Water Temperature';
      case 'systemTemperature':
        return 'System Temperature';
      case 'totalWaterOutlet':
        return 'Total Water Outlet';
      default:
        return metric;
    }
  };

  const getUnit = (metric) => {
    switch (metric) {
      case 'flowRate':
        return 'L/min';
      case 'pressure':
        return 'bar';
      case 'waterTemperature':
      case 'systemTemperature':
        return '°C';
      case 'totalWaterOutlet':
        return 'L';
      default:
        return '';
    }
  };

  const getGeneratorLabel = (type) => {
    switch (type) {
      case 'nb':
        return 'NB Generator';
      case 'ozone':
        return 'Ozone Generator';
      case 'oxygen':
        return 'Oxygen Generator';
      default:
        return type;
    }
  };

  const renderChart = (metric) => {
    const data = chartData[selectedGenerator] || [];
    const title = getChartTitle(metric);
    const unit = getUnit(metric);
    
    if (!data || data.length === 0) {
      return (
        <div className="chart-container">
          <div className="chart-header">
            <h4 className="chart-title">No data available for {getGeneratorLabel(selectedGenerator)}</h4>
          </div>
          <div style={{ 
            height: 200, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            borderRadius: '4px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ textAlign: 'center', color: '#6b7280' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '16px' }}>📊</p>
              <p style={{ margin: '0', fontSize: '14px' }}>No sensor data available</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>Check database connection</p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h4 className="chart-title">
            {getGeneratorLabel(selectedGenerator)}/ {title}: 
            <span className="chart-value">
              {data.length > 0 ? data[data.length - 1][metric]?.toFixed(1) : 0} {unit}
            </span>
            <span className="data-indicator" style={{ color: '#22c55e', fontSize: '12px', marginLeft: '10px' }}>
              ● Live Data ({data.length} points)
            </span>
          </h4>
          <div className="chart-controls">
            <select 
              value={selectedTimeRange} 
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="time-range-select"
            >
              <option value="Hour">Hour</option>
              <option value="Day">Day</option>
              <option value="Week">Week</option>
            </select>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={200} className="chart-responsive-container">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
              interval={0}
            />
            <YAxis 
              domain={[0, 50]}
              ticks={[0, 10, 20, 30, 40, 50]}
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <Tooltip 
              formatter={(value) => [`${parseFloat(value).toFixed(1)} ${unit}`, title]}
              labelFormatter={(value) => `Time: ${value}`}
              labelStyle={{ color: '#333' }}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey={metric} 
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: '#22c55e' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="device-info-card">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading real sensor data...</p>
        </div>
      </div>
    );
  }

  const hasAnyData = Object.values(chartData).some(generatorData => generatorData.length > 0);

  return (
    <div className="device-info-card charts-container">
      <div>
        <h3 className="section-title charts-section-title">
          Sensor Data: 
          {/* <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px' }}>
            {hasAnyData ? (
              <span style={{ color: '#22c55e' }}>● Connected to Database</span>
            ) : (
              <span style={{ color: '#ef4444' }}>● No Data Available</span>
            )}
          </span> */}
        </h3>
        
        {error && (
          <div className="error-container" style={{ 
            marginBottom: '20px', 
            padding: '15px', 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fecaca', 
            borderRadius: '4px' 
          }}>
            <p className="error-message" style={{ color: '#dc2626', fontSize: '14px', margin: '0' }}>
              ❌ Database Error: {error}
            </p>
            {/* <p style={{ color: '#7f1d1d', fontSize: '12px', margin: '8px 0 0 0' }}>
              Using API path: /data/devices/{deviceId}/generator-logs
            </p> */}
          </div>
        )}
        
        {!error && !hasAnyData && (
          <div style={{ 
            marginBottom: '20px', 
            padding: '15px', 
            backgroundColor: '#fef3c7', 
            border: '1px solid #f59e0b', 
            borderRadius: '4px' 
          }}>
            <p style={{ color: '#92400e', fontSize: '14px', margin: '0' }}>
              ⚠️ No sensor data found in database for device ID: {deviceId}
            </p>
            <p style={{ color: '#78350f', fontSize: '12px', margin: '8px 0 0 0' }}>
              The device may be new or not logging data yet. Check your data collection.
            </p>
          </div>
        )}
        
        <div className="generator-selection">
          <div className="generator-buttons">
            {['nb', 'ozone', 'oxygen'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedGenerator(type)}
                className={`generator-btn ${selectedGenerator === type ? 'active' : ''}`}
              >
                {getGeneratorLabel(type)}
                <span style={{ marginLeft: '5px', fontSize: '12px' }}>
                  ({chartData[type]?.length || 0})
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="charts-grid">
          {renderChart('flowRate')}
          {renderChart('pressure')}
          {renderChart('waterTemperature')}
          {renderChart('systemTemperature')}
          {renderChart('totalWaterOutlet')}
        </div>

        {hasAnyData && (
          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            backgroundColor: '#f0f9ff', 
            border: '1px solid #0ea5e9', 
            borderRadius: '4px',
            fontSize: '12px',
            color: '#0c4a6e'
          }}>
            <strong>Database Info:</strong> Displaying real sensor data from PostgreSQL database. 
            Auto-refreshes every 5 seconds. Device ID: {deviceId}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataChart;
