// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { 
//   faFilePdf, 
//   faFileCsv, 
//   faArrowLeft,
//   faChevronLeft,
//   faChevronRight,
//   faFilter,
//   faChartLine,
//   faChevronUp,
//   faChevronDown
// } from '@fortawesome/free-solid-svg-icons';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from 'recharts';
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
//   const [isFilterApplied, setIsFilterApplied] = useState(false);
//   const [exportLoading, setExportLoading] = useState(false);

//   // Graph states
//   const [showGraph, setShowGraph] = useState(false);
//   const [graphData, setGraphData] = useState([]);
//   const [graphLoading, setGraphLoading] = useState(false);
//   const [selectedMetrics, setSelectedMetrics] = useState({
//     waterFlow: true,
//     waterPressure: true,
//     // runningHours: true,
//     // waterOutlet: true,
//     pumpMotorFrequency: false,
//     pumpMotorCurrent: false
//   });
//   const [isMetricDropdownOpen, setIsMetricDropdownOpen] = useState(false);
//   const metricDropdownRef = useRef(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (metricDropdownRef.current && !metricDropdownRef.current.contains(event.target)) {
//         setIsMetricDropdownOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Metric configurations
//   const metrics = {
//     waterFlow: {
//       key: 'water_flow',
//       name: 'Water Flow',
//       color: '#3b82f6',
//       unit: 'L/min',
//       yAxisId: 'waterFlow'
//     },
//     waterPressure: {
//       key: 'water_pressure',
//       name: 'Water Pressure',
//       color: '#10b981',
//       unit: 'bar',
//       yAxisId: 'waterPressure'
//     },
//     // runningHours: {
//     //   key: 'total_running_hours',
//     //   name: 'Total Running Hours',
//     //   color: '#f59e0b',
//     //   unit: 'H',
//     //   yAxisId: 'runningHours'
//     // },
//     // waterOutlet: {
//     //   key: 'total_water_outlet',
//     //   name: 'Total Water Outlet',
//     //   color: '#ef4444',
//     //   unit: 'L',
//     //   yAxisId: 'waterOutlet'
//     // },
//     pumpMotorFrequency: {
//       key: 'pump_motor_frequency',
//       name: 'Pump Motor Frequency',
//       color: '#8b5cf6',
//       unit: 'Hz',
//       yAxisId: 'pumpMotorFrequency'
//     },
//     pumpMotorCurrent: {
//       key: 'pump_motor_current',
//       name: 'Pump Motor Current',
//       color: '#ec4899',
//       unit: 'A',
//       yAxisId: 'pumpMotorCurrent'
//     }
//   };

//   // ============================================
//   // HELPER: Normalize filters (handle single date selection)
//   // ============================================
//   const normalizeFilters = (filters) => {
//     const normalized = { ...filters };
    
//     // If only start date is provided, use it as end date too (single day)
//     if (normalized.start && !normalized.end) {
//       normalized.end = normalized.start;
//     }
    
//     // If only end date is provided, use it as start date too (single day)
//     if (!normalized.start && normalized.end) {
//       normalized.start = normalized.end;
//     }
    
//     return normalized;
//   };

//   // Update URL with current filter state
//   const updateURL = (filters, shouldShowGraph = false) => {
//     const params = new URLSearchParams();
//     if (filters.start) params.set('start', filters.start);
//     if (filters.end) params.set('end', filters.end);
//     if (shouldShowGraph) params.set('graph', 'true');
    
//     const newURL = `${window.location.pathname}?${params.toString()}`;
//     window.history.replaceState({}, '', newURL);
//   };


  
// // Helper: Add one day to a date string (YYYY-MM-DD format)
// const addOneDay = (dateStr) => {
//   if (!dateStr) return null;
//   const date = new Date(dateStr + 'T00:00:00');
//   date.setDate(date.getDate() + 1);
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const day = date.getDate().toString().padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// // Fetch logs - Add one day to end date for API call
// const fetchLogs = async (page = 1, filters = {}) => {
//   setLoading(true);
//   setError(null);

//   try {
//     let url = `${process.env.REACT_APP_EP}/data/devices/${azure_device_id}/sensor-logs-complete?page=${page}&limit=${recordsPerPage}`;

//     if (filters.start) url += `&startDate=${filters.start}`;
    
//     // Add one day to end date to make it inclusive
//     if (filters.end) {
//       const adjustedEndDate = addOneDay(filters.end);
//       url += `&endDate=${adjustedEndDate}`;
//     } else if (filters.start && !filters.end) {
//       // Single day: add one day to start date for end date
//       const adjustedEndDate = addOneDay(filters.start);
//       url += `&endDate=${adjustedEndDate}`;
//     }

//     const response = await fetch(url);

//     if (!response.ok) throw new Error(`HTTP ${response.status}`);

//     const data = await response.json();

//     if (data.status === 'success') {
//       setLogs(data.data.logs);
//       setDeviceName(data.data.device_name);
//       setCurrentPage(data.data.pagination.currentPage);
//       setTotalPages(data.data.pagination.totalPages);
//       setTotalRecords(data.data.pagination.totalRecords);
//     } else {
//       throw new Error(data.message || 'Failed to fetch logs');
//     }
//   } catch (err) {
//     console.error('Error fetching logs:', err);
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };

// // Fetch all filtered logs for export/graph - Add one day to end date for API call
// const fetchAllFilteredLogs = async (filters = appliedFilters) => {
//   try {
//     const allLogs = [];
//     let page = 1;
//     let fetchedTotalPages = 1;

//     let url = `${process.env.REACT_APP_EP}/data/devices/${azure_device_id}/sensor-logs-complete?page=${page}&limit=1000`;
    
//     if (filters.start) url += `&startDate=${filters.start}`;
    
//     // Add one day to end date to make it inclusive
//     if (filters.end) {
//       const adjustedEndDate = addOneDay(filters.end);
//       url += `&endDate=${adjustedEndDate}`;
//     } else if (filters.start && !filters.end) {
//       // Single day: add one day to start date for end date
//       const adjustedEndDate = addOneDay(filters.start);
//       url += `&endDate=${adjustedEndDate}`;
//     }

//     const firstResponse = await fetch(url);
//     if (!firstResponse.ok) throw new Error(`HTTP ${firstResponse.status}`);
    
//     const firstData = await firstResponse.json();
//     if (firstData.status === 'success') {
//       allLogs.push(...firstData.data.logs);
//       fetchedTotalPages = firstData.data.pagination.totalPages;
//     }

//     for (page = 2; page <= fetchedTotalPages; page++) {
//       let pageUrl = `${process.env.REACT_APP_EP}/data/devices/${azure_device_id}/sensor-logs-complete?page=${page}&limit=1000`;
      
//       if (filters.start) pageUrl += `&startDate=${filters.start}`;
      
//       if (filters.end) {
//         const adjustedEndDate = addOneDay(filters.end);
//         pageUrl += `&endDate=${adjustedEndDate}`;
//       } else if (filters.start && !filters.end) {
//         const adjustedEndDate = addOneDay(filters.start);
//         pageUrl += `&endDate=${adjustedEndDate}`;
//       }

//       const response = await fetch(pageUrl);
//       if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
//       const data = await response.json();
//       if (data.status === 'success') {
//         allLogs.push(...data.data.logs);
//       }
//     }

//     return allLogs;
//   } catch (err) {
//     console.error('Error fetching all logs:', err);
//     throw err;
//   }
// };

//   // Calculate date range in days
//   const getDateRangeInDays = (filters = appliedFilters) => {
//     // Normalize filters first
//     const normalizedFilters = normalizeFilters(filters);
    
//     if (!normalizedFilters.start || !normalizedFilters.end) return 0;
    
//     const start = new Date(normalizedFilters.start);
//     const end = new Date(normalizedFilters.end);
//     const diffTime = Math.abs(end - start);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     return diffDays;
//   };

//   // Check if it's a single day view
//   // Check if it's a single day view
// const isSingleDayView = (filters = appliedFilters) => {
//   const normalizedFilters = normalizeFilters(filters);
  
//   // If no dates provided
//   if (!normalizedFilters.start && !normalizedFilters.end) return false;
  
//   // If only one date was originally provided (not both) - single day
//   if (filters.start && !filters.end) return true;
//   if (!filters.start && filters.end) return true;
  
//   // If both dates provided and they are the SAME date - single day
//   if (filters.start && filters.end && filters.start === filters.end) return true;
  
//   // If start and end are DIFFERENT dates - NOT a single day (show daily view)
//   return false;
// };

//   // ============================================
//   // HELPER FUNCTIONS FOR DATE/TIME NORMALIZATION
//   // ============================================

//   // Normalize date to YYYY-MM-DD format
//   const normalizeDate = (dateStr) => {
//     if (!dateStr) return null;
    
//     // If already in YYYY-MM-DD format
//     if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
//       return dateStr;
//     }
    
//     // Try to parse the date
//     const date = new Date(dateStr);
//     if (isNaN(date.getTime())) return null;
    
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');
    
//     return `${year}-${month}-${day}`;
//   };

//   // Extract hour from time string (handles various formats)
//   const extractHour = (timeStr) => {
//     if (!timeStr) return null;
    
//     const timeString = String(timeStr).trim();
    
//     // Handle HH:MM:SS or HH:MM format
//     if (timeString.includes(':')) {
//       const parts = timeString.split(':');
//       if (parts.length >= 1) {
//         const hour = parseInt(parts[0], 10);
//         if (!isNaN(hour) && hour >= 0 && hour <= 23) {
//           return hour.toString().padStart(2, '0');
//         }
//       }
//     }
    
//     // Handle HHMMSS format
//     if (/^\d{6}$/.test(timeString)) {
//       const hour = parseInt(timeString.substring(0, 2), 10);
//       if (!isNaN(hour) && hour >= 0 && hour <= 23) {
//         return hour.toString().padStart(2, '0');
//       }
//     }
    
//     // Handle HHMM format
//     if (/^\d{4}$/.test(timeString)) {
//       const hour = parseInt(timeString.substring(0, 2), 10);
//       if (!isNaN(hour) && hour >= 0 && hour <= 23) {
//         return hour.toString().padStart(2, '0');
//       }
//     }
    
//     // Handle HH format
//     if (/^\d{1,2}$/.test(timeString)) {
//       const hour = parseInt(timeString, 10);
//       if (!isNaN(hour) && hour >= 0 && hour <= 23) {
//         return hour.toString().padStart(2, '0');
//       }
//     }
    
//     // Try parsing as a time with AM/PM
//     if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
//       const match = timeString.match(/(\d{1,2})/);
//       if (match) {
//         let hour = parseInt(match[1], 10);
//         if (timeString.toLowerCase().includes('pm') && hour !== 12) {
//           hour += 12;
//         }
//         if (timeString.toLowerCase().includes('am') && hour === 12) {
//           hour = 0;
//         }
//         if (hour >= 0 && hour <= 23) {
//           return hour.toString().padStart(2, '0');
//         }
//       }
//     }
    
//     return null;
//   };

//   // ============================================
//   // COMPLETE TIME SERIES GENERATION FUNCTIONS
//   // ============================================

//   // Generate all 24 hour slots (00:00 to 23:00)
//   const generateAllHourSlots = () => {
//     const slots = [];
//     for (let hour = 0; hour < 24; hour++) {
//       slots.push(`${hour.toString().padStart(2, '0')}:00`);
//     }
//     return slots;
//   };

//   // Generate all day slots between start and end date (inclusive)
//   const generateAllDaySlots = (startDateStr, endDateStr) => {
//     const slots = [];
//     const start = new Date(startDateStr + 'T00:00:00');
//     const end = new Date(endDateStr + 'T00:00:00');
    
//     const current = new Date(start);
    
//     while (current <= end) {
//       const year = current.getFullYear();
//       const month = (current.getMonth() + 1).toString().padStart(2, '0');
//       const day = current.getDate().toString().padStart(2, '0');
//       slots.push(`${year}-${month}-${day}`);
      
//       current.setDate(current.getDate() + 1);
//     }
    
//     return slots;
//   };

//   // Group logs by hour with COMPLETE 24-hour coverage
//   const groupByHour = (logsData, filterDate) => {
//     const allHours = generateAllHourSlots();
    
//     console.log('=== HOURLY GROUPING DEBUG ===');
//     console.log('Filter date:', filterDate);
//     console.log('Total logs received:', logsData.length);
    
//     if (logsData.length > 0) {
//       console.log('Sample log:', logsData[0]);
//     }
    
//     // Initialize hourly data with zeros for ALL hours
//     const hourlyData = {};
//     allHours.forEach(hour => {
//       hourlyData[hour] = {
//         count: 0,
//         water_flow: 0,
//         water_pressure: 0,
//         total_running_hours: 0,
//         total_water_outlet: 0,
//         pump_motor_frequency: 0,
//         pump_motor_current: 0
//       };
//     });
    
//     let matchedCount = 0;
    
//     // Aggregate actual data into hourly buckets
//     logsData.forEach((log, index) => {
//       const extractedHour = extractHour(log.time);
      
//       if (index < 3) {
//         console.log(`Log ${index}: time="${log.time}" -> extracted hour="${extractedHour}"`);
//       }
      
//       if (!extractedHour) return;
      
//       const hourKey = `${extractedHour}:00`;
      
//       if (hourlyData[hourKey]) {
//         matchedCount++;
//         hourlyData[hourKey].count++;
//         hourlyData[hourKey].water_flow += parseFloat(log.water_flow || 0);
//         hourlyData[hourKey].water_pressure += parseFloat(log.water_pressure || 0);
//         hourlyData[hourKey].total_running_hours += parseFloat(log.total_running_hours || 0);
//         hourlyData[hourKey].total_water_outlet += parseFloat(log.total_water_outlet || 0);
//         hourlyData[hourKey].pump_motor_frequency += parseFloat(log.pump_motor_frequency || 0);
//         hourlyData[hourKey].pump_motor_current += parseFloat(log.pump_motor_current || 0);
//       }
//     });
    
//     console.log('Matched logs:', matchedCount);
    
//     const hoursWithData = Object.entries(hourlyData)
//       .filter(([_, data]) => data.count > 0)
//       .map(([hour, data]) => ({ hour, count: data.count }));
//     console.log('Hours with data:', hoursWithData);
//     console.log('=== END HOURLY GROUPING DEBUG ===');
    
//     // Create complete dataset - ALL 24 hours with actual data or zeros
//     return allHours.map(hour => {
//       const data = hourlyData[hour];
//       const hasData = data.count > 0;
      
//       return {
//         displayTime: hour,
//         timestamp: `${filterDate} ${hour}`,
//         fullDate: `${filterDate} ${hour}`,
//         water_flow: hasData ? parseFloat((data.water_flow / data.count).toFixed(2)) : 0,
//         water_pressure: hasData ? parseFloat((data.water_pressure / data.count).toFixed(2)) : 0,
//         total_running_hours: hasData ? parseFloat((data.total_running_hours / data.count).toFixed(2)) : 0,
//         total_water_outlet: hasData ? parseFloat((data.total_water_outlet / data.count).toFixed(0)) : 0,
//         pump_motor_frequency: hasData ? parseFloat((data.pump_motor_frequency / data.count).toFixed(2)) : 0,
//         pump_motor_current: hasData ? parseFloat((data.pump_motor_current / data.count).toFixed(2)) : 0,
//         hasData: hasData,
//         dataCount: data.count
//       };
//     });
//   };

//   // Group logs by day with COMPLETE date range coverage
//   const groupByDay = (logsData, startDateStr, endDateStr) => {
//     const allDays = generateAllDaySlots(startDateStr, endDateStr);
    
//     console.log('=== DAILY GROUPING DEBUG ===');
//     console.log('Date range:', { startDateStr, endDateStr });
//     console.log('All days generated:', allDays);
//     console.log('Total logs:', logsData.length);
    
//     // Initialize daily data with zeros for ALL days
//     const dailyData = {};
//     allDays.forEach(date => {
//       dailyData[date] = {
//         count: 0,
//         water_flow: 0,
//         water_pressure: 0,
//         total_running_hours: 0,
//         total_water_outlet: 0,
//         pump_motor_frequency: 0,
//         pump_motor_current: 0
//       };
//     });
    
//     // Aggregate actual data into daily buckets
//     logsData.forEach(log => {
//       let matchedDate = null;
      
//       if (log.date && dailyData[log.date]) {
//         matchedDate = log.date;
//       } else {
//         const normalizedDate = normalizeDate(log.date);
//         if (normalizedDate && dailyData[normalizedDate]) {
//           matchedDate = normalizedDate;
//         }
//       }
      
//       if (matchedDate) {
//         dailyData[matchedDate].count++;
//         dailyData[matchedDate].water_flow += parseFloat(log.water_flow || 0);
//         dailyData[matchedDate].water_pressure += parseFloat(log.water_pressure || 0);
//         dailyData[matchedDate].total_running_hours += parseFloat(log.total_running_hours || 0);
//         dailyData[matchedDate].total_water_outlet += parseFloat(log.total_water_outlet || 0);
//         dailyData[matchedDate].pump_motor_frequency += parseFloat(log.pump_motor_frequency || 0);
//         dailyData[matchedDate].pump_motor_current += parseFloat(log.pump_motor_current || 0);
//       }
//     });
    
//     const daysWithData = Object.entries(dailyData)
//       .filter(([_, data]) => data.count > 0)
//       .map(([date, data]) => ({ date, count: data.count }));
//     console.log('Days with data:', daysWithData);
//     console.log('=== END DAILY GROUPING DEBUG ===');
    
//     return allDays.map(date => {
//       const data = dailyData[date];
//       const hasData = data.count > 0;
      
//       const dateObj = new Date(date + 'T00:00:00');
//       const day = dateObj.getDate().toString().padStart(2, '0');
//       const monthShort = dateObj.toLocaleDateString('en-US', { month: 'short' });
      
//       return {
//         displayTime: `${day}-${monthShort}`,
//         timestamp: date,
//         fullDate: dateObj.toLocaleDateString('en-US', { 
//           weekday: 'short', 
//           year: 'numeric', 
//           month: 'short', 
//           day: 'numeric' 
//         }),
//         water_flow: hasData ? parseFloat((data.water_flow / data.count).toFixed(2)) : 0,
//         water_pressure: hasData ? parseFloat((data.water_pressure / data.count).toFixed(2)) : 0,
//         total_running_hours: hasData ? parseFloat((data.total_running_hours / data.count).toFixed(2)) : 0,
//         total_water_outlet: hasData ? parseFloat((data.total_water_outlet / data.count).toFixed(0)) : 0,
//         pump_motor_frequency: hasData ? parseFloat((data.pump_motor_frequency / data.count).toFixed(2)) : 0,
//         pump_motor_current: hasData ? parseFloat((data.pump_motor_current / data.count).toFixed(2)) : 0,
//         hasData: hasData,
//         dataCount: data.count
//       };
//     });
//   };

//   // Process data for graph with complete time coverage
//   const processGraphData = (allLogs, filters = appliedFilters) => {
//     // Normalize filters first
//     const normalizedFilters = normalizeFilters(filters);
    
//     console.log('=== PROCESS GRAPH DATA ===');
//     console.log('Original filters:', filters);
//     console.log('Normalized filters:', normalizedFilters);
//     console.log('Total logs:', allLogs.length);
    
//     if (!normalizedFilters.start) {
//       console.warn('No start date provided');
//       return [];
//     }

//     const singleDay = isSingleDayView(filters);
//     console.log('Is single day view:', singleDay);
    
//     if (singleDay) {
//       console.log('Using hourly grouping for date:', normalizedFilters.start);
//       return groupByHour(allLogs, normalizedFilters.start);
//     } else {
//       console.log('Using daily grouping');
//       return groupByDay(allLogs, normalizedFilters.start, normalizedFilters.end);
//     }
//   };

//   // Load graph data
//   const handleShowGraph = async () => {
//     setGraphLoading(true);
//     try {
//       const allLogs = await fetchAllFilteredLogs(appliedFilters);
//       console.log('=== SHOW GRAPH ===');
//       console.log('Applied filters:', appliedFilters);
//       console.log('Fetched logs count:', allLogs.length);
      
//       const processedData = processGraphData(allLogs, appliedFilters);
//       console.log('Processed data count:', processedData.length);
//       console.log('Points with data:', processedData.filter(d => d.hasData).length);
      
//       setGraphData(processedData);
//       setShowGraph(true);
//       updateURL(normalizeFilters(appliedFilters), true);
//     } catch (err) {
//       alert('Failed to load graph data: ' + err.message);
//     } finally {
//       setGraphLoading(false);
//     }
//   };

//   // Load filters and graph from URL params on mount
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const startParam = params.get('start');
//     const endParam = params.get('end');
//     const graphParam = params.get('graph');
    
//     if (startParam || endParam) {
//       setStartDate(startParam || '');
//       setEndDate(endParam || '');
//       const filters = { start: startParam || '', end: endParam || '' };
//       setAppliedFilters(filters);
//       setIsFilterApplied(true);
//       fetchLogs(1, filters);
      
//       if (graphParam === 'true') {
//         loadGraphDataAfterMount(filters);
//       }
//     } else {
//       fetchLogs(1, {});
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [azure_device_id]);

//   // Helper function to load graph data after component mounts
//   const loadGraphDataAfterMount = async (filters) => {
//     setGraphLoading(true);
//     try {
//       const allLogs = await fetchAllFilteredLogs(filters);
//       const processedData = processGraphData(allLogs, filters);
//       setGraphData(processedData);
//       setShowGraph(true);
//     } catch (err) {
//       console.error('Failed to load graph data:', err);
//     } finally {
//       setGraphLoading(false);
//     }
//   };

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       fetchLogs(newPage, appliedFilters);
//     }
//   };

//   // Apply filters - FIXED to handle single date
//   const handleApplyFilters = () => {
//     // At least one date must be selected
//     if (!startDate && !endDate) {
//       alert('Please select at least a start date or end date');
//       return;
//     }
    
//     const filters = { start: startDate, end: endDate };
//     setAppliedFilters(filters);
//     setIsFilterApplied(true);
//     setShowGraph(false);
//     setGraphData([]);
//     fetchLogs(1, filters);
//     setShowFilters(false);
//     updateURL(normalizeFilters(filters), false);
//   };

//   // Clear filters
//   const handleClearFilters = () => {
//     setStartDate('');
//     setEndDate('');
//     setAppliedFilters({ start: '', end: '' });
//     setIsFilterApplied(false);
//     setShowGraph(false);
//     setGraphData([]);
//     fetchLogs(1, {});
//     setShowFilters(false);
//     window.history.replaceState({}, '', window.location.pathname);
//   };

//   // Export to CSV
//   const exportToCSV = async () => {
//     setExportLoading(true);
//     try {
//       const allLogs = await fetchAllFilteredLogs(appliedFilters);
      
//       const headers = [
//         'Date',
//         'Time',
//         'Water Flow (L/min)',
//         'Water Pressure (bar)',
//         'Pump Motor Frequency (Hz)',
//         'Pump Motor Current (A)',
//         'Total Running Hours (H)',
//         // 'Total Water Outlet (L)',
//         'Oxygen Flow (L/min)',
//       ];

//       const csvData = allLogs.map(log => [
//         log.date,
//         log.time,
//         (log.water_flow || 0).toFixed(2),
//         (log.water_pressure || 0).toFixed(2),
//         (log.pump_motor_frequency || 0).toFixed(2),
//         (log.pump_motor_current || 0).toFixed(2),
//         (log.total_running_hours || 0).toFixed(2),
//         // log.total_water_outlet || 0,
//         (log.oxygen_flow || 0).toFixed(2),
//       ]);

//       const csvContent = [
//         headers.join(','),
//         ...csvData.map(row => row.join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `sensor-logs-${deviceName}-${new Date().toISOString().split('T')[0]}.csv`;
//       link.click();
//       URL.revokeObjectURL(url);
//     } catch (err) {
//       alert('Failed to export CSV: ' + err.message);
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   // Export to PDF
//   const exportToPDF = async () => {
//     setExportLoading(true);
//     try {
//       const allLogs = await fetchAllFilteredLogs(appliedFilters);
      
//       const doc = new jsPDF();

//       doc.setFontSize(16);
//       doc.text(`Sensor Logs - ${deviceName}`, 14, 15);
//       doc.setFontSize(10);
//       doc.text(`Device ID: ${azure_device_id}`, 14, 22);
//       doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

//       const normalizedFilters = normalizeFilters(appliedFilters);
//       if (normalizedFilters.start || normalizedFilters.end) {
//         doc.text(
//           `Filter: ${normalizedFilters.start || 'All'} to ${normalizedFilters.end || 'All'}`,
//           14,
//           34
//         );
//       }

//       doc.text(`Total Records: ${allLogs.length}`, 14, 40);

//       const tableData = allLogs.map(log => [
//         log.date,
//         log.time,
//         (log.water_flow || 0).toFixed(2),
//         (log.water_pressure || 0).toFixed(2),
//         (log.pump_motor_frequency || 0).toFixed(2),
//         (log.pump_motor_current || 0).toFixed(2),
//         (log.total_running_hours || 0).toFixed(2),
//         // log.total_water_outlet || 0,
//         (log.oxygen_flow || 0).toFixed(2),
//       ]);

//       doc.autoTable({
//         startY: 44,
//         head: [[
//           'Date',
//           'Time',
//           'Water Flow (L/min)',
//           'Water Pressure (bar)',
//           'Pump Motor Frequency (Hz)',
//           'Pump Motor Current (A)',
//           'Total Running Hours (H)',
//           // 'Total Water Outlet (L)',
//           'Oxygen Flow (L/min)',
//         ]],
//         body: tableData,
//         styles: { fontSize: 8, cellPadding: 2 },
//         headStyles: { fillColor: [13, 110, 253], fontSize: 9 },
//         columnStyles: {
//           0: { cellWidth: 28 },
//           1: { cellWidth: 22 },
//           2: { cellWidth: 20 },
//           3: { cellWidth: 22 },
//           4: { cellWidth: 18 },
//           5: { cellWidth: 20 },
//           6: { cellWidth: 18 }
//         }
//       });

//       doc.save(`sensor-logs-${deviceName}-${new Date().toISOString().split('T')[0]}.pdf`);
//     } catch (err) {
//       alert('Failed to export PDF: ' + err.message);
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   // Calculate optimal X-axis interval
//   const calculateXAxisInterval = (dataLength) => {
//     if (dataLength <= 12) return 0;
//     if (dataLength <= 24) return 1;
//     if (dataLength <= 31) return 2;
//     if (dataLength <= 62) return 4;
//     return Math.floor(dataLength / 10);
//   };

//   // Enhanced custom tooltip
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       const dataPoint = payload[0]?.payload;
//       const hasData = dataPoint?.hasData;
//       const singleDay = isSingleDayView();
      
//       return (
//         <div className="custom-tooltip" style={{
//           backgroundColor: 'white',
//           border: '1px solid #ccc',
//           borderRadius: '8px',
//           padding: '12px',
//           boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//         }}>
//           <p className="tooltip-time" style={{ 
//             fontWeight: 'bold', 
//             marginBottom: '8px',
//             borderBottom: '1px solid #eee',
//             paddingBottom: '8px'
//           }}>
//             {singleDay ? `Time: ${label}` : (dataPoint?.fullDate || label)}
//           </p>
          
//           {!hasData && (
//             <p style={{ 
//               color: '#f59e0b', 
//               fontStyle: 'italic',
//               marginBottom: '8px'
//             }}>
//               No data recorded (showing 0)
//             </p>
//           )}
          
//           {payload.map((entry, index) => (
//             <p key={index} style={{ 
//               color: entry.color,
//               margin: '4px 0',
//               fontSize: '13px'
//             }}>
//               {entry.name}: {entry.value} {entry.unit}
//             </p>
//           ))}
          
//           {hasData && dataPoint?.dataCount && (
//             <p style={{ 
//               fontSize: '11px', 
//               color: '#888', 
//               marginTop: '8px',
//               borderTop: '1px solid #eee',
//               paddingTop: '8px'
//             }}>
//               Based on {dataPoint.dataCount} reading{dataPoint.dataCount > 1 ? 's' : ''}
//             </p>
//           )}
//         </div>
//       );
//     }
//     return null;
//   };

//   // Get display text for filter
//   const getFilterDisplayText = () => {
//     const normalizedFilters = normalizeFilters(appliedFilters);
    
//     if (appliedFilters.start && !appliedFilters.end) {
//       return `Date: ${appliedFilters.start} (Single Day)`;
//     }
//     if (!appliedFilters.start && appliedFilters.end) {
//       return `Date: ${appliedFilters.end} (Single Day)`;
//     }
//     if (appliedFilters.start === appliedFilters.end) {
//       return `Date: ${appliedFilters.start} (Single Day)`;
//     }
//     return `${normalizedFilters.start || 'All'} to ${normalizedFilters.end || 'All'}`;
//   };

//   // Render graph
//   const renderGraph = () => {
//     if (graphData.length === 0) return null;

//     const singleDay = isSingleDayView();
//     const dataPointsWithData = graphData.filter(d => d.hasData).length;
//     const dataPointsWithoutData = graphData.length - dataPointsWithData;

//     const metricsToShow = Object.values(metrics).filter(
//       metric => selectedMetrics[metric.yAxisId]
//     );

//     const selectedCount = Object.values(selectedMetrics).filter(Boolean).length;

//     const handleMetricToggle = (metricKey, currentValue) => {
//       if (!currentValue && selectedCount >= 4) {
//         alert('You can select a maximum of 4 metrics at a time. Please deselect one metric before selecting another.');
//         return;
//       }
      
//       setSelectedMetrics(prev => ({
//         ...prev,
//         [metricKey]: !currentValue
//       }));
//     };

//     const MetricCheckbox = ({ metricKey, metric }) => (
//       <label className="metric-checkbox-label">
//         <input
//           type="checkbox"
//           checked={selectedMetrics[metricKey]}
//           onChange={() => handleMetricToggle(metricKey, selectedMetrics[metricKey])}
//           disabled={!selectedMetrics[metricKey] && selectedCount >= 4}
//         />
//         <span style={{ color: metric.color }}>{metric.name}</span>
//       </label>
//     );

//     const metricControls = (
//       <div className="graph-controls-wrapper">
//         <div className="metric-dropdown-container" ref={metricDropdownRef}>
//           <button
//             className="metric-dropdown-button"
//             onClick={() => setIsMetricDropdownOpen(!isMetricDropdownOpen)}
//           >
//             Select Metrics ({selectedCount}/4)&nbsp;
//             <FontAwesomeIcon icon={isMetricDropdownOpen ? faChevronUp : faChevronDown} />
//           </button>
//           {isMetricDropdownOpen && (
//             <div className="metric-dropdown-menu">
//               <MetricCheckbox metricKey="waterFlow" metric={metrics.waterFlow} />
//               <MetricCheckbox metricKey="waterPressure" metric={metrics.waterPressure} />
//               {/* <MetricCheckbox metricKey="runningHours" metric={metrics.runningHours} />
//               <MetricCheckbox metricKey="waterOutlet" metric={metrics.waterOutlet} /> */}
//               <MetricCheckbox metricKey="pumpMotorFrequency" metric={metrics.pumpMotorFrequency} />
//               <MetricCheckbox metricKey="pumpMotorCurrent" metric={metrics.pumpMotorCurrent} />
//             </div>
//           )}
//         </div>
//       </div>
//     );

//     if (metricsToShow.length === 0) {
//       return (
//         <div className="graph-section">
//           <div className="graph-header">
//             <h3>
//               <FontAwesomeIcon icon={faChartLine} /> Sensor Data Graph
//             </h3>
//             {metricControls}
//           </div>
//           <div style={{ 
//             padding: '40px', 
//             textAlign: 'center', 
//             backgroundColor: '#f8f9fa',
//             borderRadius: '8px',
//             margin: '20px 0',
//             border: '1px dashed #ced4da'
//           }}>
//             <p style={{ fontSize: '16px', color: '#666' }}>
//               Please select at least one metric from the dropdown to display the graph.
//             </p>
//             <p style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>
//               (Maximum 4 metrics can be selected)
//             </p>
//           </div>
//         </div>
//       );
//     }

//     const xAxisInterval = calculateXAxisInterval(graphData.length);

//     return (
//       <div className="graph-section">
//         <div className="graph-header">
//           <h3>
//             <FontAwesomeIcon icon={faChartLine} /> Sensor Data Graph
//             <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px' }}>
//               ({singleDay ? 'Hourly View - 24 Hours' : 'Daily View'})
//             </span>
//           </h3>
//           {metricControls}
//         </div>

//         {/* Data coverage info */}
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           padding: '10px 15px',
//           backgroundColor: '#f0f9ff',
//           borderRadius: '6px',
//           marginBottom: '15px',
//           fontSize: '13px',
//           flexWrap: 'wrap',
//           gap: '10px'
//         }}>
//           <div>
//             <span role="img" aria-label="chart">📊</span> {graphData.length} {singleDay ? 'hours' : 'days'} displayed
//             <span style={{ margin: '0 10px' }}>|</span>
//             <span style={{ color: '#22c55e' }}>● {dataPointsWithData} with data</span>
//             {dataPointsWithoutData > 0 && (
//               <span style={{ color: '#f59e0b', marginLeft: '10px' }}>○ {dataPointsWithoutData} no data (shown as 0)</span>
//             )}
//           </div>
//           <div style={{ color: '#666' }}>
//             <span role="img" aria-label="tip">💡</span> Hover over points for details
//           </div>
//         </div>

//         {/* Data coverage bar */}
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '10px',
//           marginBottom: '15px',
//           padding: '8px 15px',
//           backgroundColor: '#f8fafc',
//           borderRadius: '6px'
//         }}>
//           <span style={{ fontSize: '12px', fontWeight: '500', color: '#475569', whiteSpace: 'nowrap' }}>
//             Data Coverage:
//           </span>
//           <div style={{
//             flex: 1,
//             display: 'flex',
//             height: '8px',
//             borderRadius: '4px',
//             overflow: 'hidden',
//             backgroundColor: '#e2e8f0'
//           }}>
//             {graphData.map((point, index) => (
//               <div
//                 key={index}
//                 style={{
//                   flex: 1,
//                   backgroundColor: point.hasData ? '#22c55e' : '#e2e8f0',
//                   borderRight: index < graphData.length - 1 ? '1px solid #fff' : 'none'
//                 }}
//                 title={`${point.displayTime}: ${point.hasData ? `Has data (${point.dataCount} readings)` : 'No data'}`}
//               />
//             ))}
//           </div>
//         </div>

//         <ResponsiveContainer width="100%" height={500}>
//           <LineChart 
//             data={graphData} 
//             margin={{ top: 20, right: 80, left: 80, bottom: 80 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//             <XAxis 
//               dataKey="displayTime" 
//               angle={graphData.length > 12 ? -45 : 0}
//               textAnchor={graphData.length > 12 ? "end" : "middle"}
//               height={80}
//               interval={xAxisInterval}
//               tick={{ fontSize: 11, fill: '#4b5563' }}
//               axisLine={{ stroke: '#9ca3af' }}
//               tickLine={{ stroke: '#9ca3af' }}
//               label={{ 
//                 value: singleDay ? 'Hour of Day' : 'Date', 
//                 position: 'insideBottom', 
//                 offset: graphData.length > 12 ? -5 : -10,
//                 style: { fontSize: 12, fontWeight: 'bold', fill: '#374151' }
//               }}
//             />
            
//             {selectedMetrics.waterFlow && (
//               <YAxis 
//                 yAxisId="waterFlow" 
//                 orientation="left" 
//                 stroke={metrics.waterFlow.color} 
//                 tick={{ fontSize: 9 }} 
//                 width={70}
//                 domain={[0, 'auto']}
//                 allowDataOverflow={false}
//               />
//             )}
//             {selectedMetrics.waterPressure && (
//               <YAxis 
//                 yAxisId="waterPressure" 
//                 orientation="right" 
//                 stroke={metrics.waterPressure.color} 
//                 tick={{ fontSize: 9 }} 
//                 width={70}
//                 domain={[0, 'auto']}
//                 allowDataOverflow={false}
//               />
//             )}
//             {selectedMetrics.runningHours && (
//               <YAxis 
//                 yAxisId="runningHours" 
//                 orientation="left" 
//                 stroke={metrics.runningHours.color} 
//                 tick={{ fontSize: 9 }} 
//                 width={70}
//                 domain={[0, 'auto']}
//                 allowDataOverflow={false}
//               />
//             )}
//             {selectedMetrics.waterOutlet && (
//               <YAxis 
//                 yAxisId="waterOutlet" 
//                 orientation="right" 
//                 stroke={metrics.waterOutlet.color} 
//                 tick={{ fontSize: 9 }} 
//                 width={70}
//                 domain={[0, 'auto']}
//                 allowDataOverflow={false}
//               />
//             )}
//             {selectedMetrics.pumpMotorFrequency && (
//               <YAxis 
//                 yAxisId="pumpMotorFrequency" 
//                 orientation="left" 
//                 stroke={metrics.pumpMotorFrequency.color} 
//                 tick={{ fontSize: 9 }} 
//                 width={70}
//                 domain={[0, 'auto']}
//                 allowDataOverflow={false}
//               />
//             )}
//             {selectedMetrics.pumpMotorCurrent && (
//               <YAxis 
//                 yAxisId="pumpMotorCurrent" 
//                 orientation="right" 
//                 stroke={metrics.pumpMotorCurrent.color} 
//                 tick={{ fontSize: 9 }} 
//                 width={70}
//                 domain={[0, 'auto']}
//                 allowDataOverflow={false}
//               />
//             )}

//             {metricsToShow.map((metric) => (
//               <Line
//                 key={metric.yAxisId}
//                 type="monotone"
//                 dataKey={metric.key}
//                 stroke={metric.color}
//                 name={metric.name}
//                 yAxisId={metric.yAxisId}
//                 unit={` ${metric.unit}`}
//                 dot={{ r: 3, fill: metric.color }}
//                 strokeWidth={2}
//                 activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
//                 connectNulls={true}
//               />
//             ))}

//             <Tooltip content={<CustomTooltip />} />
//             <Legend 
//               verticalAlign="top" 
//               height={36} 
//               iconType="line" 
//               wrapperStyle={{ paddingBottom: '10px' }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     );
//   };

//   // Render pagination
//   const renderPagination = () => {
//     const pages = [];
//     const maxVisible = 5;
//     let paginationStartPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
//     let paginationEndPage = Math.min(totalPages, paginationStartPage + maxVisible - 1);

//     if (paginationEndPage - paginationStartPage < maxVisible - 1) {
//       paginationStartPage = Math.max(1, paginationEndPage - maxVisible + 1);
//     }

//     for (let i = paginationStartPage; i <= paginationEndPage; i++) {
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
//           {isFilterApplied && (
//             <>
//               <button 
//                 className="graph-btn" 
//                 onClick={handleShowGraph}
//                 disabled={graphLoading}
//               >
//                 <FontAwesomeIcon icon={faChartLine} /> 
//                 {graphLoading ? 'Loading...' : showGraph ? 'Refresh Graph' : 'Show Graph'}
//               </button>
//               <button 
//                 className="export-btn csv-btn" 
//                 onClick={exportToCSV}
//                 disabled={exportLoading}
//               >
//                 <FontAwesomeIcon icon={faFileCsv} /> 
//                 {exportLoading ? 'Exporting...' : 'Export CSV'}
//               </button>
//               <button 
//                 className="export-btn pdf-btn" 
//                 onClick={exportToPDF}
//                 disabled={exportLoading}
//               >
//                 <FontAwesomeIcon icon={faFilePdf} /> 
//                 {exportLoading ? 'Exporting...' : 'Export PDF'}
//               </button>
//             </>
//           )}
//         </div>
//       </div>

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
//               <label>End Date: <span style={{ fontSize: '11px', color: '#666' }}>(optional for single day)</span></label>
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

//       <div className="records-info">
//         <p>
//           Showing {logs.length} of {totalRecords} records
//           {isFilterApplied && (appliedFilters.start || appliedFilters.end) ? (
//             <span className="filter-indicator">
//               {' '}(Filtered: {getFilterDisplayText()})
//             </span>
//           ) : null}
//         </p>
//       </div>

//       {showGraph && renderGraph()}

//       <div className="logs-table-container">
//         {loading ? (
//           <div className="loading-state">Loading logs...</div>
//         ) : error ? (
//           <div className="error-state">Error: {error}</div>
//         ) : logs.length === 0 ? (
//           <div className="empty-state">
//             <p>No logs found</p>
//             {isFilterApplied && (
//               <p style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>
//                 No data available for the selected date range. The graph will still show all time slots with zero values.
//               </p>
//             )}
//           </div>
//         ) : (
//           <table className="logs-table">
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Time</th>
//                 <th>Water Flow<br/>(L/min)</th>
//                 <th>Water Pressure<br/>(bar)</th>
//                 <th>Pump Motor Frequency</th>
//                 <th>Pump Motor Current</th>
//                 <th>Total Running Hours<br/>(H)</th>
//                 {/* <th>Total Water Outlet<br/>(L)</th> */}
//                 <th>Oxygen Flow<br/>(L/min)</th>

//               </tr>
//             </thead>
//             <tbody>
//               {logs.map((log, index) => (
//                 <tr key={index}>
//                   <td>{log.date}</td>
//                   <td>{log.time}</td>
//                   <td>{(log.water_flow || 0).toFixed(2)}</td>
//                   <td>{(log.water_pressure || 0).toFixed(2)}</td>
//                   <td>{log.pump_motor_frequency || 0}</td>
//                   <td>{log.pump_motor_current || 0}</td>
//                   <td>{(log.total_running_hours || 0).toFixed(2)}</td>
//                   <td>{(log.oxygen_flow || 0).toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

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




// src/pages/LogDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf, faFileCsv, faArrowLeft, faChevronLeft, faChevronRight,
  faFilter, faChartLine, faChevronUp, faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useLabels } from '../../context/LabelContext';
import './LogDetails.css';

const LogDetails = () => {
  const { azure_device_id } = useParams();
  const navigate = useNavigate();

  // ===== USE LABEL CONTEXT =====
  const { getLabel, fetchLabels, isLoaded } = useLabels();

  // Ensure labels are loaded
  useEffect(() => {
    if (azure_device_id) fetchLabels(azure_device_id);
  }, [azure_device_id, fetchLabels]);

  const [logs, setLogs] = useState([]);
  const [deviceName, setDeviceName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [recordsPerPage] = useState(50);
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ start: '', end: '' });
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [graphLoading, setGraphLoading] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState({
    waterFlow: true, waterPressure: true, pumpMotorFrequency: false, pumpMotorCurrent: false
  });
  const [isMetricDropdownOpen, setIsMetricDropdownOpen] = useState(false);
  const metricDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (metricDropdownRef.current && !metricDropdownRef.current.contains(event.target)) setIsMetricDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ===== METRIC CONFIGS - NOW USE CONTEXT LABELS =====
  const getMetrics = () => ({
    waterFlow: {
      key: 'water_flow',
      name: getLabel(azure_device_id, 'log_graph_water_flow'),
      color: '#3b82f6',
      unit: 'L/min',
      yAxisId: 'waterFlow'
    },
    waterPressure: {
      key: 'water_pressure',
      name: getLabel(azure_device_id, 'log_graph_water_pressure'),
      color: '#10b981',
      unit: 'bar',
      yAxisId: 'waterPressure'
    },
    pumpMotorFrequency: {
      key: 'pump_motor_frequency',
      name: getLabel(azure_device_id, 'log_graph_pump_motor_frequency'),
      color: '#8b5cf6',
      unit: 'Hz',
      yAxisId: 'pumpMotorFrequency'
    },
    pumpMotorCurrent: {
      key: 'pump_motor_current',
      name: getLabel(azure_device_id, 'log_graph_pump_motor_current'),
      color: '#ec4899',
      unit: 'A',
      yAxisId: 'pumpMotorCurrent'
    }
  });

  // ===== ALL YOUR EXISTING HELPER FUNCTIONS (unchanged) =====
  const normalizeFilters = (filters) => {
    const normalized = { ...filters };
    if (normalized.start && !normalized.end) normalized.end = normalized.start;
    if (!normalized.start && normalized.end) normalized.start = normalized.end;
    return normalized;
  };

  const updateURL = (filters, shouldShowGraph = false) => {
    const params = new URLSearchParams();
    if (filters.start) params.set('start', filters.start);
    if (filters.end) params.set('end', filters.end);
    if (shouldShowGraph) params.set('graph', 'true');
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  const addOneDay = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr + 'T00:00:00');
    date.setDate(date.getDate() + 1);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const fetchLogs = async (page = 1, filters = {}) => {
    setLoading(true); setError(null);
    try {
      let url = `${process.env.REACT_APP_EP}/data/devices/${azure_device_id}/sensor-logs-complete?page=${page}&limit=${recordsPerPage}`;
      if (filters.start) url += `&startDate=${filters.start}`;
      if (filters.end) { url += `&endDate=${addOneDay(filters.end)}`; }
      else if (filters.start && !filters.end) { url += `&endDate=${addOneDay(filters.start)}`; }
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.status === 'success') {
        setLogs(data.data.logs); setDeviceName(data.data.device_name);
        setCurrentPage(data.data.pagination.currentPage); setTotalPages(data.data.pagination.totalPages); setTotalRecords(data.data.pagination.totalRecords);
      } else throw new Error(data.message || 'Failed to fetch logs');
    } catch (err) { console.error('Error:', err); setError(err.message); }
    finally { setLoading(false); }
  };

  const fetchAllFilteredLogs = async (filters = appliedFilters) => {
    const allLogs = [];
    let page = 1;
    let url = `${process.env.REACT_APP_EP}/data/devices/${azure_device_id}/sensor-logs-complete?page=${page}&limit=1000`;
    if (filters.start) url += `&startDate=${filters.start}`;
    if (filters.end) url += `&endDate=${addOneDay(filters.end)}`;
    else if (filters.start && !filters.end) url += `&endDate=${addOneDay(filters.start)}`;
    const firstResponse = await fetch(url);
    if (!firstResponse.ok) throw new Error(`HTTP ${firstResponse.status}`);
    const firstData = await firstResponse.json();
    let fetchedTotalPages = 1;
    if (firstData.status === 'success') { allLogs.push(...firstData.data.logs); fetchedTotalPages = firstData.data.pagination.totalPages; }
    for (page = 2; page <= fetchedTotalPages; page++) {
      let pageUrl = `${process.env.REACT_APP_EP}/data/devices/${azure_device_id}/sensor-logs-complete?page=${page}&limit=1000`;
      if (filters.start) pageUrl += `&startDate=${filters.start}`;
      if (filters.end) pageUrl += `&endDate=${addOneDay(filters.end)}`;
      else if (filters.start && !filters.end) pageUrl += `&endDate=${addOneDay(filters.start)}`;
      const r = await fetch(pageUrl);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      if (d.status === 'success') allLogs.push(...d.data.logs);
    }
    return allLogs;
  };

  const isSingleDayView = (filters = appliedFilters) => {
    const n = normalizeFilters(filters);
    if (!n.start && !n.end) return false;
    if (filters.start && !filters.end) return true;
    if (!filters.start && filters.end) return true;
    if (filters.start && filters.end && filters.start === filters.end) return true;
    return false;
  };

  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const extractHour = (timeStr) => {
    if (!timeStr) return null;
    const s = String(timeStr).trim();
    if (s.includes(':')) { const h = parseInt(s.split(':')[0], 10); if (!isNaN(h) && h >= 0 && h <= 23) return h.toString().padStart(2, '0'); }
    if (/^\d{6}$/.test(s)) { const h = parseInt(s.substring(0, 2), 10); if (!isNaN(h) && h >= 0 && h <= 23) return h.toString().padStart(2, '0'); }
    if (/^\d{4}$/.test(s)) { const h = parseInt(s.substring(0, 2), 10); if (!isNaN(h) && h >= 0 && h <= 23) return h.toString().padStart(2, '0'); }
    if (/^\d{1,2}$/.test(s)) { const h = parseInt(s, 10); if (!isNaN(h) && h >= 0 && h <= 23) return h.toString().padStart(2, '0'); }
    return null;
  };

  const generateAllHourSlots = () => { const s = []; for (let h = 0; h < 24; h++) s.push(`${h.toString().padStart(2, '0')}:00`); return s; };

  const generateAllDaySlots = (start, end) => {
    const s = []; const current = new Date(start + 'T00:00:00'); const endD = new Date(end + 'T00:00:00');
    while (current <= endD) {
      s.push(`${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`);
      current.setDate(current.getDate() + 1);
    }
    return s;
  };

  const groupByHour = (logsData, filterDate) => {
    const allHours = generateAllHourSlots();
    const hourlyData = {};
    allHours.forEach(h => { hourlyData[h] = { count: 0, water_flow: 0, water_pressure: 0, total_running_hours: 0, total_water_outlet: 0, pump_motor_frequency: 0, pump_motor_current: 0 }; });
    logsData.forEach(log => {
      const eh = extractHour(log.time);
      if (!eh) return;
      const hk = `${eh}:00`;
      if (hourlyData[hk]) {
        hourlyData[hk].count++;
        hourlyData[hk].water_flow += parseFloat(log.water_flow || 0);
        hourlyData[hk].water_pressure += parseFloat(log.water_pressure || 0);
        hourlyData[hk].total_running_hours += parseFloat(log.total_running_hours || 0);
        hourlyData[hk].total_water_outlet += parseFloat(log.total_water_outlet || 0);
        hourlyData[hk].pump_motor_frequency += parseFloat(log.pump_motor_frequency || 0);
        hourlyData[hk].pump_motor_current += parseFloat(log.pump_motor_current || 0);
      }
    });
    return allHours.map(h => {
      const d = hourlyData[h]; const has = d.count > 0;
      return {
        displayTime: h, timestamp: `${filterDate} ${h}`, fullDate: `${filterDate} ${h}`,
        water_flow: has ? parseFloat((d.water_flow / d.count).toFixed(2)) : 0,
        water_pressure: has ? parseFloat((d.water_pressure / d.count).toFixed(2)) : 0,
        total_running_hours: has ? parseFloat((d.total_running_hours / d.count).toFixed(2)) : 0,
        total_water_outlet: has ? parseFloat((d.total_water_outlet / d.count).toFixed(0)) : 0,
        pump_motor_frequency: has ? parseFloat((d.pump_motor_frequency / d.count).toFixed(2)) : 0,
        pump_motor_current: has ? parseFloat((d.pump_motor_current / d.count).toFixed(2)) : 0,
        hasData: has, dataCount: d.count
      };
    });
  };

  const groupByDay = (logsData, startDateStr, endDateStr) => {
    const allDays = generateAllDaySlots(startDateStr, endDateStr);
    const dailyData = {};
    allDays.forEach(date => { dailyData[date] = { count: 0, water_flow: 0, water_pressure: 0, total_running_hours: 0, total_water_outlet: 0, pump_motor_frequency: 0, pump_motor_current: 0 }; });
    logsData.forEach(log => {
      let matched = null;
      if (log.date && dailyData[log.date]) matched = log.date;
      else { const nd = normalizeDate(log.date); if (nd && dailyData[nd]) matched = nd; }
      if (matched) {
        dailyData[matched].count++;
        dailyData[matched].water_flow += parseFloat(log.water_flow || 0);
        dailyData[matched].water_pressure += parseFloat(log.water_pressure || 0);
        dailyData[matched].total_running_hours += parseFloat(log.total_running_hours || 0);
        dailyData[matched].total_water_outlet += parseFloat(log.total_water_outlet || 0);
        dailyData[matched].pump_motor_frequency += parseFloat(log.pump_motor_frequency || 0);
        dailyData[matched].pump_motor_current += parseFloat(log.pump_motor_current || 0);
      }
    });
    return allDays.map(date => {
      const d = dailyData[date]; const has = d.count > 0;
      const dateObj = new Date(date + 'T00:00:00');
      return {
        displayTime: `${dateObj.getDate().toString().padStart(2, '0')}-${dateObj.toLocaleDateString('en-US', { month: 'short' })}`,
        timestamp: date,
        fullDate: dateObj.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
        water_flow: has ? parseFloat((d.water_flow / d.count).toFixed(2)) : 0,
        water_pressure: has ? parseFloat((d.water_pressure / d.count).toFixed(2)) : 0,
        total_running_hours: has ? parseFloat((d.total_running_hours / d.count).toFixed(2)) : 0,
        total_water_outlet: has ? parseFloat((d.total_water_outlet / d.count).toFixed(0)) : 0,
        pump_motor_frequency: has ? parseFloat((d.pump_motor_frequency / d.count).toFixed(2)) : 0,
        pump_motor_current: has ? parseFloat((d.pump_motor_current / d.count).toFixed(2)) : 0,
        hasData: has, dataCount: d.count
      };
    });
  };

  const processGraphData = (allLogs, filters = appliedFilters) => {
    const nf = normalizeFilters(filters);
    if (!nf.start) return [];
    return isSingleDayView(filters) ? groupByHour(allLogs, nf.start) : groupByDay(allLogs, nf.start, nf.end);
  };

  const handleShowGraph = async () => {
    setGraphLoading(true);
    try {
      const allLogs = await fetchAllFilteredLogs(appliedFilters);
      const processedData = processGraphData(allLogs, appliedFilters);
      setGraphData(processedData); setShowGraph(true);
      updateURL(normalizeFilters(appliedFilters), true);
    } catch (err) { alert('Failed to load graph data: ' + err.message); }
    finally { setGraphLoading(false); }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sp = params.get('start'), ep = params.get('end'), gp = params.get('graph');
    if (sp || ep) {
      setStartDate(sp || ''); setEndDate(ep || '');
      const filters = { start: sp || '', end: ep || '' };
      setAppliedFilters(filters); setIsFilterApplied(true); fetchLogs(1, filters);
      if (gp === 'true') loadGraphDataAfterMount(filters);
    } else { fetchLogs(1, {}); }
  }, [azure_device_id]);

  const loadGraphDataAfterMount = async (filters) => {
    setGraphLoading(true);
    try { const allLogs = await fetchAllFilteredLogs(filters); setGraphData(processGraphData(allLogs, filters)); setShowGraph(true); }
    catch (err) { console.error('Failed to load graph:', err); }
    finally { setGraphLoading(false); }
  };

  const handlePageChange = (p) => { if (p >= 1 && p <= totalPages) fetchLogs(p, appliedFilters); };

  const handleApplyFilters = () => {
    if (!startDate && !endDate) { alert('Please select at least a start date or end date'); return; }
    const filters = { start: startDate, end: endDate };
    setAppliedFilters(filters); setIsFilterApplied(true); setShowGraph(false); setGraphData([]);
    fetchLogs(1, filters); setShowFilters(false); updateURL(normalizeFilters(filters), false);
  };

  const handleClearFilters = () => {
    setStartDate(''); setEndDate(''); setAppliedFilters({ start: '', end: '' });
    setIsFilterApplied(false); setShowGraph(false); setGraphData([]);
    fetchLogs(1, {}); setShowFilters(false);
    window.history.replaceState({}, '', window.location.pathname);
  };

  // ===== EXPORT FUNCTIONS - USE CONTEXT LABELS =====
  const exportToCSV = async () => {
    setExportLoading(true);
    try {
      const allLogs = await fetchAllFilteredLogs(appliedFilters);
      const headers = [
        'Date', 'Time',
        `${getLabel(azure_device_id, 'log_water_flow')} (L/min)`,
        `${getLabel(azure_device_id, 'log_water_pressure')} (bar)`,
        `${getLabel(azure_device_id, 'log_pump_motor_frequency')} (Hz)`,
        `${getLabel(azure_device_id, 'log_pump_motor_current')} (A)`,
        `${getLabel(azure_device_id, 'log_total_running_hours')} (H)`,
        `${getLabel(azure_device_id, 'log_oxygen_flow')} (L/min)`,
      ];
      const csvData = allLogs.map(log => [
        log.date, log.time,
        (log.water_flow || 0).toFixed(2), (log.water_pressure || 0).toFixed(2),
        (log.pump_motor_frequency || 0).toFixed(2), (log.pump_motor_current || 0).toFixed(2),
        (log.total_running_hours || 0).toFixed(2), (log.oxygen_flow || 0).toFixed(2),
      ]);
      const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sensor-logs-${deviceName}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click(); URL.revokeObjectURL(url);
    } catch (err) { alert('Failed to export CSV: ' + err.message); }
    finally { setExportLoading(false); }
  };

  const exportToPDF = async () => {
    setExportLoading(true);
    try {
      const allLogs = await fetchAllFilteredLogs(appliedFilters);
      const doc = new jsPDF();
      doc.setFontSize(16); doc.text(`Sensor Logs - ${deviceName}`, 14, 15);
      doc.setFontSize(10); doc.text(`Device ID: ${azure_device_id}`, 14, 22);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
      const nf = normalizeFilters(appliedFilters);
      if (nf.start || nf.end) doc.text(`Filter: ${nf.start || 'All'} to ${nf.end || 'All'}`, 14, 34);
      doc.text(`Total Records: ${allLogs.length}`, 14, 40);
      const tableData = allLogs.map(log => [
        log.date, log.time,
        (log.water_flow || 0).toFixed(2), (log.water_pressure || 0).toFixed(2),
        (log.pump_motor_frequency || 0).toFixed(2), (log.pump_motor_current || 0).toFixed(2),
        (log.total_running_hours || 0).toFixed(2), (log.oxygen_flow || 0).toFixed(2),
      ]);
      doc.autoTable({
        startY: 44,
        head: [[
          'Date', 'Time',
          `${getLabel(azure_device_id, 'log_water_flow')} (L/min)`,
          `${getLabel(azure_device_id, 'log_water_pressure')} (bar)`,
          `${getLabel(azure_device_id, 'log_pump_motor_frequency')} (Hz)`,
          `${getLabel(azure_device_id, 'log_pump_motor_current')} (A)`,
          `${getLabel(azure_device_id, 'log_total_running_hours')} (H)`,
          `${getLabel(azure_device_id, 'log_oxygen_flow')} (L/min)`,
        ]],
        body: tableData,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [13, 110, 253], fontSize: 9 },
      });
      doc.save(`sensor-logs-${deviceName}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) { alert('Failed to export PDF: ' + err.message); }
    finally { setExportLoading(false); }
  };

  const calculateXAxisInterval = (len) => {
    if (len <= 12) return 0; if (len <= 24) return 1; if (len <= 31) return 2; if (len <= 62) return 4;
    return Math.floor(len / 10);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dp = payload[0]?.payload;
      const singleDay = isSingleDayView();
      return (
        <div className="custom-tooltip" style={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', padding: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
            {singleDay ? `Time: ${label}` : (dp?.fullDate || label)}
          </p>
          {!dp?.hasData && <p style={{ color: '#f59e0b', fontStyle: 'italic', marginBottom: '8px' }}>No data recorded (showing 0)</p>}
          {payload.map((entry, i) => (
            <p key={i} style={{ color: entry.color, margin: '4px 0', fontSize: '13px' }}>{entry.name}: {entry.value} {entry.unit}</p>
          ))}
          {dp?.hasData && dp?.dataCount && (
            <p style={{ fontSize: '11px', color: '#888', marginTop: '8px', borderTop: '1px solid #eee', paddingTop: '8px' }}>Based on {dp.dataCount} reading{dp.dataCount > 1 ? 's' : ''}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const getFilterDisplayText = () => {
    const nf = normalizeFilters(appliedFilters);
    if (appliedFilters.start && !appliedFilters.end) return `Date: ${appliedFilters.start} (Single Day)`;
    if (!appliedFilters.start && appliedFilters.end) return `Date: ${appliedFilters.end} (Single Day)`;
    if (appliedFilters.start === appliedFilters.end) return `Date: ${appliedFilters.start} (Single Day)`;
    return `${nf.start || 'All'} to ${nf.end || 'All'}`;
  };

  // ===== RENDER GRAPH - USES CONTEXT LABELS =====
  const renderGraph = () => {
    if (graphData.length === 0) return null;
    const metrics = getMetrics();
    const singleDay = isSingleDayView();
    const dataPointsWithData = graphData.filter(d => d.hasData).length;
    const dataPointsWithoutData = graphData.length - dataPointsWithData;
    const metricsToShow = Object.entries(metrics).filter(([key]) => selectedMetrics[key]).map(([, m]) => m);
    const selectedCount = Object.values(selectedMetrics).filter(Boolean).length;

    const handleMetricToggle = (mk, cv) => {
      if (!cv && selectedCount >= 4) { alert('Max 4 metrics. Deselect one first.'); return; }
      setSelectedMetrics(prev => ({ ...prev, [mk]: !cv }));
    };

    const MetricCheckbox = ({ metricKey, metric }) => (
      <label className="metric-checkbox-label">
        <input type="checkbox" checked={selectedMetrics[metricKey]} onChange={() => handleMetricToggle(metricKey, selectedMetrics[metricKey])} disabled={!selectedMetrics[metricKey] && selectedCount >= 4} />
        <span style={{ color: metric.color }}>{metric.name}</span>
      </label>
    );

    const metricControls = (
      <div className="graph-controls-wrapper">
        <div className="metric-dropdown-container" ref={metricDropdownRef}>
          <button className="metric-dropdown-button" onClick={() => setIsMetricDropdownOpen(!isMetricDropdownOpen)}>
            Select Metrics ({selectedCount}/4)&nbsp;<FontAwesomeIcon icon={isMetricDropdownOpen ? faChevronUp : faChevronDown} />
          </button>
          {isMetricDropdownOpen && (
            <div className="metric-dropdown-menu">
              {Object.entries(metrics).map(([key, metric]) => (
                <MetricCheckbox key={key} metricKey={key} metric={metric} />
              ))}
            </div>
          )}
        </div>
      </div>
    );

    if (metricsToShow.length === 0) {
      return (
        <div className="graph-section">
          <div className="graph-header"><h3><FontAwesomeIcon icon={faChartLine} /> Sensor Data Graph</h3>{metricControls}</div>
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px', margin: '20px 0', border: '1px dashed #ced4da' }}>
            <p style={{ fontSize: '16px', color: '#666' }}>Please select at least one metric from the dropdown.</p>
          </div>
        </div>
      );
    }

    const xAxisInterval = calculateXAxisInterval(graphData.length);

    return (
      <div className="graph-section">
        <div className="graph-header">
          <h3><FontAwesomeIcon icon={faChartLine} /> Sensor Data Graph
            <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px' }}>({singleDay ? 'Hourly View - 24 Hours' : 'Daily View'})</span>
          </h3>
          {metricControls}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', backgroundColor: '#f0f9ff', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            📊 {graphData.length} {singleDay ? 'hours' : 'days'} displayed | <span style={{ color: '#22c55e' }}>● {dataPointsWithData} with data</span>
            {dataPointsWithoutData > 0 && <span style={{ color: '#f59e0b', marginLeft: '10px' }}>○ {dataPointsWithoutData} no data</span>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', padding: '8px 15px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: '500', color: '#475569', whiteSpace: 'nowrap' }}>Data Coverage:</span>
          <div style={{ flex: 1, display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
            {graphData.map((point, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: point.hasData ? '#22c55e' : '#e2e8f0', borderRight: i < graphData.length - 1 ? '1px solid #fff' : 'none' }}
                title={`${point.displayTime}: ${point.hasData ? `${point.dataCount} readings` : 'No data'}`} />
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={graphData} margin={{ top: 20, right: 80, left: 80, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="displayTime" angle={graphData.length > 12 ? -45 : 0} textAnchor={graphData.length > 12 ? "end" : "middle"} height={80}
              interval={xAxisInterval} tick={{ fontSize: 11, fill: '#4b5563' }} axisLine={{ stroke: '#9ca3af' }} tickLine={{ stroke: '#9ca3af' }}
              label={{ value: singleDay ? 'Hour of Day' : 'Date', position: 'insideBottom', offset: graphData.length > 12 ? -5 : -10, style: { fontSize: 12, fontWeight: 'bold', fill: '#374151' } }} />
            {selectedMetrics.waterFlow && <YAxis yAxisId="waterFlow" orientation="left" stroke={metrics.waterFlow.color} tick={{ fontSize: 9 }} width={70} domain={[0, 'auto']} />}
            {selectedMetrics.waterPressure && <YAxis yAxisId="waterPressure" orientation="right" stroke={metrics.waterPressure.color} tick={{ fontSize: 9 }} width={70} domain={[0, 'auto']} />}
            {selectedMetrics.pumpMotorFrequency && <YAxis yAxisId="pumpMotorFrequency" orientation="left" stroke={metrics.pumpMotorFrequency.color} tick={{ fontSize: 9 }} width={70} domain={[0, 'auto']} />}
            {selectedMetrics.pumpMotorCurrent && <YAxis yAxisId="pumpMotorCurrent" orientation="right" stroke={metrics.pumpMotorCurrent.color} tick={{ fontSize: 9 }} width={70} domain={[0, 'auto']} />}
            {metricsToShow.map(m => (
              <Line key={m.yAxisId} type="monotone" dataKey={m.key} stroke={m.color} name={m.name} yAxisId={m.yAxisId}
                unit={` ${m.unit}`} dot={{ r: 3, fill: m.color }} strokeWidth={2} activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} connectNulls />
            ))}
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="line" wrapperStyle={{ paddingBottom: '10px' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderPagination = () => {
    const pages = []; const maxVisible = 5;
    let ps = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let pe = Math.min(totalPages, ps + maxVisible - 1);
    if (pe - ps < maxVisible - 1) ps = Math.max(1, pe - maxVisible + 1);
    for (let i = ps; i <= pe; i++) pages.push(
      <button key={i} className={`pagination-number ${i === currentPage ? 'active' : ''}`} onClick={() => handlePageChange(i)}>{i}</button>
    );
    return pages;
  };

  return (
    <div className="log-details-container">
      <div className="log-details-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate(`/device/${azure_device_id}`)}><FontAwesomeIcon icon={faArrowLeft} /> Back to Device</button>
          <div className="header-titles">
            <h2>Sensor Data Logs</h2>
            <p className="device-info-text">{deviceName} | {azure_device_id}</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}><FontAwesomeIcon icon={faFilter} /> Filter</button>
          {isFilterApplied && (
            <>
              <button className="graph-btn" onClick={handleShowGraph} disabled={graphLoading}><FontAwesomeIcon icon={faChartLine} /> {graphLoading ? 'Loading...' : showGraph ? 'Refresh Graph' : 'Show Graph'}</button>
              <button className="export-btn csv-btn" onClick={exportToCSV} disabled={exportLoading}><FontAwesomeIcon icon={faFileCsv} /> {exportLoading ? 'Exporting...' : 'Export CSV'}</button>
              <button className="export-btn pdf-btn" onClick={exportToPDF} disabled={exportLoading}><FontAwesomeIcon icon={faFilePdf} /> {exportLoading ? 'Exporting...' : 'Export PDF'}</button>
            </>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-inputs">
            <div className="filter-group"><label>Start Date:</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="date-input" /></div>
            <div className="filter-group"><label>End Date: <span style={{ fontSize: '11px', color: '#666' }}>(optional)</span></label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="date-input" /></div>
          </div>
          <div className="filter-actions">
            <button className="apply-filter-btn" onClick={handleApplyFilters}>Apply Filter</button>
            <button className="clear-filter-btn" onClick={handleClearFilters}>Clear</button>
          </div>
        </div>
      )}

      <div className="records-info">
        <p>Showing {logs.length} of {totalRecords} records
          {isFilterApplied && (appliedFilters.start || appliedFilters.end) ? <span className="filter-indicator"> (Filtered: {getFilterDisplayText()})</span> : null}
        </p>
      </div>

      {showGraph && renderGraph()}

      {/* ===== TABLE WITH CONTEXT LABELS ===== */}
      <div className="logs-table-container">
        {loading ? <div className="loading-state">Loading logs...</div> :
          error ? <div className="error-state">Error: {error}</div> :
            logs.length === 0 ? <div className="empty-state"><p>No logs found</p></div> : (
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>{getLabel(azure_device_id, 'log_water_flow')}<br />(L/min)</th>
                    <th>{getLabel(azure_device_id, 'log_water_pressure')}<br />(bar)</th>
                    <th>{getLabel(azure_device_id, 'log_pump_motor_frequency')}</th>
                    <th>{getLabel(azure_device_id, 'log_pump_motor_current')}</th>
                    <th>{getLabel(azure_device_id, 'log_total_running_hours')}<br />(H)</th>
                    <th>{getLabel(azure_device_id, 'log_oxygen_flow')}<br />(L/min)</th>
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
                      <td>{(log.oxygen_flow || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
      </div>

      {!loading && !error && totalPages > 1 && (
        <div className="pagination-container">
          <button className="pagination-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faChevronLeft} /> Previous
          </button>
          <div className="pagination-numbers">{renderPagination()}</div>
          <button className="pagination-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LogDetails;