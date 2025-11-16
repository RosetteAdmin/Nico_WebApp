
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { 
//   faDownload, 
//   faFilePdf, 
//   faFileCsv, 
//   faArrowLeft,
//   faChevronLeft,
//   faChevronRight,
//   faFilter
// } from '@fortawesome/free-solid-svg-icons';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './LogDetails.css';

// const LogDetails = () => {
//   const { azure_device_id } = useParams();
//   const navigate = useNavigate();

//   const [logs, setLogs] = useState([]);
//   const [deviceName, setDeviceName] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [recordsPerPage] = useState(50);

//   // Filter states
//   const [showFilters, setShowFilters] = useState(false);
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [appliedFilters, setAppliedFilters] = useState({ start: '', end: '' });

//   // Fetch logs
//   const fetchLogs = async (page = 1, filters = {}) => {
//     setLoading(true);
//     setError(null);

//     try {
//       let url = `${process.env.REACT_APP_EP}/data/devices/${azure_device_id}/sensor-logs-complete?page=${page}&limit=${recordsPerPage}`;

//       if (filters.start) url += `&startDate=${filters.start}`;
//       if (filters.end) url += `&endDate=${filters.end}`;

//       const response = await fetch(url);

//       if (!response.ok) throw new Error(`HTTP ${response.status}`);

//       const data = await response.json();

//       if (data.status === 'success') {
//         setLogs(data.data.logs);
//         setDeviceName(data.data.device_name);
//         setCurrentPage(data.data.pagination.currentPage);
//         setTotalPages(data.data.pagination.totalPages);
//         setTotalRecords(data.data.pagination.totalRecords);
//       } else {
//         throw new Error(data.message || 'Failed to fetch logs');
//       }
//     } catch (err) {
//       console.error('Error fetching logs:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLogs(1, appliedFilters);
//   }, [azure_device_id]);

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       fetchLogs(newPage, appliedFilters);
//     }
//   };

//   // Apply filters
//   const handleApplyFilters = () => {
//     const filters = { start: startDate, end: endDate };
//     setAppliedFilters(filters);
//     fetchLogs(1, filters);
//     setShowFilters(false);
//   };

//   // Clear filters
//   const handleClearFilters = () => {
//     setStartDate('');
//     setEndDate('');
//     setAppliedFilters({ start: '', end: '' });
//     fetchLogs(1, {});
//     setShowFilters(false);
//   };

//   // Export to CSV
//   const exportToCSV = () => {
//     const headers = [
//       'Date',
//       'Time',
//       'Water Flow (L/min)',
//       'Water Pressure (bar)',
//       'Total Running Hours (H)',
//       'Total Water Outlet (L)',
//       'Status'
//     ];

//     const csvData = logs.map(log => [
//       log.date,
//       log.time,
//       (log.water_flow || 0).toFixed(2),
//       (log.water_pressure || 0).toFixed(2),
//       (log.total_running_hours || 0).toFixed(2),
//       log.total_water_outlet || 0,
//       log.alert_status === 57 ? 'ON' : 'OFF'
//     ]);

//     const csvContent = [
//       headers.join(','),
//       ...csvData.map(row => row.join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `sensor-logs-${deviceName}-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   // Export to PDF
//   const exportToPDF = () => {
//     const doc = new jsPDF();

//     // Add title
//     doc.setFontSize(16);
//     doc.text(`Sensor Logs - ${deviceName}`, 14, 15);
//     doc.setFontSize(10);
//     doc.text(`Device ID: ${azure_device_id}`, 14, 22);
//     doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

//     if (appliedFilters.start || appliedFilters.end) {
//       doc.text(
//         `Filter: ${appliedFilters.start || 'All'} to ${appliedFilters.end || 'All'}`,
//         14,
//         34
//       );
//     }

//     // Table data
//     const tableData = logs.map(log => [
//       log.date,
//       log.time,
//       (log.water_flow || 0).toFixed(2),
//       (log.water_pressure || 0).toFixed(2),
//       (log.total_running_hours || 0).toFixed(2),
//       log.total_water_outlet || 0,
//       log.alert_status === 57 ? 'ON' : 'OFF'
//     ]);

//     doc.autoTable({
//       startY: appliedFilters.start || appliedFilters.end ? 38 : 32,
//       head: [[
//         'Date',
//         'Time',
//         'Flow\n(L/min)',
//         'Pressure\n(bar)',
//         'Hours\n(H)',
//         'Outlet\n(L)',
//         'Status'
//       ]],
//       body: tableData,
//       styles: { fontSize: 8, cellPadding: 2 },
//       headStyles: { fillColor: [13, 110, 253], fontSize: 9 },
//       columnStyles: {
//         0: { cellWidth: 28 },
//         1: { cellWidth: 22 },
//         2: { cellWidth: 20 },
//         3: { cellWidth: 22 },
//         4: { cellWidth: 18 },
//         5: { cellWidth: 20 },
//         6: { cellWidth: 18 }
//       }
//     });

//     doc.save(`sensor-logs-${deviceName}-${new Date().toISOString().split('T')[0]}.pdf`);
//   };

//   // Render pagination
//   const renderPagination = () => {
//     const pages = [];
//     const maxVisible = 5;
//     let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisible - 1);

//     if (endPage - startPage < maxVisible - 1) {
//       startPage = Math.max(1, endPage - maxVisible + 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(
//         <button
//           key={i}
//           className={`pagination-number ${i === currentPage ? 'active' : ''}`}
//           onClick={() => handlePageChange(i)}
//         >
//           {i}
//         </button>
//       );
//     }

//     return pages;
//   };

//   return (
//     <div className="log-details-container">
//       {/* Header */}
//       <div className="log-details-header">
//         <div className="header-left">
//           <button className="back-btn" onClick={() => navigate(`/device/${azure_device_id}`)}>
//             <FontAwesomeIcon icon={faArrowLeft} /> Back to Device
//           </button>
//           <div className="header-titles">
//             <h2>Sensor Data Logs</h2>
//             <p className="device-info-text">
//               {deviceName} | {azure_device_id}
//             </p>
//           </div>
//         </div>

//         <div className="header-actions">
//           <button 
//             className="filter-btn"
//             onClick={() => setShowFilters(!showFilters)}
//           >
//             <FontAwesomeIcon icon={faFilter} /> Filter
//           </button>
//           <button className="export-btn csv-btn" onClick={exportToCSV}>
//             <FontAwesomeIcon icon={faFileCsv} /> Export CSV
//           </button>
//           <button className="export-btn pdf-btn" onClick={exportToPDF}>
//             <FontAwesomeIcon icon={faFilePdf} /> Export PDF
//           </button>
//         </div>
//       </div>

//       {/* Filter Panel */}
//       {showFilters && (
//         <div className="filter-panel">
//           <div className="filter-inputs">
//             <div className="filter-group">
//               <label>Start Date:</label>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="date-input"
//               />
//             </div>
//             <div className="filter-group">
//               <label>End Date:</label>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="date-input"
//               />
//             </div>
//           </div>
//           <div className="filter-actions">
//             <button className="apply-filter-btn" onClick={handleApplyFilters}>
//               Apply Filter
//             </button>
//             <button className="clear-filter-btn" onClick={handleClearFilters}>
//               Clear
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Records Info */}
//       <div className="records-info">
//         <p>
//           Showing {logs.length} of {totalRecords} records
//           {appliedFilters.start || appliedFilters.end ? (
//             <span className="filter-indicator">
//               {' '}(Filtered: {appliedFilters.start || 'All'} to {appliedFilters.end || 'All'})
//             </span>
//           ) : null}
//         </p>
//       </div>

//       {/* Logs Table */}
//       <div className="logs-table-container">
//         {loading ? (
//           <div className="loading-state">Loading logs...</div>
//         ) : error ? (
//           <div className="error-state">Error: {error}</div>
//         ) : logs.length === 0 ? (
//           <div className="empty-state">No logs found</div>
//         ) : (
//           <table className="logs-table">
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Time</th>
//                 <th>Water Flow<br/>(L/min)</th>
//                 <th>Water Pressure<br/>(bar)</th>
//                 <th>Total Running Hours<br/>(H)</th>
//                 <th>Total Water Outlet<br/>(L)</th>
//                 {/* <th>Status</th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {logs.map((log, index) => (
//                 <tr key={index}>
//                   <td>{log.date}</td>
//                   <td>{log.time}</td>
//                   <td>{(log.water_flow || 0).toFixed(2)}</td>
//                   <td>{(log.water_pressure || 0).toFixed(2)}</td>
//                   <td>{(log.total_running_hours || 0).toFixed(2)}</td>
//                   <td>{log.total_water_outlet || 0}</td>
//                   <td>
//                     {/* <span className={`status-badge ${log.alert_status === 57 ? 'status-on' : 'status-off'}`}>
//                       {log.alert_status === 57 ? 'ON' : 'OFF'}
//                     </span> */}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Pagination */}
//       {!loading && !error && totalPages > 1 && (
//         <div className="pagination-container">
//           <button
//             className="pagination-btn"
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             <FontAwesomeIcon icon={faChevronLeft} /> Previous
//           </button>

//           <div className="pagination-numbers">
//             {renderPagination()}
//           </div>

//           <button
//             className="pagination-btn"
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Next <FontAwesomeIcon icon={faChevronRight} />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LogDetails;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload, 
  faFilePdf, 
  faFileCsv, 
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
  faFilter,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './LogDetails.css';

const LogDetails = () => {
  const { azure_device_id } = useParams();
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [deviceName, setDeviceName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [recordsPerPage] = useState(50);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ start: '', end: '' });
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Graph states
  const [showGraph, setShowGraph] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [graphLoading, setGraphLoading] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState({
  waterFlow: true,
  waterPressure: true,
  runningHours: true,
  waterOutlet: true
});

  // Metric configurations
  const metrics = {
    waterFlow: {
      key: 'water_flow',
      name: 'Water Flow',
      color: '#3b82f6',
      unit: 'L/min',
      yAxisId: 'waterFlow'
    },
    waterPressure: {
      key: 'water_pressure',
      name: 'Water Pressure',
      color: '#10b981',
      unit: 'bar',
      yAxisId: 'waterPressure'
    },
    runningHours: {
      key: 'total_running_hours',
      name: 'Total Running Hours',
      color: '#f59e0b',
      unit: 'H',
      yAxisId: 'runningHours'
    },
    waterOutlet: {
      key: 'total_water_outlet',
      name: 'Total Water Outlet',
      color: '#ef4444',
      unit: 'L',
      yAxisId: 'waterOutlet'
    }
  };

  // Update URL with current filter state
  const updateURL = (filters, shouldShowGraph = false) => {
    const params = new URLSearchParams();
    if (filters.start) params.set('start', filters.start);
    if (filters.end) params.set('end', filters.end);
    if (shouldShowGraph) params.set('graph', 'true');
    
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newURL);
  };

  // Fetch logs
  const fetchLogs = async (page = 1, filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      let url = `${process.env.REACT_APP_EP}/data/devices/${azure_device_id}/sensor-logs-complete?page=${page}&limit=${recordsPerPage}`;

      if (filters.start) url += `&startDate=${filters.start}`;
      if (filters.end) url += `&endDate=${filters.end}`;

      const response = await fetch(url);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      if (data.status === 'success') {
        setLogs(data.data.logs);
        setDeviceName(data.data.device_name);
        setCurrentPage(data.data.pagination.currentPage);
        setTotalPages(data.data.pagination.totalPages);
        setTotalRecords(data.data.pagination.totalRecords);
      } else {
        throw new Error(data.message || 'Failed to fetch logs');
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all filtered logs for export/graph
  const fetchAllFilteredLogs = async () => {
    try {
      const allLogs = [];
      let page = 1;
      let totalPages = 1;

      // Fetch first page to get total pages
      let url = `${process.env.REACT_APP_EP}/data/devices/${azure_device_id}/sensor-logs-complete?page=${page}&limit=1000`;
      
      if (appliedFilters.start) url += `&startDate=${appliedFilters.start}`;
      if (appliedFilters.end) url += `&endDate=${appliedFilters.end}`;

      const firstResponse = await fetch(url);
      if (!firstResponse.ok) throw new Error(`HTTP ${firstResponse.status}`);
      
      const firstData = await firstResponse.json();
      if (firstData.status === 'success') {
        allLogs.push(...firstData.data.logs);
        totalPages = firstData.data.pagination.totalPages;
      }

      // Fetch remaining pages if any
      for (page = 2; page <= totalPages; page++) {
        let pageUrl = `${process.env.REACT_APP_EP}/data/devices/${azure_device_id}/sensor-logs-complete?page=${page}&limit=1000`;
        
        if (appliedFilters.start) pageUrl += `&startDate=${appliedFilters.start}`;
        if (appliedFilters.end) pageUrl += `&endDate=${appliedFilters.end}`;

        const response = await fetch(pageUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        if (data.status === 'success') {
          allLogs.push(...data.data.logs);
        }
      }

      return allLogs;
    } catch (err) {
      console.error('Error fetching all logs:', err);
      throw err;
    }
  };

  // Calculate date range in days
  const getDateRangeInDays = () => {
    if (!appliedFilters.start || !appliedFilters.end) return 0;
    
    const start = new Date(appliedFilters.start);
    const end = new Date(appliedFilters.end);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Group logs by hour for single day view
  const groupByHour = (logs) => {
    const hourlyData = {};
    
    logs.forEach(log => {
      const hour = log.time.split(':')[0];
      const hourKey = `${hour}:00`;
      
      if (!hourlyData[hourKey]) {
        hourlyData[hourKey] = {
          count: 0,
          water_flow: 0,
          water_pressure: 0,
          total_running_hours: 0,
          total_water_outlet: 0
        };
      }
      
      hourlyData[hourKey].count++;
      hourlyData[hourKey].water_flow += parseFloat(log.water_flow || 0);
      hourlyData[hourKey].water_pressure += parseFloat(log.water_pressure || 0);
      hourlyData[hourKey].total_running_hours += parseFloat(log.total_running_hours || 0);
      hourlyData[hourKey].total_water_outlet += parseFloat(log.total_water_outlet || 0);
    });
    
    // Calculate averages and return sorted by hour
    return Object.keys(hourlyData)
      .sort()
      .map(hour => ({
        displayTime: hour,
        timestamp: hour,
        water_flow: parseFloat((hourlyData[hour].water_flow / hourlyData[hour].count).toFixed(2)),
        water_pressure: parseFloat((hourlyData[hour].water_pressure / hourlyData[hour].count).toFixed(2)),
        total_running_hours: parseFloat((hourlyData[hour].total_running_hours / hourlyData[hour].count).toFixed(2)),
        total_water_outlet: parseFloat((hourlyData[hour].total_water_outlet / hourlyData[hour].count).toFixed(0))
      }));
  };

  // Group logs by day for multi-day view
  const groupByDay = (logs) => {
    const dailyData = {};
    
    logs.forEach(log => {
      const date = log.date;
      
      if (!dailyData[date]) {
        dailyData[date] = {
          count: 0,
          water_flow: 0,
          water_pressure: 0,
          total_running_hours: 0,
          total_water_outlet: 0
        };
      }
      
      dailyData[date].count++;
      dailyData[date].water_flow += parseFloat(log.water_flow || 0);
      dailyData[date].water_pressure += parseFloat(log.water_pressure || 0);
      dailyData[date].total_running_hours += parseFloat(log.total_running_hours || 0);
      dailyData[date].total_water_outlet += parseFloat(log.total_water_outlet || 0);
    });
    
    // Calculate averages and format date as DD-MMM (e.g., 09-Oct)
    return Object.keys(dailyData)
      .sort()
      .map(date => {
        const dateObj = new Date(date);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const monthShort = dateObj.toLocaleDateString('en-US', { month: 'short' });
        
        return {
          displayTime: `${day}-${monthShort}`,
          timestamp: date,
          water_flow: parseFloat((dailyData[date].water_flow / dailyData[date].count).toFixed(2)),
          water_pressure: parseFloat((dailyData[date].water_pressure / dailyData[date].count).toFixed(2)),
          total_running_hours: parseFloat((dailyData[date].total_running_hours / dailyData[date].count).toFixed(2)),
          total_water_outlet: parseFloat((dailyData[date].total_water_outlet / dailyData[date].count).toFixed(0))
        };
      });
  };

  // Process data for graph
  const processGraphData = (allLogs) => {
    const dateRange = getDateRangeInDays();
    
    // Single day or same day - show hourly data
    if (dateRange <= 1) {
      return groupByHour(allLogs);
    }
    // Multiple days - show daily averages
    else {
      return groupByDay(allLogs);
    }
  };

  // Load graph data
  const handleShowGraph = async () => {
    setGraphLoading(true);
    try {
      const allLogs = await fetchAllFilteredLogs();
      const processedData = processGraphData(allLogs);
      setGraphData(processedData);
      setShowGraph(true);
      // Update URL to include graph parameter
      updateURL(appliedFilters, true);
    } catch (err) {
      alert('Failed to load graph data: ' + err.message);
    } finally {
      setGraphLoading(false);
    }
  };

  // Load filters and graph from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const startParam = params.get('start');
    const endParam = params.get('end');
    const graphParam = params.get('graph');
    
    if (startParam || endParam) {
      setStartDate(startParam || '');
      setEndDate(endParam || '');
      const filters = { start: startParam || '', end: endParam || '' };
      setAppliedFilters(filters);
      setIsFilterApplied(true);
      fetchLogs(1, filters);
      
      // If graph parameter exists, load graph data
      if (graphParam === 'true') {
        loadGraphDataAfterMount(filters);
      }
    } else {
      fetchLogs(1, appliedFilters);
    }
  }, [azure_device_id]);

  // Helper function to load graph data after component mounts
  const loadGraphDataAfterMount = async (filters) => {
    setGraphLoading(true);
    try {
      // Need to fetch all logs with the filters
      const allLogs = await fetchAllLogsWithFilters(filters);
      const processedData = processGraphDataWithFilters(allLogs, filters);
      setGraphData(processedData);
      setShowGraph(true);
    } catch (err) {
      console.error('Failed to load graph data:', err);
    } finally {
      setGraphLoading(false);
    }
  };

  // Fetch all logs with specific filters (for initial graph load)
  const fetchAllLogsWithFilters = async (filters) => {
    try {
      const allLogs = [];
      let page = 1;
      let totalPages = 1;

      let url = `${process.env.REACT_APP_EP}/data/devices/${azure_device_id}/sensor-logs-complete?page=${page}&limit=1000`;
      
      if (filters.start) url += `&startDate=${filters.start}`;
      if (filters.end) url += `&endDate=${filters.end}`;

      const firstResponse = await fetch(url);
      if (!firstResponse.ok) throw new Error(`HTTP ${firstResponse.status}`);
      
      const firstData = await firstResponse.json();
      if (firstData.status === 'success') {
        allLogs.push(...firstData.data.logs);
        totalPages = firstData.data.pagination.totalPages;
      }

      for (page = 2; page <= totalPages; page++) {
        let pageUrl = `${process.env.REACT_APP_EP}/data/devices/${azure_device_id}/sensor-logs-complete?page=${page}&limit=1000`;
        
        if (filters.start) pageUrl += `&startDate=${filters.start}`;
        if (filters.end) pageUrl += `&endDate=${filters.end}`;

        const response = await fetch(pageUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        if (data.status === 'success') {
          allLogs.push(...data.data.logs);
        }
      }

      return allLogs;
    } catch (err) {
      console.error('Error fetching all logs:', err);
      throw err;
    }
  };

  // Process graph data with specific filters
  const processGraphDataWithFilters = (allLogs, filters) => {
    if (!filters.start || !filters.end) return [];
    
    const start = new Date(filters.start);
    const end = new Date(filters.end);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      return groupByHour(allLogs);
    } else {
      return groupByDay(allLogs);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchLogs(newPage, appliedFilters);
    }
  };

  // Apply filters
  const handleApplyFilters = () => {
    const filters = { start: startDate, end: endDate };
    setAppliedFilters(filters);
    setIsFilterApplied(true);
    setShowGraph(false);
    setGraphData([]);
    fetchLogs(1, filters);
    setShowFilters(false);
    // Update URL with new filters
    updateURL(filters, false);
  };

  // Clear filters
  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setAppliedFilters({ start: '', end: '' });
    setIsFilterApplied(false);
    setShowGraph(false);
    setGraphData([]);
    fetchLogs(1, {});
    setShowFilters(false);
    // Clear URL parameters
    window.history.replaceState({}, '', window.location.pathname);
  };

  // Export to CSV
  const exportToCSV = async () => {
    setExportLoading(true);
    try {
      const allLogs = await fetchAllFilteredLogs();
      
      const headers = [
        'Date',
        'Time',
        'Water Flow (L/min)',
        'Water Pressure (bar)',
        'Total Running Hours (H)',
        'Total Water Outlet (L)',
        'Status'
      ];

      const csvData = allLogs.map(log => [
        log.date,
        log.time,
        (log.water_flow || 0).toFixed(2),
        (log.water_pressure || 0).toFixed(2),
        (log.total_running_hours || 0).toFixed(2),
        log.total_water_outlet || 0,
        log.alert_status === 57 ? 'ON' : 'OFF'
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sensor-logs-${deviceName}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export CSV: ' + err.message);
    } finally {
      setExportLoading(false);
    }
  };

  // Export to PDF
  const exportToPDF = async () => {
    setExportLoading(true);
    try {
      const allLogs = await fetchAllFilteredLogs();
      
      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text(`Sensor Logs - ${deviceName}`, 14, 15);
      doc.setFontSize(10);
      doc.text(`Device ID: ${azure_device_id}`, 14, 22);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

      if (appliedFilters.start || appliedFilters.end) {
        doc.text(
          `Filter: ${appliedFilters.start || 'All'} to ${appliedFilters.end || 'All'}`,
          14,
          34
        );
      }

      doc.text(`Total Records: ${allLogs.length}`, 14, 40);

      const tableData = allLogs.map(log => [
        log.date,
        log.time,
        (log.water_flow || 0).toFixed(2),
        (log.water_pressure || 0).toFixed(2),
        (log.total_running_hours || 0).toFixed(2),
        log.total_water_outlet || 0,
        log.alert_status === 57 ? 'ON' : 'OFF'
      ]);

      doc.autoTable({
        startY: 44,
        head: [[
          'Date',
          'Time',
          'Flow\n(L/min)',
          'Pressure\n(bar)',
          'Hours\n(H)',
          'Outlet\n(L)',
          'Status'
        ]],
        body: tableData,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [13, 110, 253], fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 28 },
          1: { cellWidth: 22 },
          2: { cellWidth: 20 },
          3: { cellWidth: 22 },
          4: { cellWidth: 18 },
          5: { cellWidth: 20 },
          6: { cellWidth: 18 }
        }
      });

      doc.save(`sensor-logs-${deviceName}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      alert('Failed to export PDF: ' + err.message);
    } finally {
      setExportLoading(false);
    }
  };

  // Custom tooltip for graph
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-time">{payload[0].payload.timestamp}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value} {entry.unit}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render graph based on selected metric
  // Render graph based on selected metrics
const renderGraph = () => {
  if (graphData.length === 0) return null;

  const dateRange = getDateRangeInDays();
  const isSingleDay = dateRange <= 1;

  // Filter metrics based on checkbox selection
  const metricsToShow = Object.values(metrics).filter(
    metric => selectedMetrics[metric.yAxisId]
  );

  // If no metrics selected, show message
  if (metricsToShow.length === 0) {
    return (
      <div className="graph-section">
        <div className="graph-header">
          <h3>
            <FontAwesomeIcon icon={faChartLine} /> Sensor Data Graph
          </h3>
          <div className="graph-controls metric-checkboxes">
            <label className="metric-checkbox-label">
              <input
                type="checkbox"
                checked={selectedMetrics.waterFlow}
                onChange={(e) => setSelectedMetrics(prev => ({
                  ...prev,
                  waterFlow: e.target.checked
                }))}
              />
              <span style={{ color: metrics.waterFlow.color }}>Water Flow</span>
            </label>
            <label className="metric-checkbox-label">
              <input
                type="checkbox"
                checked={selectedMetrics.waterPressure}
                onChange={(e) => setSelectedMetrics(prev => ({
                  ...prev,
                  waterPressure: e.target.checked
                }))}
              />
              <span style={{ color: metrics.waterPressure.color }}>Water Pressure</span>
            </label>
            <label className="metric-checkbox-label">
              <input
                type="checkbox"
                checked={selectedMetrics.runningHours}
                onChange={(e) => setSelectedMetrics(prev => ({
                  ...prev,
                  runningHours: e.target.checked
                }))}
              />
              <span style={{ color: metrics.runningHours.color }}>Running Hours</span>
            </label>
            <label className="metric-checkbox-label">
              <input
                type="checkbox"
                checked={selectedMetrics.waterOutlet}
                onChange={(e) => setSelectedMetrics(prev => ({
                  ...prev,
                  waterOutlet: e.target.checked
                }))}
              />
              <span style={{ color: metrics.waterOutlet.color }}>Water Outlet</span>
            </label>
          </div>
        </div>
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <p style={{ fontSize: '16px', color: '#666' }}>
            Please select at least one metric to display the graph
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="graph-section">
      <div className="graph-header">
        <h3>
          <FontAwesomeIcon icon={faChartLine} /> Sensor Data Graph
          <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px' }}>
            ({isSingleDay ? 'Hourly Average' : 'Daily Average'})
          </span>
        </h3>
        <div className="graph-controls metric-checkboxes">
          <label className="metric-checkbox-label">
            <input
              type="checkbox"
              checked={selectedMetrics.waterFlow}
              onChange={(e) => setSelectedMetrics(prev => ({
                ...prev,
                waterFlow: e.target.checked
              }))}
            />
            <span style={{ color: metrics.waterFlow.color }}>Water Flow</span>
          </label>
          <label className="metric-checkbox-label">
            <input
              type="checkbox"
              checked={selectedMetrics.waterPressure}
              onChange={(e) => setSelectedMetrics(prev => ({
                ...prev,
                waterPressure: e.target.checked
              }))}
            />
            <span style={{ color: metrics.waterPressure.color }}>Water Pressure</span>
          </label>
          <label className="metric-checkbox-label">
            <input
              type="checkbox"
              checked={selectedMetrics.runningHours}
              onChange={(e) => setSelectedMetrics(prev => ({
                ...prev,
                runningHours: e.target.checked
              }))}
            />
            <span style={{ color: metrics.runningHours.color }}>Running Hours</span>
          </label>
          <label className="metric-checkbox-label">
            <input
              type="checkbox"
              checked={selectedMetrics.waterOutlet}
              onChange={(e) => setSelectedMetrics(prev => ({
                ...prev,
                waterOutlet: e.target.checked
              }))}
            />
            <span style={{ color: metrics.waterOutlet.color }}>Water Outlet</span>
          </label>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <LineChart 
          data={graphData} 
          margin={{ top: 20, right: 80, left: 80, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="displayTime" 
            angle={-45}
            textAnchor="end"
            height={80}
            interval={Math.ceil(graphData.length / 15)}
            tick={{ fontSize: 11 }}
            label={{ 
              value: isSingleDay ? 'Hour of Day' : 'Date', 
              position: 'insideBottom', 
              offset: -10,
              style: { fontSize: 12, fontWeight: 'bold' }
            }}
          />
          
          {/* Render Y-axes only for selected metrics */}
          {selectedMetrics.waterFlow && (
            <YAxis 
              yAxisId="waterFlow" 
              orientation="left"
              stroke={metrics.waterFlow.color}
              tick={{ fontSize: 9 }}
              width={70}
            />
          )}
          {selectedMetrics.waterPressure && (
            <YAxis 
              yAxisId="waterPressure" 
              orientation="right"
              stroke={metrics.waterPressure.color}
              tick={{ fontSize: 9 }}
              width={70}
            />
          )}
          {selectedMetrics.runningHours && (
            <YAxis 
              yAxisId="runningHours" 
              orientation="left"
              stroke={metrics.runningHours.color}
              tick={{ fontSize: 9 }}
              width={70}
            />
          )}
          {selectedMetrics.waterOutlet && (
            <YAxis 
              yAxisId="waterOutlet" 
              orientation="right"
              stroke={metrics.waterOutlet.color}
              tick={{ fontSize: 9 }}
              width={70}
            />
          )}

          {/* Render lines only for selected metrics */}
          {metricsToShow.map((metric) => (
            <Line
              key={metric.yAxisId}
              type="monotone"
              dataKey={metric.key}
              stroke={metric.color}
              name={metric.name}
              yAxisId={metric.yAxisId}
              unit={` ${metric.unit}`}
              dot={isSingleDay ? { r: 3 } : false}
              strokeWidth={2}
              activeDot={{ r: 5 }}
            />
          ))}

          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top"
            height={36}
            iconType="line"
            wrapperStyle={{ paddingBottom: '10px' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

  // Render pagination
  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-number ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="log-details-container">
      <div className="log-details-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate(`/device/${azure_device_id}`)}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Device
          </button>
          <div className="header-titles">
            <h2>Sensor Data Logs</h2>
            <p className="device-info-text">
              {deviceName} | {azure_device_id}
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button 
            className="filter-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FontAwesomeIcon icon={faFilter} /> Filter
          </button>
          {isFilterApplied && (
            <>
              <button 
                className="graph-btn" 
                onClick={handleShowGraph}
                disabled={graphLoading}
              >
                <FontAwesomeIcon icon={faChartLine} /> 
                {graphLoading ? 'Loading...' : showGraph ? 'Refresh Graph' : 'Show Graph'}
              </button>
              <button 
                className="export-btn csv-btn" 
                onClick={exportToCSV}
                disabled={exportLoading}
              >
                <FontAwesomeIcon icon={faFileCsv} /> 
                {exportLoading ? 'Exporting...' : 'Export CSV'}
              </button>
              <button 
                className="export-btn pdf-btn" 
                onClick={exportToPDF}
                disabled={exportLoading}
              >
                <FontAwesomeIcon icon={faFilePdf} /> 
                {exportLoading ? 'Exporting...' : 'Export PDF'}
              </button>
            </>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-inputs">
            <div className="filter-group">
              <label>Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
              />
            </div>
            <div className="filter-group">
              <label>End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
              />
            </div>
          </div>
          <div className="filter-actions">
            <button className="apply-filter-btn" onClick={handleApplyFilters}>
              Apply Filter
            </button>
            <button className="clear-filter-btn" onClick={handleClearFilters}>
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="records-info">
        <p>
          Showing {logs.length} of {totalRecords} records
          {appliedFilters.start || appliedFilters.end ? (
            <span className="filter-indicator">
              {' '}(Filtered: {appliedFilters.start || 'All'} to {appliedFilters.end || 'All'})
            </span>
          ) : null}
        </p>
      </div>

      {showGraph && renderGraph()}

      <div className="logs-table-container">
        {loading ? (
          <div className="loading-state">Loading logs...</div>
        ) : error ? (
          <div className="error-state">Error: {error}</div>
        ) : logs.length === 0 ? (
          <div className="empty-state">No logs found</div>
        ) : (
          <table className="logs-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Water Flow<br/>(L/min)</th>
                <th>Water Pressure<br/>(bar)</th>
                <th>Pump Motor Frequency</th>
                <th>Pump Motor Current</th>
                <th>Total Running Hours<br/>(H)</th>
                <th>Total Water Outlet<br/>(L)</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td>{log.date}</td>
                  <td>{log.time}</td>
                  <td>{(log.water_flow || 0).toFixed(2)}</td>
                  <td>{(log.water_pressure || 0).toFixed(2)}</td>
                  <td>{log.pump_motor_frequency || 0}</td>
                  <td>{log.pump_motor_current || 0}</td>
                  <td>{(log.total_running_hours || 0).toFixed(2)}</td>
                  <td>{log.total_water_outlet || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && !error && totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faChevronLeft} /> Previous
          </button>

          <div className="pagination-numbers">
            {renderPagination()}
          </div>

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LogDetails;