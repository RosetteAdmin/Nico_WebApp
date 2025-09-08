
// import React, { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts'; // Added Area for the gradient
// import "./DataChart.css";

// const DataChart = ({ deviceId }) => {
//   const [chartData, setChartData] = useState({
//     nb: [],
//     ozone: [],
//     oxygen: []
//   });
//   const [error, setError] = useState(null);
//   const [selectedTimeRange, setSelectedTimeRange] = useState('Hour');
//   const [selectedGenerator, setSelectedGenerator] = useState('nb');

//   useEffect(() => {
//     const fetchChartData = async () => {
//       try {
//         setError(null);

//         if (!process.env.REACT_APP_EP) {
//           throw new Error('Backend URL not configured. Check REACT_APP_EP environment variable.');
//         }

//         if (!deviceId || deviceId === 'undefined') {
//           throw new Error('Invalid device ID provided.');
//         }

//         const apiUrl = `${process.env.REACT_APP_EP}/data/devices/${deviceId}/generator-logs?ts=${Date.now()}`;
//         console.log('Fetching real data from:', apiUrl);

//         const response = await fetch(apiUrl, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Cache-Control': 'no-cache'
//           },
//         });

//         console.log('Response status:', response.status);
//         console.log('Response OK:', response.ok);

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log('Real API Response:', data);

//         if (data.status === 'success' && data.data) {
//           if (data.data.history && data.data.history.length > 0) {
//             const processedData = processRealHistoricalData(data.data.history);
//             setChartData(processedData);
//             console.log('Using real data from database');
//           } else {
//             console.warn('No historical data found in database');
//             setChartData({ nb: [], ozone: [], oxygen: [] });
//           }
//         } else if (data.status === 'error') {
//           throw new Error(data.message);
//         } else {
//           throw new Error('Invalid response structure from backend');
//         }
//       } catch (err) {
//         console.error('Error fetching real chart data:', err);
//         setError(err.message || 'Failed to load chart data');
//         setChartData({ nb: [], ozone: [], oxygen: [] });
//       }
//     };

//     if (deviceId) {
//       fetchChartData();
//       const interval = setInterval(fetchChartData, 5000);
//       return () => clearInterval(interval);
//     } else {
//       setError('No device ID provided');
//     }
//   }, [deviceId]);

//   const processRealHistoricalData = (historyData) => {
//     if (!Array.isArray(historyData) || historyData.length === 0) {
//       console.log('No real history data to process');
//       return { nb: [], ozone: [], oxygen: [] };
//     }

//     console.log('Processing real historical data:', historyData.length, 'records');

//     const generators = {
//       nb: [],
//       ozone: [],
//       oxygen: []
//     };

//     const generateTimePoints = () => {
//       const now = new Date();
//       const startTime = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes before
//       const timeLabels = [];
//       for (let i = 0; i < 7; i++) {
//         const timePoint = new Date(startTime.getTime() + i * 10 * 60 * 1000);
//         timeLabels.push(timePoint.toLocaleTimeString('en-US', {
//           hour: '2-digit',
//           minute: '2-digit',
//           hour12: false
//         }));
//       }
//       return timeLabels;
//     };

//     const timePoints = generateTimePoints();

//     historyData.forEach((record, index) => {
//       try {
//         const timeIndex = index % timePoints.length;
//         const timeStr = timePoints[timeIndex];

//         const dataPoint = {
//           time: timeStr,
//           timeValue: timeStr,
//           flowRate: parseFloat(record.waterFlow) || 0,
//           pressure: parseFloat(record.waterPressure) || 0,
//           waterTemperature: 0,
//           systemTemperature: 0,
//           totalWaterOutlet: parseFloat(record.totalRunningHours) || 0,
//           powerStatus: null,
//           timestamp: new Date(record.timestamp)
//         };

//         generators.nb.push(dataPoint);
//       } catch (recordError) {
//         console.error('Error processing real record:', recordError, record);
//       }
//     });

//     Object.keys(generators).forEach(type => {
//       generators[type] = generators[type]
//         .sort((a, b) => a.timestamp - b.timestamp)
//         .slice(-7)
//         .map((point, index) => ({
//           ...point,
//           time: timePoints[index] || timePoints[timePoints.length - 1]
//         }));
//     });

//     console.log('Processed real data summary:', {
//       nb: generators.nb.length,
//       ozone: generators.ozone.length,
//       oxygen: generators.oxygen.length
//     });

//     return generators;
//   };

//   const getChartTitle = (metric) => {
//     switch (metric) {
//       case 'flowRate':
//         return 'Water Flow Rate';
//       case 'pressure':
//         return 'Water Pressure';
//       default:
//         return metric;
//     }
//   };

//   const getUnit = (metric) => {
//     switch (metric) {
//       case 'flowRate':
//         return 'L/min';
//       case 'pressure':
//         return 'bar';
//       default:
//         return '';
//     }
//   };

//   const getGeneratorLabel = (type) => {
//     switch (type) {
//       case 'nb':
//         return '';
//       case 'ozone':
//         return 'Ozone Generator';
//       case 'oxygen':
//         return 'Oxygen Generator';
//       default:
//         return type;
//     }
//   };

//   const renderChart = (metric) => {
//     const data = chartData[selectedGenerator] || [];
//     const title = getChartTitle(metric);
//     const unit = getUnit(metric);

//     if (!data || data.length === 0) {
//       return (
//         <div className="chart-container">
//           <div className="chart-header">
//             <h4 className="chart-title">No data available for {getGeneratorLabel(selectedGenerator)}</h4>
//           </div>
//           <div style={{
//             height: 200,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: '#f9fafb',
//             borderRadius: '4px',
//             border: '1px solid #e5e7eb'
//           }}>
//             <div style={{ textAlign: 'center', color: '#6b7280' }}>
//               <p style={{ margin: '0 0 8px 0', fontSize: '16px' }}>📊</p>
//               <p style={{ margin: '0', fontSize: '14px' }}>No sensor data available</p>
//               <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>Check database connection</p>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="chart-container">
//         <div className="chart-header">
//           <h4 className="chart-title">
//             {getGeneratorLabel(selectedGenerator)}{title}:
//             <span className="chart-value">
//               {data.length > 0 ? data[data.length - 1][metric]?.toFixed(1) : 0} {unit}
//             </span>
//           </h4>
//           <div className="chart-controls">
//             <select
//               value={selectedTimeRange}
//               onChange={(e) => setSelectedTimeRange(e.target.value)}
//               className="time-range-select"
//             >
//               <option value="Hour">Hour</option>
//               <option value="Day">Day</option>
//               <option value="Week">Week</option>
//             </select>
//           </div>
//         </div>

//         <ResponsiveContainer width="100%" height={200} className="chart-responsive-container">
//           <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//             <defs>
//               <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.3}/>
//                 <stop offset="95%" stopColor="#0d6efd" stopOpacity={0}/>
//               </linearGradient>
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//             <XAxis
//               dataKey="time"
//               tick={{ fontSize: 12 }}
//               axisLine={{ stroke: '#e0e0e0' }}
//               interval={0}
//             />
//             <YAxis
//               domain={[0, 50]}
//               ticks={[0, 10, 20, 30, 40, 50]}
//               tick={{ fontSize: 12 }}
//               axisLine={{ stroke: '#e0e0e0' }}
//             />
//             <Tooltip
//               formatter={(value) => [`${parseFloat(value).toFixed(1)} ${unit}`, title]}
//               labelFormatter={(value) => `Time: ${value}`}
//               labelStyle={{ color: '#333' }}
//               contentStyle={{
//                 backgroundColor: '#fff',
//                 border: '1px solid #ddd',
//                 borderRadius: '4px'
//               }}
//             />
//             <Line
//               type="monotone"
//               dataKey={metric}
//               stroke="#0d6efd"
//               strokeWidth={2.5}
//               dot={false}
//               activeDot={{ r: 6, stroke: '#0d6efd', fill: '#fff', strokeWidth: 2 }}
//               fillOpacity={1}
//               fill="url(#colorGradient)"
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     );
//   };

//   const hasAnyData = Object.values(chartData).some(generatorData => generatorData.length > 0);

//   return (
//     <div className="device-info-card charts-container">
//       <div>
//         <h3 className="section-title charts-section-title">
//           Sensor Data:
//         </h3>

//         {error && (
//           <div className="error-container" style={{
//             marginBottom: '20px',
//             padding: '15px',
//             backgroundColor: '#fef2f2',
//             border: '1px solid #fecaca',
//             borderRadius: '4px'
//           }}>
//             <p className="error-message" style={{ color: '#dc2626', fontSize: '14px', margin: '0' }}>
//               ❌ Database Error: {error}
//             </p>
//           </div>
//         )}

//         {!error && !hasAnyData && (
//           <div style={{
//             marginBottom: '20px',
//             padding: '15px',
//             backgroundColor: '#fef3c7',
//             border: '1px solid #f59e0b',
//             borderRadius: '4px'
//           }}>
//             <p style={{ color: '#92400e', fontSize: '14px', margin: '0' }}>
//               ⚠️ No sensor data found in database for device ID: {deviceId}
//             </p>
//             <p style={{ color: '#78350f', fontSize: '12px', margin: '8px 0 0 0' }}>
//               The device may be new or not logging data yet. Check your data collection.
//             </p>
//           </div>
//         )}

//         <div className="generator-selection">
//           {/* Generator buttons are hidden as per the visual target */}
//         </div>

//         <div className="charts-grid">
//           {renderChart('flowRate')}
//           {renderChart('pressure')}
//           {/* Other charts are hidden to match the visual target */}
//         </div>
        
//         {/* Database info banner is hidden to match the visual target */}
//       </div>
//     </div>
//   );
// };

// export default DataChart;

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import "./DataChart.css";

const DataChart = ({ deviceId }) => {
  const [chartData, setChartData] = useState({
    nb: [],
    ozone: [],
    oxygen: []
  });
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Hour');
  const [selectedGenerator, setSelectedGenerator] = useState('nb');
  
  // NEW STATES FOR TEMPORARY INCREMENTAL VALUES
  const [startTime] = useState(Date.now());
  const [flowRateBase] = useState(520); // Base value for flow rate
  const [pressureBase] = useState(4.0); // Base value for pressure

  useEffect(() => {
    const generateTemporaryData = () => {
      try {
        setError(null);

        const now = new Date();
        const startTime = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour before
        const timeLabels = [];
        
        // Generate 7 time points over the last hour
        for (let i = 0; i < 7; i++) {
          const timePoint = new Date(startTime.getTime() + i * 10 * 60 * 1000); // Every 10 minutes
          timeLabels.push(timePoint.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }));
        }

        const generators = {
          nb: [],
          ozone: [],
          oxygen: []
        };

        // Generate incremental data for each time point
        timeLabels.forEach((timeStr, index) => {
          const elapsedMinutes = index * 10; // Minutes elapsed from start
          
          // Flow Rate: starts at ~520, gradually increases with small variations
          const flowRateIncrement = (elapsedMinutes * 0.5) + (Math.random() * 6 - 3); // +0.5 per minute ± 3
          const currentFlowRate = flowRateBase + flowRateIncrement;
          
          // Pressure: starts at ~4.0, slight variations but mostly stable
          const pressureVariation = (Math.random() * 0.4 - 0.2); // ± 0.2 bar variation
          const currentPressure = pressureBase + pressureVariation;

          const dataPoint = {
            time: timeStr,
            timeValue: timeStr,
            flowRate: Math.max(500, currentFlowRate), // Minimum 500 L/min
            pressure: Math.max(3.5, Math.min(5.0, currentPressure)), // Between 3.5-5.0 bar
            waterTemperature: 25 + (Math.random() * 5), // 25-30°C
            systemTemperature: 30 + (Math.random() * 10), // 30-40°C
            totalWaterOutlet: 1000 + (elapsedMinutes * 2), // Increments by 2 per minute
            powerStatus: true,
            timestamp: new Date(startTime.getTime() + index * 10 * 60 * 1000)
          };

          generators.nb.push(dataPoint);
          generators.ozone.push({ ...dataPoint }); // Copy for other generators
          generators.oxygen.push({ ...dataPoint });
        });

        console.log('Generated temporary incremental data:', generators.nb);
        setChartData(generators);
        
      } catch (err) {
        console.error('Error generating temporary data:', err);
        setError('Failed to generate chart data');
        setChartData({ nb: [], ozone: [], oxygen: [] });
      }
    };

    if (deviceId) {
      // Generate initial data
      generateTemporaryData();
      
      // Update data every 30 seconds with incremental changes
      const interval = setInterval(() => {
        setChartData(prevData => {
          const updatedData = { ...prevData };
          
          // Update each generator's data
          Object.keys(updatedData).forEach(generatorType => {
            if (updatedData[generatorType].length > 0) {
              // Shift time points forward and add new data point
              updatedData[generatorType] = updatedData[generatorType].map((point, index) => {
                // Add small incremental changes to existing points
                const timeElapsed = (Date.now() - startTime) / (1000 * 60); // Minutes elapsed
                
                return {
                  ...point,
                  flowRate: Math.max(500, flowRateBase + (timeElapsed * 0.3) + (Math.random() * 4 - 2)),
                  pressure: Math.max(3.5, Math.min(5.0, pressureBase + (Math.random() * 0.3 - 0.15))),
                  totalWaterOutlet: 1000 + (timeElapsed * 2)
                };
              });
            }
          });
          
          return updatedData;
        });
      }, 30000); // Update every 30 seconds
      
      return () => clearInterval(interval);
    } else {
      setError('No device ID provided');
    }
  }, [deviceId, startTime, flowRateBase, pressureBase]);

  const getChartTitle = (metric) => {
    switch (metric) {
      case 'flowRate':
        return 'Water Flow Rate';
      case 'pressure':
        return 'Water Pressure';
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
      default:
        return '';
    }
  };

  const getGeneratorLabel = (type) => {
    switch (type) {
      case 'nb':
        return '';
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
              <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>Generating temporary data...</p>
            </div>
          </div>
        </div>
      );
    }

    // Get the current value for display
    const currentValue = data.length > 0 ? data[data.length - 1][metric] : 0;
    
    // Dynamic Y-axis domain based on metric
    const yAxisDomain = metric === 'flowRate' ? [500, 550] : [3, 6];
    const yAxisTicks = metric === 'flowRate' ? [500, 510, 520, 530, 540, 550] : [3, 3.5, 4, 4.5, 5, 5.5, 6];

    return (
      <div className="chart-container">
        <div className="chart-header">
          <h4 className="chart-title">
            {getGeneratorLabel(selectedGenerator)}{title}:
            <span className="chart-value">
              {currentValue?.toFixed(1)} {unit}
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
            <defs>
              <linearGradient id={`colorGradient${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0d6efd" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
              interval={0}
            />
            <YAxis
              domain={yAxisDomain}
              ticks={yAxisTicks}
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
              stroke="#0d6efd"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, stroke: '#0d6efd', fill: '#fff', strokeWidth: 2 }}
              fillOpacity={1}
              fill={`url(#colorGradient${metric})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const hasAnyData = Object.values(chartData).some(generatorData => generatorData.length > 0);

  return (
    <div className="device-info-card charts-container">
      <div>
        <h3 className="section-title charts-section-title">
          Sensor Data:
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
              ❌ Error: {error}
            </p>
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
              ⚠️ Generating temporary incremental data for device ID: {deviceId}
            </p>
            <p style={{ color: '#78350f', fontSize: '12px', margin: '8px 0 0 0' }}>
              Values will increment over time to simulate real sensor data.
            </p>
          </div>
        )}

        <div className="generator-selection">
          {/* Generator buttons are hidden as per the visual target */}
        </div>

        <div className="charts-grid">
          {renderChart('flowRate')}
          {renderChart('pressure')}
          {/* Other charts are hidden to match the visual target */}
        </div>
        
        {/* Database info banner is hidden to match the visual target */}
      </div>
    </div>
  );
};

export default DataChart;
