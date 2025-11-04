// import React, { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const totalCharts = 4; // Flow Rate, Pressure, Total Water Outlet, Total Running Hours

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
//       const startTime = new Date(now.getTime() - 60 * 60 * 1000); // 60 minutes before to end at "now"
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
//           totalWaterOutlet: parseFloat(record.totalWaterOutlet) || 0,
//           totalRunningHours: parseFloat(record.totalRunningHours) || 0,
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
//       case 'totalWaterOutlet':
//         return 'Total Water Outlet';
//       case 'totalRunningHours':
//         return 'Total Running Hours';
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
//       case 'totalWaterOutlet':
//         return 'L';
//       case 'totalRunningHours':
//         return 'hrs';
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

//   const getYAxisDomain = (metric) => {
//     switch (metric) {
//       case 'flowRate':
//         return [0, 50];
//       case 'pressure':
//         return [0, 10];
//       case 'totalWaterOutlet':
//         return [0, 1000];
//       case 'totalRunningHours':
//         return [0, 100];
//       default:
//         return [0, 50];
//     }
//   };

//   const getYAxisTicks = (metric) => {
//     switch (metric) {
//       case 'flowRate':
//         return [0, 10, 20, 30, 40, 50];
//       case 'pressure':
//         return [0, 2, 4, 6, 8, 10];
//       case 'totalWaterOutlet':
//         return [0, 200, 400, 600, 800, 1000];
//       case 'totalRunningHours':
//         return [0, 20, 40, 60, 80, 100];
//       default:
//         return [0, 10, 20, 30, 40, 50];
//     }
//   };

//   const handlePrevSlide = () => {
//     setCurrentSlide((prev) => (prev === 0 ? totalCharts - 1 : prev - 1));
//   };

//   const handleNextSlide = () => {
//     setCurrentSlide((prev) => (prev === totalCharts - 1 ? 0 : prev + 1));
//   };

//   const goToSlide = (index) => {
//     setCurrentSlide(index);
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
//             {getGeneratorLabel(selectedGenerator)} {title}:
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
//               <linearGradient id={`colorGradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
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
//             {/* <YAxis
//               domain={getYAxisDomain(metric)}
//               ticks={getYAxisTicks(metric)}
//               tick={{ fontSize: 12 }}
//               axisLine={{ stroke: '#e0e0e0' }}
//             /> */}
//             <YAxis
//               domain={getYAxisDomain(metric)}
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
//               fill={`url(#colorGradient-${metric})`}
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

//         {/* Carousel Wrapper */}
//         <div className="carousel-wrapper">
//           <button className="carousel-btn carousel-btn-prev" onClick={handlePrevSlide}>
//             ‹
//           </button>

//           <div className="charts-carousel">
//             <div 
//               className="charts-carousel-track" 
//               style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//             >
//               {/* Slide 1: Flow Rate */}
//               <div className="carousel-slide">
//                 {renderChart('flowRate')}
//               </div>

//               {/* Slide 2: Pressure */}
//               <div className="carousel-slide">
//                 {renderChart('pressure')}
//               </div>

//               {/* Slide 3: Total Water Outlet */}
//               <div className="carousel-slide">
//                 {renderChart('totalWaterOutlet')}
//               </div>

//               {/* Slide 4: Total Running Hours */}
//               <div className="carousel-slide">
//                 {renderChart('totalRunningHours')}
//               </div>
//             </div>
//           </div>

//           <button className="carousel-btn carousel-btn-next" onClick={handleNextSlide}>
//             ›
//           </button>
//         </div>

//         {/* Carousel Indicators (Dots) */}
//         <div className="carousel-indicators">
//           {[...Array(totalCharts)].map((_, index) => (
//             <button
//               key={index}
//               className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
//               onClick={() => goToSlide(index)}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataChart;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {faEllipsisV  } from "@fortawesome/free-solid-svg-icons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const totalCharts = 4; // Flow Rate, Pressure, Total Water Outlet, Total Running Hours

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setError(null);

        if (!process.env.REACT_APP_EP) {
          throw new Error('Backend URL not configured. Check REACT_APP_EP environment variable.');
        }

        if (!deviceId || deviceId === 'undefined') {
          throw new Error('Invalid device ID provided.');
        }

        // Add timeRange parameter to API call
        const apiUrl = `${process.env.REACT_APP_EP}/data/devices/${deviceId}/generator-logs?timeRange=${selectedTimeRange}&ts=${Date.now()}`;
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
      }
    };

    if (deviceId) {
      fetchChartData();
      const interval = setInterval(fetchChartData, 5000);
      return () => clearInterval(interval);
    } else {
      setError('No device ID provided');
    }
  }, [deviceId, selectedTimeRange]); // Added selectedTimeRange to dependencies

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

    const generateTimePoints = () => {
      const now = new Date();
      let startTime, interval, pointsCount;

      // Configure based on selected time range
      switch (selectedTimeRange) {
        case 'Hour':
          startTime = new Date(now.getTime() - 60 * 60 * 1000); // 60 minutes ago
          interval = 10 * 60 * 1000; // 10 minutes
          pointsCount = 7;
          break;
        case 'Day':
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
          interval = 4 * 60 * 60 * 1000; // 4 hours
          pointsCount = 7;
          break;
        case 'Week':
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
          interval = 24 * 60 * 60 * 1000; // 1 day
          pointsCount = 8;
          break;
        default:
          startTime = new Date(now.getTime() - 60 * 60 * 1000);
          interval = 10 * 60 * 1000;
          pointsCount = 7;
      }

      const timeLabels = [];
      for (let i = 0; i < pointsCount; i++) {
        const timePoint = new Date(startTime.getTime() + i * interval);
        
        // Format based on time range
        let formattedTime;
        if (selectedTimeRange === 'Hour') {
          formattedTime = timePoint.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        } else if (selectedTimeRange === 'Day') {
          formattedTime = timePoint.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        } else { // Week
          formattedTime = timePoint.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
        }
        
        timeLabels.push(formattedTime);
      }
      return timeLabels;
    };

    const timePoints = generateTimePoints();

    historyData.forEach((record, index) => {
      try {
        const timeIndex = index % timePoints.length;
        const timeStr = timePoints[timeIndex];

        const dataPoint = {
          time: timeStr,
          timeValue: timeStr,
          flowRate: parseFloat(record.waterFlow) || 0,
          pressure: parseFloat(record.waterPressure) || 0,
          waterTemperature: 0,
          systemTemperature: 0,
          totalWaterOutlet: parseFloat(record.totalWaterOutlet) || 0,
          totalRunningHours: parseFloat(record.totalRunningHours) || 0,
          powerStatus: null,
          timestamp: new Date(record.timestamp)
        };

        generators.nb.push(dataPoint);
      } catch (recordError) {
        console.error('Error processing real record:', recordError, record);
      }
    });

    Object.keys(generators).forEach(type => {
      const pointsCount = selectedTimeRange === 'Week' ? 8 : 7;
      generators[type] = generators[type]
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(-pointsCount)
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
      case 'totalWaterOutlet':
        return 'Total Water Outlet';
      case 'totalRunningHours':
        return 'Total Running Hours';
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
      case 'totalWaterOutlet':
        return 'L';
      case 'totalRunningHours':
        return 'hrs';
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

  const getYAxisDomain = (metric) => {
    switch (metric) {
      case 'flowRate':
        return [0, 50];
      case 'pressure':
        return [0, 10];
      case 'totalWaterOutlet':
        return [0, 1000];
      case 'totalRunningHours':
        return [0, 100];
      default:
        return [0, 50];
    }
  };

  const getYAxisTicks = (metric) => {
    switch (metric) {
      case 'flowRate':
        return [0, 10, 20, 30, 40, 50];
      case 'pressure':
        return [0, 2, 4, 6, 8, 10];
      case 'totalWaterOutlet':
        return [0, 200, 400, 600, 800, 1000];
      case 'totalRunningHours':
        return [0, 20, 40, 60, 80, 100];
      default:
        return [0, 10, 20, 30, 40, 50];
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalCharts - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === totalCharts - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
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
            {getGeneratorLabel(selectedGenerator)} {title}:
            <span className="chart-value">
              {data.length > 0 ? data[data.length - 1][metric]?.toFixed(1) : 0} {unit}
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
              <linearGradient id={`colorGradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
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
              angle={selectedTimeRange === 'Day' ? -45 : 0}
              textAnchor={selectedTimeRange === 'Day' ? 'end' : 'middle'}
              height={selectedTimeRange === 'Day' ? 60 : 30}
            />
            <YAxis
              domain={getYAxisDomain(metric)}
              ticks={getYAxisTicks(metric)}
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
              fill={`url(#colorGradient-${metric})`}
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
      <div className="sensor-header">
  <h2>Sensor Data:</h2>
  <button 
    className="view-logs-btn"
    onClick={() => navigate(`/device/${deviceId}/logdetails`)}
  >
    View All Sensor Logs
  </button>
</div>
<hr className="sensor-divider" />



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

        {/* Carousel Wrapper */}
        <div className="carousel-wrapper">
          <button className="carousel-btn carousel-btn-prev" onClick={handlePrevSlide}>
            ‹
          </button>

          <div className="charts-carousel">
            <div 
              className="charts-carousel-track" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {/* Slide 1: Flow Rate */}
              <div className="carousel-slide">
                {renderChart('flowRate')}
              </div>

              {/* Slide 2: Pressure */}
              <div className="carousel-slide">
                {renderChart('pressure')}
              </div>

              {/* Slide 3: Total Water Outlet */}
              <div className="carousel-slide">
                {renderChart('totalWaterOutlet')}
              </div>

              {/* Slide 4: Total Running Hours */}
              <div className="carousel-slide">
                {renderChart('totalRunningHours')}
              </div>
            </div>
          </div>

          <button className="carousel-btn carousel-btn-next" onClick={handleNextSlide}>
            ›
          </button>
        </div>

        {/* Carousel Indicators (Dots) */}
        <div className="carousel-indicators">
          {[...Array(totalCharts)].map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
     
    </div>
  );
};

export default DataChart;