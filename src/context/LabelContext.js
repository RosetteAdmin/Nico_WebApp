// src/context/LabelContext.js
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const LabelContext = createContext();

// Default label mappings - single source of truth
const DEFAULT_LABELS = {
  // Config section labels
  pump_motor_frequency: 'Pump Motor Frequency',
  pump_motor_current: 'Pump Motor Current',
  total_running_hours: 'Total Running Hours',
  total_water_outlet: 'Total Water Outlet Qty',
  water_flow_rate: 'Water Flow Rate',
  water_pressure: 'Water Pressure',
  auto_sequence_counter: 'Auto Sequence Counter',
  auto_sequence_off_time: 'Auto Sequence OFF Time',
  auto_sequence_on_time: 'Auto Sequence ON Time',
  auto_mode: 'Auto Mode',
  oxygen_flow: 'Oxygen Flow',
  spare_1: 'Spare 1',

  // Gauge labels
  gauge_flow_rate: 'Water Flow Rate',
  gauge_pressure: 'Water Pressure',
  gauge_motor_frequency: 'Motor Frequency',
  gauge_motor_current: 'Motor Current',

  // Chart/Graph labels
  chart_flow_rate: 'Water Flow Rate',
  chart_pressure: 'Water Pressure',
  chart_total_water_outlet: 'Total Water Outlet',
  chart_total_running_hours: 'Total Running Hours',
  chart_pump_motor_frequency: 'Pump Motor Frequency',
  chart_pump_motor_current: 'Pump Motor Current',

  // Log Details table headers
  log_water_flow: 'Water Flow',
  log_water_pressure: 'Water Pressure',
  log_pump_motor_frequency: 'Pump Motor Frequency',
  log_pump_motor_current: 'Pump Motor Current',
  log_total_running_hours: 'Total Running Hours',
  log_oxygen_flow: 'Oxygen Flow',

  // Log Details graph metrics
  log_graph_water_flow: 'Water Flow',
  log_graph_water_pressure: 'Water Pressure',
  log_graph_pump_motor_frequency: 'Pump Motor Frequency',
  log_graph_pump_motor_current: 'Pump Motor Current',

  // Alert bit keys
  alert_auto_mode_fbk: 'Auto Mode FBK',
  alert_manual_mode_fbk: 'Manual Mode FBK',
  alert_vfd_trip_fbk: 'VFD Trip FBK',
  alert_pump_on_fbk: 'Pump ON FBK',
  alert_solenoid_valve_on_fbk: 'Solenoid Valve ON FBK',
  alert_oxygen_on_fbk: 'Oxygen ON FBK',
  alert_low_oxygen_flow: 'Low Oxygen Flow',
  alert_high_oxygen_flow: 'High Oxygen Flow',
  alert_auto_sequence_status: 'Auto Sequence Status',
  alert_spare_2: 'Spare 2',
  alert_spare_3: 'Spare 3',
  alert_spare_4: 'Spare 4',
  alert_spare_5: 'Spare 5',
  alert_spare_6: 'Spare 6',
  alert_spare_7: 'Spare 7',
  alert_spare_8: 'Spare 8',
};

// ============================================================
// LABEL GROUPS: Maps which keys should sync together
// When you edit one key, all linked keys update automatically
// ============================================================
const LABEL_SYNC_GROUPS = {
  // Flow Rate group
  water_flow_rate: ['gauge_flow_rate', 'chart_flow_rate', 'log_water_flow', 'log_graph_water_flow'],
  gauge_flow_rate: ['water_flow_rate', 'chart_flow_rate', 'log_water_flow', 'log_graph_water_flow'],
  chart_flow_rate: ['water_flow_rate', 'gauge_flow_rate', 'log_water_flow', 'log_graph_water_flow'],
  log_water_flow: ['water_flow_rate', 'gauge_flow_rate', 'chart_flow_rate', 'log_graph_water_flow'],
  log_graph_water_flow: ['water_flow_rate', 'gauge_flow_rate', 'chart_flow_rate', 'log_water_flow'],

  // Pressure group
  water_pressure: ['gauge_pressure', 'chart_pressure', 'log_water_pressure', 'log_graph_water_pressure'],
  gauge_pressure: ['water_pressure', 'chart_pressure', 'log_water_pressure', 'log_graph_water_pressure'],
  chart_pressure: ['water_pressure', 'gauge_pressure', 'log_water_pressure', 'log_graph_water_pressure'],
  log_water_pressure: ['water_pressure', 'gauge_pressure', 'chart_pressure', 'log_graph_water_pressure'],
  log_graph_water_pressure: ['water_pressure', 'gauge_pressure', 'chart_pressure', 'log_water_pressure'],

  // Pump Motor Frequency group
  pump_motor_frequency: ['gauge_motor_frequency', 'chart_pump_motor_frequency', 'log_pump_motor_frequency', 'log_graph_pump_motor_frequency'],
  gauge_motor_frequency: ['pump_motor_frequency', 'chart_pump_motor_frequency', 'log_pump_motor_frequency', 'log_graph_pump_motor_frequency'],
  chart_pump_motor_frequency: ['pump_motor_frequency', 'gauge_motor_frequency', 'log_pump_motor_frequency', 'log_graph_pump_motor_frequency'],
  log_pump_motor_frequency: ['pump_motor_frequency', 'gauge_motor_frequency', 'chart_pump_motor_frequency', 'log_graph_pump_motor_frequency'],
  log_graph_pump_motor_frequency: ['pump_motor_frequency', 'gauge_motor_frequency', 'chart_pump_motor_frequency', 'log_pump_motor_frequency'],

  // Pump Motor Current group
  pump_motor_current: ['gauge_motor_current', 'chart_pump_motor_current', 'log_pump_motor_current', 'log_graph_pump_motor_current'],
  gauge_motor_current: ['pump_motor_current', 'chart_pump_motor_current', 'log_pump_motor_current', 'log_graph_pump_motor_current'],
  chart_pump_motor_current: ['pump_motor_current', 'gauge_motor_current', 'log_pump_motor_current', 'log_graph_pump_motor_current'],
  log_pump_motor_current: ['pump_motor_current', 'gauge_motor_current', 'chart_pump_motor_current', 'log_graph_pump_motor_current'],
  log_graph_pump_motor_current: ['pump_motor_current', 'gauge_motor_current', 'chart_pump_motor_current', 'log_pump_motor_current'],

  // Total Running Hours group
  total_running_hours: ['chart_total_running_hours', 'log_total_running_hours'],
  chart_total_running_hours: ['total_running_hours', 'log_total_running_hours'],
  log_total_running_hours: ['total_running_hours', 'chart_total_running_hours'],

  // Oxygen Flow group
  oxygen_flow: ['log_oxygen_flow'],
  log_oxygen_flow: ['oxygen_flow'],

  // Total Water Outlet group
  total_water_outlet: ['chart_total_water_outlet'],
  chart_total_water_outlet: ['total_water_outlet'],
};

export const LabelProvider = ({ children }) => {
  // State per device: { [deviceId]: { labels, customized, defaults, maxValues, maxCustomized } }
  const [deviceLabels, setDeviceLabels] = useState({});
  const [loading, setLoading] = useState({});
  const fetchedDevices = useRef(new Set());

  const getUserEmail = useCallback(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.email) return user.email;
    } catch (e) {}
    try {
      const email = localStorage.getItem('email') || localStorage.getItem('userEmail') || localStorage.getItem('user_email');
      if (email) return email;
    } catch (e) {}
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.email) return payload.email;
      }
    } catch (e) {}
    return null;
  }, []);

  // ============================================================
  // FETCH labels for a device
  // ============================================================
  const fetchLabels = useCallback(async (deviceId, force = false) => {
    if (!force && fetchedDevices.current.has(deviceId)) return;

    const email = getUserEmail();
    if (!email) {
      setDeviceLabels(prev => ({
        ...prev,
        [deviceId]: {
          labels: {},
          customized: {},
          defaults: { ...DEFAULT_LABELS },
          maxValues: {},
          maxCustomized: {},
          loaded: true
        }
      }));
      fetchedDevices.current.add(deviceId);
      return;
    }

    setLoading(prev => ({ ...prev, [deviceId]: true }));

    try {
      const url = `${process.env.REACT_APP_EP}/data/users/${encodeURIComponent(email)}/devices/${deviceId}/labels`;
      const response = await fetch(url);

      if (!response.ok) {
        console.warn('Labels endpoint returned', response.status);
        setDeviceLabels(prev => ({
          ...prev,
          [deviceId]: {
            labels: {},
            customized: {},
            defaults: { ...DEFAULT_LABELS },
            maxValues: {},
            maxCustomized: {},
            loaded: true
          }
        }));
        fetchedDevices.current.add(deviceId);
        return;
      }

      const data = await response.json();

      if (data.status === 'success' && data.data) {
        const allLabels = data.data.labels || {};
        const allCustomized = data.data.customized || {};

        // Separate gauge max values from regular labels
        const regularLabels = {};
        const maxValues = {};
        const regularCustomized = {};
        const maxCustomized = {};

        Object.keys(allLabels).forEach(key => {
          if (key.endsWith('_max')) {
            maxValues[key] = allLabels[key];
          } else {
            regularLabels[key] = allLabels[key];
          }
        });

        Object.keys(allCustomized).forEach(key => {
          if (key.endsWith('_max')) {
            maxCustomized[key] = allCustomized[key];
          } else {
            regularCustomized[key] = allCustomized[key];
          }
        });

        setDeviceLabels(prev => ({
          ...prev,
          [deviceId]: {
            labels: regularLabels,
            customized: regularCustomized,
            defaults: data.data.defaults || { ...DEFAULT_LABELS },
            maxValues,
            maxCustomized,
            loaded: true
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching labels:', error);
      setDeviceLabels(prev => ({
        ...prev,
        [deviceId]: {
          labels: {},
          customized: {},
          defaults: { ...DEFAULT_LABELS },
          maxValues: {},
          maxCustomized: {},
          loaded: true
        }
      }));
    } finally {
      fetchedDevices.current.add(deviceId);
      setLoading(prev => ({ ...prev, [deviceId]: false }));
    }
  }, [getUserEmail]);

  // ============================================================
  // GET label for a specific key
  // ============================================================
  const getLabel = useCallback((deviceId, key) => {
    const device = deviceLabels[deviceId];
    if (!device) return DEFAULT_LABELS[key] || key;
    return device.labels[key] || device.defaults[key] || DEFAULT_LABELS[key] || key;
  }, [deviceLabels]);

  // ============================================================
  // SAVE label with sync group support
  // ============================================================
  const saveLabel = useCallback(async (deviceId, attributeKey, customLabel) => {
    const email = getUserEmail();
    if (!email) {
      console.warn('No user email, cannot save label');
      return;
    }

    // Build the labels object with synced keys
    const labelsToSave = { [attributeKey]: customLabel };

    // Add all synced keys
    const syncGroup = LABEL_SYNC_GROUPS[attributeKey];
    if (syncGroup) {
      syncGroup.forEach(syncedKey => {
        labelsToSave[syncedKey] = customLabel;
      });
    }

    console.log('💾 Saving labels (with sync):', labelsToSave);

    const url = `${process.env.REACT_APP_EP}/data/users/${encodeURIComponent(email)}/devices/${deviceId}/labels`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ labels: labelsToSave })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const data = await response.json();

    if (data.status === 'success') {
      // Optimistic update locally
      setDeviceLabels(prev => {
        const current = prev[deviceId] || { labels: {}, customized: {}, defaults: { ...DEFAULT_LABELS }, maxValues: {}, maxCustomized: {}, loaded: true };
        const newLabels = { ...current.labels };
        const newCustomized = { ...current.customized };

        Object.keys(labelsToSave).forEach(key => {
          newLabels[key] = labelsToSave[key];
          newCustomized[key] = true;
        });

        return {
          ...prev,
          [deviceId]: {
            ...current,
            labels: newLabels,
            customized: newCustomized
          }
        };
      });

      // Also re-fetch to ensure consistency
      await fetchLabels(deviceId, true);
    } else {
      throw new Error(data.message || 'Server returned error');
    }
  }, [getUserEmail, fetchLabels]);

  // ============================================================
  // RESET label with sync group support
  // ============================================================
  const resetLabel = useCallback(async (deviceId, attributeKey) => {
    const email = getUserEmail();
    if (!email) return;

    // Reset the primary key
    const keysToReset = [attributeKey];

    // Add all synced keys
    const syncGroup = LABEL_SYNC_GROUPS[attributeKey];
    if (syncGroup) {
      keysToReset.push(...syncGroup);
    }

    console.log('🔄 Resetting labels (with sync):', keysToReset);

    // Delete each key
    for (const key of keysToReset) {
      try {
        const url = `${process.env.REACT_APP_EP}/data/users/${encodeURIComponent(email)}/devices/${deviceId}/labels/${key}`;
        await fetch(url, { method: 'DELETE' });
      } catch (err) {
        console.error(`Failed to reset key ${key}:`, err);
      }
    }

    await fetchLabels(deviceId, true);
  }, [getUserEmail, fetchLabels]);

  // ============================================================
  // GAUGE MAX helpers
  // ============================================================
  const getGaugeMax = useCallback((deviceId, maxKey, defaultMax) => {
    const device = deviceLabels[deviceId];
    if (!device) return defaultMax;
    const customMax = device.maxValues[maxKey];
    if (customMax !== undefined && customMax !== null) {
      const num = parseFloat(customMax);
      if (isFinite(num) && num > 0) return num;
    }
    return defaultMax;
  }, [deviceLabels]);

  const isGaugeMaxCustomized = useCallback((deviceId, maxKey) => {
    const device = deviceLabels[deviceId];
    if (!device) return false;
    return !!device.maxCustomized[maxKey];
  }, [deviceLabels]);

  const saveGaugeMax = useCallback(async (deviceId, maxKey, maxValue) => {
    const email = getUserEmail();
    if (!email) return;

    const url = `${process.env.REACT_APP_EP}/data/users/${encodeURIComponent(email)}/devices/${deviceId}/labels`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ labels: { [maxKey]: String(maxValue) } })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const data = await response.json();
    if (data.status === 'success') {
      await fetchLabels(deviceId, true);
    } else {
      throw new Error(data.message || 'Server returned error');
    }
  }, [getUserEmail, fetchLabels]);

  const resetGaugeMax = useCallback(async (deviceId, maxKey) => {
    const email = getUserEmail();
    if (!email) return;

    const url = `${process.env.REACT_APP_EP}/data/users/${encodeURIComponent(email)}/devices/${deviceId}/labels/${maxKey}`;
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await fetchLabels(deviceId, true);
  }, [getUserEmail, fetchLabels]);

  // ============================================================
  // RESET ALL
  // ============================================================
  const resetAllLabels = useCallback(async (deviceId) => {
    const email = getUserEmail();
    if (!email) return;

    if (!window.confirm('Reset all custom names and gauge settings to defaults?')) return;

    const url = `${process.env.REACT_APP_EP}/data/users/${encodeURIComponent(email)}/devices/${deviceId}/labels`;
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    await fetchLabels(deviceId, true);
  }, [getUserEmail, fetchLabels]);

  // ============================================================
  // HELPER GETTERS
  // ============================================================
  const isCustomized = useCallback((deviceId, key) => {
    const device = deviceLabels[deviceId];
    if (!device) return false;
    return !!device.customized[key];
  }, [deviceLabels]);

  const getDefaultLabel = useCallback((deviceId, key) => {
    const device = deviceLabels[deviceId];
    if (!device) return DEFAULT_LABELS[key] || key;
    return device.defaults[key] || DEFAULT_LABELS[key] || key;
  }, [deviceLabels]);

  const isLoaded = useCallback((deviceId) => {
    const device = deviceLabels[deviceId];
    return device?.loaded || false;
  }, [deviceLabels]);

  const value = {
    fetchLabels,
    getLabel,
    saveLabel,
    resetLabel,
    resetAllLabels,
    isCustomized,
    getDefaultLabel,
    isLoaded,
    loading,
    getGaugeMax,
    isGaugeMaxCustomized,
    saveGaugeMax,
    resetGaugeMax,
    DEFAULT_LABELS,
    LABEL_SYNC_GROUPS,
  };

  return (
    <LabelContext.Provider value={value}>
      {children}
    </LabelContext.Provider>
  );
};

export const useLabels = () => {
  const context = useContext(LabelContext);
  if (!context) {
    throw new Error('useLabels must be used within a LabelProvider');
  }
  return context;
};

export default LabelContext;