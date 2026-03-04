import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import "./DeviceDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DeviceCharts from "../DataChart";
import { faLink, faPencil, faCheck, faSave, faTimes, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import axios from "axios";

// ==================== EDITABLE LABEL COMPONENT ====================
const EditableLabel = ({ attributeKey, currentLabel, defaultLabel, isCustomized, onSave, onReset }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentLabel);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => { setEditValue(currentLabel); }, [currentLabel]);
  useEffect(() => { if (isEditing && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); } }, [isEditing]);



  const handleSave = async () => {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === currentLabel) { setEditValue(currentLabel); setIsEditing(false); return; }
    setIsSaving(true);
    try { await onSave(attributeKey, trimmed); setIsEditing(false); }
    catch (err) { setEditValue(currentLabel); }
    finally { setIsSaving(false); }
  };

  const handleReset = async () => {
    setIsSaving(true);
    try { await onReset(attributeKey); setEditValue(defaultLabel); setIsEditing(false); }
    catch (err) { console.error('Failed to reset:', err); }
    finally { setIsSaving(false); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') { setEditValue(currentLabel); setIsEditing(false); }
  };

  if (isEditing) {
    return (
      <span className="editable-label editing" ref={containerRef}>
        <input ref={inputRef} type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { setTimeout(() => { if (containerRef.current && containerRef.current.contains(document.activeElement)) return; handleSave(); }, 200); }}
          className="label-edit-input" disabled={isSaving} maxLength={50} />
        <button className="label-btn label-save-btn" onClick={handleSave} disabled={isSaving} title="Save"><FontAwesomeIcon icon={faCheck} /></button>
        <button className="label-btn label-cancel-btn" onClick={() => { setEditValue(currentLabel); setIsEditing(false); }} disabled={isSaving} title="Cancel"><FontAwesomeIcon icon={faTimes} /></button>
        {isCustomized && <button className="label-btn label-reset-btn" onClick={handleReset} disabled={isSaving} title={`Reset to: "${defaultLabel}"`}><FontAwesomeIcon icon={faRotateLeft} /></button>}
      </span>
    );
  }

  return (
    <span className="editable-label">
      <span className={`label-text ${isCustomized ? 'customized' : ''}`} onClick={() => setIsEditing(true)}
        title={isCustomized ? `Custom (default: "${defaultLabel}"). Click to edit.` : 'Click to rename'}>
        {currentLabel}{isCustomized && <span className="custom-indicator">✎</span>}
      </span>
      <button className="label-btn label-edit-trigger" onClick={() => setIsEditing(true)} title="Rename"><FontAwesomeIcon icon={faPencil} /></button>
    </span>
  );
};

// ==================== EDITABLE MAX VALUE COMPONENT ====================
const EditableMaxValue = ({ gaugeKey, currentMax, defaultMax, isCustomized, onSave, onReset }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(currentMax));
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => { setEditValue(String(currentMax)); }, [currentMax]);
  useEffect(() => { if (isEditing && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); } }, [isEditing]);

  const handleSave = async () => {
    const num = parseFloat(editValue);
    if (isNaN(num) || num <= 0 || num === currentMax) {
      setEditValue(String(currentMax));
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(gaugeKey, num);
      setIsEditing(false);
    } catch (err) {
      setEditValue(String(currentMax));
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsSaving(true);
    try {
      await onReset(gaugeKey);
      setEditValue(String(defaultMax));
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to reset max:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') { setEditValue(String(currentMax)); setIsEditing(false); }
  };

  if (isEditing) {
    return (
      <span className="editable-max editing" ref={containerRef}>
        <input
          ref={inputRef}
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setTimeout(() => {
              if (containerRef.current && containerRef.current.contains(document.activeElement)) return;
              handleSave();
            }, 200);
          }}
          className="max-edit-input"
          disabled={isSaving}
          min="1"
          step="any"
        />
        <button className="label-btn label-save-btn" onClick={handleSave} disabled={isSaving} title="Save">
          <FontAwesomeIcon icon={faCheck} />
        </button>
        <button className="label-btn label-cancel-btn" onClick={() => { setEditValue(String(currentMax)); setIsEditing(false); }} disabled={isSaving} title="Cancel">
          <FontAwesomeIcon icon={faTimes} />
        </button>
        {isCustomized && (
          <button className="label-btn label-reset-btn" onClick={handleReset} disabled={isSaving} title={`Reset to default: ${defaultMax}`}>
            <FontAwesomeIcon icon={faRotateLeft} />
          </button>
        )}
      </span>
    );
  }

  return (
    <span className="editable-max">
      <span
        className={`max-value-text ${isCustomized ? 'customized' : ''}`}
        onClick={() => setIsEditing(true)}
        title={isCustomized ? `Custom max (default: ${defaultMax}). Click to edit.` : 'Click to set custom max'}
      >
        {currentMax}{isCustomized && <span className="custom-indicator">✎</span>}
      </span>
      <button className="label-btn label-edit-trigger" onClick={() => setIsEditing(true)} title="Edit max value">
        <FontAwesomeIcon icon={faPencil} />
      </button>
    </span>
  );
};

// ==================== PREMIUM GAUGE COMPONENT ====================
const GaugeChart = React.memo(({ value, min, max, unit, label, colorStops, icon, gaugeKey, defaultMax, isMaxCustomized, onSaveMax, onResetMax }) => {
  const canvasRef = useRef(null);
  const animatedValue = useRef(0);
  const animationRef = useRef(null);

  const originalValue = (() => {
    const v = Number(value);
    if (!isFinite(v) || isNaN(v)) return 0;
    return v;
  })();

  const safeValue = Math.min(Math.max(originalValue, min), max);

  const getColor = (val) => {
    const range = max - min;
    if (range === 0) return colorStops[0].color;
    const percentage = ((val - min) / range) * 100;
    for (let i = colorStops.length - 1; i >= 0; i--) {
      if (percentage >= colorStops[i].stop) return colorStops[i].color;
    }
    return colorStops[0].color;
  };

  const getGradientColors = (val) => {
    const range = max - min;
    if (range === 0) {
      return { primary: colorStops[0].color, glow: colorStops[0].glow || colorStops[0].color, bg: colorStops[0].bg || colorStops[0].color + '15' };
    }
    const percentage = ((val - min) / range) * 100;
    for (let i = colorStops.length - 1; i >= 0; i--) {
      if (percentage >= colorStops[i].stop) {
        return { primary: colorStops[i].color, glow: colorStops[i].glow || colorStops[i].color, bg: colorStops[i].bg || colorStops[i].color + '15' };
      }
    }
    return { primary: colorStops[0].color, glow: colorStops[0].glow || colorStops[0].color, bg: colorStops[0].bg || colorStops[0].color + '15' };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 220;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2 + 10;
    const radius = 78;
    const startAngle = Math.PI * 0.8;
    const endAngle = Math.PI * 2.2;
    const totalAngle = endAngle - startAngle;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    let isActive = true;

    const animate = () => {
      if (!isActive) return;
      const diff = safeValue - animatedValue.current;
      animatedValue.current += diff * 0.06;
      if (Math.abs(diff) < 0.01) animatedValue.current = safeValue;

      try {
        drawGauge(ctx, centerX, centerY, radius, startAngle, endAngle, totalAngle, animatedValue.current, size);
      } catch (err) {
        console.error('Gauge draw error:', err);
        isActive = false;
        return;
      }

      if (Math.abs(diff) > 0.01 && isActive) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      isActive = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [safeValue, min, max]);

  const drawGauge = (ctx, cx, cy, r, startAngle, endAngle, totalAngle, currentVal, size) => {
    ctx.clearRect(0, 0, size, size);

    const range = max - min;
    if (range === 0) return;

    const sanitizedVal = isFinite(currentVal) ? currentVal : min;
    const percentage = Math.max(0, Math.min((sanitizedVal - min) / range, 1));
    if (!isFinite(percentage)) return;

    const valueAngle = startAngle + totalAngle * percentage;
    if (!isFinite(valueAngle)) return;

    const colors = getGradientColors(sanitizedVal);

    // OUTER AMBIENT GLOW
    const ambientGlow = ctx.createRadialGradient(cx, cy, r - 20, cx, cy, r + 30);
    ambientGlow.addColorStop(0, colors.primary + '08');
    ambientGlow.addColorStop(0.5, colors.primary + '04');
    ambientGlow.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, r + 25, 0, Math.PI * 2);
    ctx.fillStyle = ambientGlow;
    ctx.fill();

    // BACKGROUND TRACK
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = '#e8ecf1';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    // INNER SHADOW TRACK
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = '#f1f3f6';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = '#e8ecf1';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    // COLORED PROGRESS ARC
    if (percentage > 0.005) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, valueAngle);
      ctx.strokeStyle = colors.primary + '25';
      ctx.lineWidth = 22;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, valueAngle);

      const gradX1 = cx + Math.cos(startAngle) * r;
      const gradY1 = cy + Math.sin(startAngle) * r;
      const gradX2 = cx + Math.cos(valueAngle) * r;
      const gradY2 = cy + Math.sin(valueAngle) * r;

      if (isFinite(gradX1) && isFinite(gradY1) && isFinite(gradX2) && isFinite(gradY2) && (gradX1 !== gradX2 || gradY1 !== gradY2)) {
        const arcGrad = ctx.createLinearGradient(gradX1, gradY1, gradX2, gradY2);
        arcGrad.addColorStop(0, colors.primary + 'CC');
        arcGrad.addColorStop(0.5, colors.primary);
        arcGrad.addColorStop(1, colors.glow);
        ctx.strokeStyle = arcGrad;
      } else {
        ctx.strokeStyle = colors.primary;
      }

      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.stroke();

      const dotX = cx + Math.cos(valueAngle) * r;
      const dotY = cy + Math.sin(valueAngle) * r;

      if (isFinite(dotX) && isFinite(dotY)) {
        const dotGlow = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 14);
        dotGlow.addColorStop(0, colors.primary + '60');
        dotGlow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(dotX, dotY, 14, 0, Math.PI * 2);
        ctx.fillStyle = dotGlow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
    }

    // TICK MARKS
    const majorTicks = 5;
    const minorTicks = 25;

    for (let i = 0; i <= minorTicks; i++) {
      const tickAngle = startAngle + (totalAngle * i) / minorTicks;
      const tickPercentage = i / minorTicks;
      const isPastValue = tickPercentage <= percentage;
      const innerR = r - 17;
      const outerR = r - 13;

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(tickAngle) * innerR, cy + Math.sin(tickAngle) * innerR);
      ctx.lineTo(cx + Math.cos(tickAngle) * outerR, cy + Math.sin(tickAngle) * outerR);
      ctx.strokeStyle = isPastValue ? colors.primary + '60' : '#d1d5db';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    for (let i = 0; i <= majorTicks; i++) {
      const tickAngle = startAngle + (totalAngle * i) / majorTicks;
      const tickPercentage = i / majorTicks;
      const isPastValue = tickPercentage <= percentage;
      const innerR = r - 22;
      const outerR = r - 13;

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(tickAngle) * innerR, cy + Math.sin(tickAngle) * innerR);
      ctx.lineTo(cx + Math.cos(tickAngle) * outerR, cy + Math.sin(tickAngle) * outerR);
      ctx.strokeStyle = isPastValue ? colors.primary + '90' : '#9ca3af';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();

      const labelR = r - 32;
      const tickValue = min + ((max - min) * i) / majorTicks;
      const labelX = cx + Math.cos(tickAngle) * labelR;
      const labelY = cy + Math.sin(tickAngle) * labelR;

      ctx.save();
      ctx.fillStyle = isPastValue ? '#374151' : '#9ca3af';
      ctx.font = `${isPastValue ? '600' : '400'} 9px 'Inter', system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let labelText;
      if (tickValue >= 1000) labelText = `${(tickValue / 1000).toFixed(0)}k`;
      else if (tickValue === Math.floor(tickValue)) labelText = tickValue.toFixed(0);
      else labelText = tickValue.toFixed(1);

      ctx.fillText(labelText, labelX, labelY);
      ctx.restore();
    }

    // NEEDLE
    const needleAngle = startAngle + totalAngle * percentage;
    const needleLength = r - 10;

    if (isFinite(needleAngle)) {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 2;

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(needleAngle) * needleLength, cy + Math.sin(needleAngle) * needleLength);
      ctx.lineTo(cx + Math.cos(needleAngle + Math.PI / 2) * 3, cy + Math.sin(needleAngle + Math.PI / 2) * 3);
      ctx.lineTo(cx + Math.cos(needleAngle + Math.PI) * 12, cy + Math.sin(needleAngle + Math.PI) * 12);
      ctx.lineTo(cx + Math.cos(needleAngle - Math.PI / 2) * 3, cy + Math.sin(needleAngle - Math.PI / 2) * 3);
      ctx.closePath();

      const nX1 = cx + Math.cos(needleAngle + Math.PI) * 12;
      const nY1 = cy + Math.sin(needleAngle + Math.PI) * 12;
      const nX2 = cx + Math.cos(needleAngle) * needleLength;
      const nY2 = cy + Math.sin(needleAngle) * needleLength;

      if (isFinite(nX1) && isFinite(nY1) && isFinite(nX2) && isFinite(nY2) && (nX1 !== nX2 || nY1 !== nY2)) {
        const needleGrad = ctx.createLinearGradient(nX1, nY1, nX2, nY2);
        needleGrad.addColorStop(0, '#6b7280');
        needleGrad.addColorStop(0.4, '#374151');
        needleGrad.addColorStop(0.8, colors.primary);
        needleGrad.addColorStop(1, colors.glow);
        ctx.fillStyle = needleGrad;
      } else {
        ctx.fillStyle = colors.primary;
      }

      ctx.fill();
      ctx.restore();
    }

    // CENTER HUB
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 6;

    const outerHub = ctx.createRadialGradient(cx, cy - 2, 0, cx, cy, 14);
    outerHub.addColorStop(0, '#f9fafb');
    outerHub.addColorStop(0.3, '#e5e7eb');
    outerHub.addColorStop(0.7, '#d1d5db');
    outerHub.addColorStop(1, '#9ca3af');
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fillStyle = outerHub;
    ctx.fill();
    ctx.restore();

    const innerHub = ctx.createRadialGradient(cx, cy - 2, 0, cx, cy, 10);
    innerHub.addColorStop(0, '#ffffff');
    innerHub.addColorStop(0.6, '#f3f4f6');
    innerHub.addColorStop(1, '#e5e7eb');
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fillStyle = innerHub;
    ctx.fill();
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    const dotGrad = ctx.createRadialGradient(cx, cy - 1, 0, cx, cy, 4);
    dotGrad.addColorStop(0, colors.glow);
    dotGrad.addColorStop(1, colors.primary);
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = dotGrad;
    ctx.fill();
  };

  const currentColor = getColor(Math.min(originalValue, max));
  const colors = getGradientColors(Math.min(originalValue, max));

  
  return (
    
    <div className="gauge-card" style={{ '--gauge-color': currentColor, '--gauge-glow': colors.glow }}>
      <div className="gauge-card-accent" style={{ background: `linear-gradient(90deg, ${currentColor}00, ${currentColor}, ${currentColor}00)` }} />

      <div className="gauge-card-header">
        <div className="gauge-icon-wrapper" style={{ background: colors.bg, borderColor: currentColor + '30' }}>
          <span className="gauge-icon">{icon}</span>
        </div>
        <span className="gauge-label">{label}</span>
      </div>

      <div className="gauge-canvas-wrapper">
        <canvas ref={canvasRef} className="gauge-canvas" />
        <div className="gauge-center-value">
          <span className="gauge-value" style={{ color: currentColor }}>
            {originalValue.toFixed(1)}
          </span>
          <span className="gauge-unit">{unit}</span>
        </div>
      </div>

      <div className="gauge-footer">
        <div className="gauge-range">
          <span className="gauge-min">{min}</span>
          <div className="gauge-max-editable">
            <span className="gauge-max-label">Max:</span>
            <EditableMaxValue
              gaugeKey={gaugeKey}
              currentMax={max}
              defaultMax={defaultMax}
              isCustomized={isMaxCustomized}
              onSave={onSaveMax}
              onReset={onResetMax}
            />
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.min === nextProps.min &&
    prevProps.max === nextProps.max &&
    prevProps.label === nextProps.label &&
    prevProps.isMaxCustomized === nextProps.isMaxCustomized
  );
});

// ==================== ENHANCED GAUGE CONFIGURATIONS ====================
  const safeDisplay = (val, decimals = 2) => {
  if (val === null || val === undefined || val === '') return (0).toFixed(decimals);
  if (typeof val === 'object' && val !== null) {
    const inner = val.value ?? val.Value ?? val.v ?? 0;
    const num = parseFloat(inner);
    return isFinite(num) ? num.toFixed(decimals) : (0).toFixed(decimals);
  }
  const num = parseFloat(val);
  return isFinite(num) ? num.toFixed(decimals) : (0).toFixed(decimals);
};

const GAUGE_CONFIGS = [
  {
    key: 'flowRate',
    dataField: 'flowRate',
    labelKey: 'gauge_flow_rate',
    maxKey: 'gauge_flow_rate_max',
    label: 'Water Flow Rate',
    unit: 'L/min',
    min: 0,
    max: 120,
    icon: '💧',
    colorStops: [
      { stop: 0, color: '#3b82f6', glow: '#60a5fa', bg: 'rgba(59,130,246,0.08)' },
      { stop: 30, color: '#10b981', glow: '#34d399', bg: 'rgba(16,185,129,0.08)' },
      { stop: 60, color: '#f59e0b', glow: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
      { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
    ]
  },
  {
    key: 'pressure',
    dataField: 'pressure',
    labelKey: 'gauge_pressure',
    maxKey: 'gauge_pressure_max',
    label: 'Water Pressure',
    unit: 'bar',
    min: 0,
    max: 10,
    icon: '🔵',
    colorStops: [
      { stop: 0, color: '#06b6d4', glow: '#22d3ee', bg: 'rgba(6,182,212,0.08)' },
      { stop: 30, color: '#10b981', glow: '#34d399', bg: 'rgba(16,185,129,0.08)' },
      { stop: 60, color: '#f59e0b', glow: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
      { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
    ]
  },
  {
    key: 'pumpMotorFrequency',
    dataField: 'pump_motor_frequency',
    labelKey: 'gauge_motor_frequency',
    maxKey: 'gauge_motor_frequency_max',
    label: 'Motor Frequency',
    unit: 'Hz',
    min: 0,
    max: 100,
    icon: '⚡',
    colorStops: [
      { stop: 0, color: '#8b5cf6', glow: '#a78bfa', bg: 'rgba(139,92,246,0.08)' },
      { stop: 30, color: '#3b82f6', glow: '#60a5fa', bg: 'rgba(59,130,246,0.08)' },
      { stop: 60, color: '#f59e0b', glow: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
      { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
    ]
  },
  {
    key: 'pumpMotorCurrent',
    dataField: 'pump_motor_current',
    labelKey: 'gauge_motor_current',
    maxKey: 'gauge_motor_current_max',
    label: 'Motor Current',
    unit: 'A',
    min: 0,
    max: 20,
    icon: '🔌',
    colorStops: [
      { stop: 0, color: '#14b8a6', glow: '#2dd4bf', bg: 'rgba(20,184,166,0.08)' },
      { stop: 30, color: '#22c55e', glow: '#4ade80', bg: 'rgba(34,197,94,0.08)' },
      { stop: 60, color: '#eab308', glow: '#facc15', bg: 'rgba(234,179,8,0.08)' },
      { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
    ]
  }
];

// ==================== ALERT BIT KEYS ====================
const ALERT_BIT_KEYS = [
  'alert_auto_mode_fbk', 'alert_manual_mode_fbk', 'alert_vfd_trip_fbk',
  'alert_pump_on_fbk', 'alert_solenoid_valve_on_fbk', 'alert_oxygen_on_fbk',
  'alert_low_oxygen_flow', 'alert_high_oxygen_flow', 'alert_auto_sequence_status',
  'alert_spare_2', 'alert_spare_3', 'alert_spare_4',
  'alert_spare_5', 'alert_spare_6', 'alert_spare_7', 'alert_spare_8',
];

// ==================== MAIN COMPONENT ====================
const DeviceDetails = () => {
  const { id } = useParams();

  // ===== GET USER EMAIL FOR LABELS =====
  const getUserEmail = () => {
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
  };
  const currentUserEmail = getUserEmail();

  console.log('🔑 Current User Email:', currentUserEmail);

  const isWaitingRef = useRef(false);
  const isAutoWaitingRef = useRef(false);
  const autoModeToggleTimeRef = useRef(0);
  const powerToggleTimeRef = useRef(0);

  const checkPowerStatusFromBit = (statusValue) => {
  // ==================== DEBUG START ====================
  console.log('🔍 [DEBUG] checkPowerStatusFromBit called with:', {
    statusValue,
    type: typeof statusValue,
    isNull: statusValue === null,
    isUndefined: statusValue === undefined,
    is0: statusValue === 0,
    binary: statusValue !== null && statusValue !== undefined ? 
      statusValue.toString(2).padStart(16, '0') : 'N/A'
  });
  // ==================== DEBUG END ====================

  if (statusValue === null || statusValue === undefined) {
    console.log('🔍 [DEBUG] → Returning FALSE (null/undefined)');
    return false;
  }
  
  const fourthBit = (statusValue >> 3) & 1;
  const result = fourthBit === 1;
  
  // ==================== DEBUG START ====================
  console.log('🔍 [DEBUG] → Bit calculation:', {
    statusValue,
    binary: statusValue.toString(2).padStart(16, '0'),
    shiftedBy3: (statusValue >> 3).toString(2).padStart(16, '0'),
    fourthBit,
    result
  });
  // ==================== DEBUG END ====================

  return result;
};

  const checkAutoModeFromBit = (statusValue) => {
    if (statusValue === null || statusValue === undefined) return false;
    const ninthBit = (statusValue >> 8) & 1;
    return ninthBit === 1;
  };

  // ===== LABEL STATE =====
  const [attributeLabels, setAttributeLabels] = useState({});
  const [customizedKeys, setCustomizedKeys] = useState({});
  const [defaultLabels, setDefaultLabels] = useState({});
  const [labelsLoaded, setLabelsLoaded] = useState(false);

  // ===== GAUGE MAX VALUES STATE =====
  const [gaugeMaxValues, setGaugeMaxValues] = useState({});
  const [customizedMaxKeys, setCustomizedMaxKeys] = useState({});

  const [powerStatusHistory, setPowerStatusHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [autoWaiting, setAutoWaiting] = useState(false);
  const [deviceName, setDeviceName] = useState("Loading...");
  const [deviceInfo, setDeviceInfo] = useState({
    owner_name: "Loading...",
    phone_number: "Loading...",
    email_id: "Loading...",
    location: "Loading...",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editableInfo, setEditableInfo] = useState({
    owner_name: "",
    phone_number: "",
    email_id: "",
    location: ""
  });

  const [isWriting, setIsWriting] = useState({
    counter: false,
    onTime: false,
    offTime: false
  });

  const [writeSuccess, setWriteSuccess] = useState({
    counter: false,
    onTime: false,
    offTime: false
  });

  const [lastWritten, setLastWritten] = useState({
    counter: "",
    onTime: "",
    offTime: ""
  });

  const navigate = useNavigate();

  const [deviceData, setDeviceData] = useState({
    nbGenerator: {
      flowRate: "",
      pressure: "",
      waterTemperature: "",
      systemTemperature: "",
      totalWaterOutlet: "",
      pump_motor_frequency: 0,
      pump_motor_current: 0,
      total_running_hours: 0,
      auto_sequence_on_time: 0,
      auto_sequence_off_time: 0,
      auto_sequence_counter: 0,
      auto_sequence_on_write: 0,
      auto_sequence_off_write: 0,
      auto_sequence_counter_write: 0,
      oxygen_flow: 0,
      spare_1: 0,
      alert_status: 0,
      timestamp: "",
    },
    ozoneGenerator: {
      flowRate: "",
      pressure: "",
      waterTemperature: "",
      systemTemperature: "",
      totalWaterOutlet: "",
      timestamp: "",
    },
    oxygenGenerator: {
      flowRate: "",
      pressure: "",
      waterTemperature: "",
      systemTemperature: "",
      totalWaterOutlet: "",
      timestamp: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [conn, setConn] = useState(false);
  const [nbWaiting, setNbWaiting] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [onTime, setOnTime] = useState("");
  const [offTime, setOffTime] = useState("");
  const [counter, setCounter] = useState("");
  const [isPowerOn, setIsPowerOn] = useState(false);

  const POWER_COOLDOWN_MS = 6000;
  const AUTO_MODE_COOLDOWN_MS = 6000;

  // ===== LABEL FUNCTIONS =====
  const getLabel = useCallback((key) => {
    return attributeLabels[key] || defaultLabels[key] || key;
  }, [attributeLabels, defaultLabels]);

  // ===== GAUGE MAX HELPER =====
  const getGaugeMax = useCallback((config) => {
    const customMax = gaugeMaxValues[config.maxKey];
    if (customMax !== undefined && customMax !== null) {
      const num = parseFloat(customMax);
      if (isFinite(num) && num > 0) return num;
    }
    return config.max;
  }, [gaugeMaxValues]);

  const isGaugeMaxCustomized = useCallback((maxKey) => {
    return !!customizedMaxKeys[maxKey];
  }, [customizedMaxKeys]);

  const fetchLabels = useCallback(async () => {
    if (!currentUserEmail) {
      console.warn('No user email available, using default labels');
      setLabelsLoaded(true);
      return;
    }
    try {
      const url = `${process.env.REACT_APP_EP}/data/users/${encodeURIComponent(currentUserEmail)}/devices/${id}/labels`;
      const response = await fetch(url);

      if (!response.ok) {
        console.warn('Labels endpoint returned', response.status);
        setLabelsLoaded(true);
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

        setAttributeLabels(regularLabels);
        setCustomizedKeys(regularCustomized);
        setDefaultLabels(data.data.defaults || {});
        setGaugeMaxValues(maxValues);
        setCustomizedMaxKeys(maxCustomized);
      }
    } catch (error) {
      console.error('❌ Error fetching labels:', error);
    } finally {
      setLabelsLoaded(true);
    }
  }, [currentUserEmail, id]);

  const saveLabel = useCallback(async (attributeKey, customLabel) => {
    if (!currentUserEmail) {
      console.warn('No user email, cannot save label');
      return;
    }

    const url = `${process.env.REACT_APP_EP}/data/users/${encodeURIComponent(currentUserEmail)}/devices/${id}/labels`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ labels: { [attributeKey]: customLabel } })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const data = await response.json();

    if (data.status === 'success' && data.data) {
      // Re-parse to separate max values
      await fetchLabels();
    } else {
      throw new Error(data.message || 'Server returned error');
    }
  }, [currentUserEmail, id, fetchLabels]);

  const resetLabel = useCallback(async (attributeKey) => {
    if (!currentUserEmail) return;

    const url = `${process.env.REACT_APP_EP}/data/users/${encodeURIComponent(currentUserEmail)}/devices/${id}/labels/${attributeKey}`;
    const response = await fetch(url, { method: 'DELETE' });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await fetchLabels();
  }, [currentUserEmail, id, fetchLabels]);

  // ===== GAUGE MAX SAVE/RESET =====
  const saveGaugeMax = useCallback(async (maxKey, maxValue) => {
    if (!currentUserEmail) {
      console.warn('No user email, cannot save gauge max');
      return;
    }

    const url = `${process.env.REACT_APP_EP}/data/users/${encodeURIComponent(currentUserEmail)}/devices/${id}/labels`;
    console.log('💾 Saving gauge max:', { maxKey, maxValue });

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
      console.log('✅ Gauge max saved successfully');
      await fetchLabels();
    } else {
      throw new Error(data.message || 'Server returned error');
    }
  }, [currentUserEmail, id, fetchLabels]);

  const resetGaugeMax = useCallback(async (maxKey) => {
    if (!currentUserEmail) return;

    const url = `${process.env.REACT_APP_EP}/data/users/${encodeURIComponent(currentUserEmail)}/devices/${id}/labels/${maxKey}`;
    const response = await fetch(url, { method: 'DELETE' });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await fetchLabels();
  }, [currentUserEmail, id, fetchLabels]);

  const resetAllLabels = useCallback(async () => {
    if (!currentUserEmail || !window.confirm('Reset all custom names and gauge settings to defaults?')) return;

    const url = `${process.env.REACT_APP_EP}/data/users/${encodeURIComponent(currentUserEmail)}/devices/${id}/labels`;
    const response = await fetch(url, { method: 'DELETE' });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (data.status === 'success' && data.data) {
      setAttributeLabels(data.data.labels || {});
      setCustomizedKeys({});
      setGaugeMaxValues({});
      setCustomizedMaxKeys({});
    }
  }, [currentUserEmail, id]);

  const fetchPowerStatusHistory = async () => {
    if (!conn) return;

    setLoadingHistory(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_EP}/data/devices/${id}/power-status-history?limit=20`
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      if (data.status === 'success') {
        setPowerStatusHistory(data.data);
      }
    } catch (error) {
      console.error('Error fetching power status history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchDeviceData = async () => {
  try {
    const telemetryRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`);

    if (!telemetryRes.ok) {
      console.error(`❌ [fetchDeviceData] HTTP ${telemetryRes.status}`);
      return;
    }

    const data = await telemetryRes.json();

    // ==================== DEBUG START ====================
    console.log('🔍 [DEBUG] Raw API response:', JSON.stringify({
      alert_status: data.nbGenerator?.alert_status,
      alert_status_type: typeof data.nbGenerator?.alert_status,
      alert_status_binary: data.nbGenerator?.alert_status ? 
        (data.nbGenerator.alert_status).toString(2).padStart(16, '0') : 'N/A',
      bit3_value: data.nbGenerator?.alert_status ? 
        ((data.nbGenerator.alert_status >> 3) & 1) : 'N/A',
      flowRate: data.nbGenerator?.flowRate,
      flowRate_type: typeof data.nbGenerator?.flowRate,
      pressure: data.nbGenerator?.pressure,
      pressure_type: typeof data.nbGenerator?.pressure,
      timestamp: data.nbGenerator?.timestamp
    }, null, 2));
    // ==================== DEBUG END ====================

    setDeviceData({
      nbGenerator: {
        ...data.nbGenerator,
        pump_motor_frequency: data.nbGenerator?.pump_motor_frequency ?? 0,
        pump_motor_current: data.nbGenerator?.pump_motor_current ?? 0,
        total_running_hours: data.nbGenerator?.total_running_hours ?? 0,
        auto_sequence_on_time: data.nbGenerator?.auto_sequence_on_time ?? 0,
        auto_sequence_off_time: data.nbGenerator?.auto_sequence_off_time ?? 0,
        auto_sequence_counter: data.nbGenerator?.auto_sequence_counter ?? 0,
        auto_sequence_on_write: data.nbGenerator?.auto_sequence_on_write ?? 0,
        auto_sequence_off_write: data.nbGenerator?.auto_sequence_off_write ?? 0,
        auto_sequence_counter_write: data.nbGenerator?.auto_sequence_counter_write ?? 0,
        oxygen_flow: data.nbGenerator?.oxygen_flow ?? 0,
        spare_1: data.nbGenerator?.spare_1 ?? 0,
        alert_status: data.nbGenerator?.alert_status ?? 0
      },
      ozoneGenerator: { ...data.ozoneGenerator },
      oxygenGenerator: { ...data.oxygenGenerator },
    });

    const alertStatus = data.nbGenerator?.alert_status;

    // ==================== DEBUG START ====================
    console.log('🔍 [DEBUG] Power check conditions:', {
      isWaitingRef: isWaitingRef.current,
      timeSincePowerToggle: Date.now() - powerToggleTimeRef.current,
      POWER_COOLDOWN_MS,
      cooldownExpired: (Date.now() - powerToggleTimeRef.current) > POWER_COOLDOWN_MS,
      alertStatus,
      alertStatus_type: typeof alertStatus,
      alertStatus_isNull: alertStatus === null,
      alertStatus_isUndefined: alertStatus === undefined,
      alertStatus_is0: alertStatus === 0,
      checkResult: checkPowerStatusFromBit(alertStatus),
      currentIsPowerOn: isPowerOn
    });
    // ==================== DEBUG END ====================

    if (!isWaitingRef.current) {
      const timeSincePowerToggle = Date.now() - powerToggleTimeRef.current;

      if (timeSincePowerToggle > POWER_COOLDOWN_MS) {
        const newPowerStatus = checkPowerStatusFromBit(alertStatus);
        
        // ==================== DEBUG START ====================
        console.log('🔍 [DEBUG] Will update power status:', {
          newPowerStatus,
          currentIsPowerOn: isPowerOn,
          willChange: isPowerOn !== newPowerStatus
        });
        // ==================== DEBUG END ====================

        setIsPowerOn(prevStatus => {
          if (prevStatus !== newPowerStatus) {
            console.log(`🔄 [DEBUG] Power status CHANGING: ${prevStatus} → ${newPowerStatus}`);
            return newPowerStatus;
          }
          return prevStatus;
        });
      } else {
        console.log('⏳ [DEBUG] Still in cooldown, skipping power update. Remaining:', 
          POWER_COOLDOWN_MS - timeSincePowerToggle, 'ms');
      }
    } else {
      console.log('⏳ [DEBUG] isWaitingRef is TRUE, skipping power update');
    }

    // Same for auto mode
    if (!isAutoWaitingRef.current) {
      const timeSinceAutoToggle = Date.now() - autoModeToggleTimeRef.current;

      if (timeSinceAutoToggle > AUTO_MODE_COOLDOWN_MS) {
        const newAutoMode = checkAutoModeFromBit(alertStatus);
        setAutoMode(prevMode => {
          if (prevMode !== newAutoMode) return newAutoMode;
          return prevMode;
        });
      }
    }

    if (nbWaiting) setNbWaiting(false);

  } catch (err) {
    console.error("❌ [fetchDeviceData] Error:", err);
    setNbWaiting(false);
  }
};

  const writeToRegister = async (registerType, value) => {
    if (!value || value === '') return false;

    const fieldMap = {
      'auto_sequence_counter': 'counter',
      'auto_sequence_on': 'onTime',
      'auto_sequence_off': 'offTime'
    };

    const fieldName = fieldMap[registerType];
    setIsWriting(prev => ({ ...prev, [fieldName]: true }));

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_EP}/api/devices/${id}/write-register`,
        { registerType: registerType, value: parseInt(value) }
      );

      if (response.data.success) {
        setWriteSuccess(prev => ({ ...prev, [fieldName]: true }));
        setLastWritten(prev => ({ ...prev, [fieldName]: value }));

        switch (registerType) {
          case 'auto_sequence_counter': setCounter(''); break;
          case 'auto_sequence_on': setOnTime(''); break;
          case 'auto_sequence_off': setOffTime(''); break;
          default: break;
        }

        setTimeout(() => {
          setWriteSuccess(prev => ({ ...prev, [fieldName]: false }));
        }, 5000);

        await fetchDeviceData();
        return true;
      }
    } catch (error) {
      console.error('Error writing to register:', error);
      return false;
    } finally {
      setIsWriting(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleCounterClick = async () => { if (counter) await writeToRegister('auto_sequence_counter', counter); };
  const handleOnTimeClick = async () => { if (onTime) await writeToRegister('auto_sequence_on', onTime); };
  const handleOffTimeClick = async () => { if (offTime) await writeToRegister('auto_sequence_off', offTime); };

  const handleEditToggle = async () => {
    if (isEditMode) {
      if (!editableInfo.email_id || !editableInfo.owner_name) {
        alert("Please fill in both owner name and email fields");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (editableInfo.email_id !== "N/A" && !emailRegex.test(editableInfo.email_id)) {
        alert("Please enter a valid email address");
        return;
      }

      const confirmUpdate = window.confirm("Are you sure you want to update this device?");
      if (!confirmUpdate) return;

      setLoading(true);

      try {
        const response = await fetch(`${process.env.REACT_APP_EP}/data/updatedevice`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            azure_device_id: id,
            owner_name: editableInfo.owner_name,
            email_id: editableInfo.email_id,
            phone_number: editableInfo.phone_number,
            location: editableInfo.location
          }),
        });

        const result = await response.json();

        if (result.status === "success") {
          alert("Device updated successfully!");
          setDeviceInfo(editableInfo);
          setIsEditMode(false);
        } else {
          alert(`Failed to update device: ${result.message}`);
        }
      } catch (error) {
        console.error("Error updating device:", error);
        alert("Failed to update device. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditMode(true);
    }
  };

  const handleInputChange = (field, value) => {
    setEditableInfo(prev => ({ ...prev, [field]: value }));
  };

  // ===== FETCH LABELS ON MOUNT =====
  useEffect(() => { fetchLabels(); }, [fetchLabels]);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_EP}/data/devices/${id}/info`);

        if (!response.ok) {
          const fallbackInfo = { owner_name: "N/A", phone_number: "N/A", email_id: "N/A", location: "N/A" };
          setDeviceInfo(fallbackInfo);
          setEditableInfo(fallbackInfo);
          return;
        }

        const resp = await response.json();

        if (resp.status === "success" && resp.data) {
          const { owner_name, phone_number, email_id, location } = resp.data;
          const info = {
            owner_name: owner_name || "N/A",
            phone_number: phone_number || "N/A",
            email_id: email_id || "N/A",
            location: location || "N/A",
          };
          setDeviceInfo(info);
          setEditableInfo(info);
        }
      } catch (error) {
        console.error("Error fetching device info:", error);
        const fallbackInfo = { owner_name: "N/A", phone_number: "N/A", email_id: "N/A", location: "N/A" };
        setDeviceInfo(fallbackInfo);
        setEditableInfo(fallbackInfo);
      }
    };

    fetchDeviceInfo();
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${process.env.REACT_APP_EP}/api/devices`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((payload) => {
        const list = Array.isArray(payload) ? payload : payload.value || [];
        const dev = (list || []).find((d) => String(d.id) === String(id));
        if (!cancelled) setDeviceName(dev ? dev.displayName || dev.name || "N/A" : "N/A");
      })
      .catch(() => { if (!cancelled) setDeviceName("Error"); });
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    const fetchInitialStatus = async () => {
      try {
        const statusRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/status`);

        if (!statusRes.ok) {
          setConn(false);
          setLoading(false);
          return;
        }

        const statusData = await statusRes.json();
        const isConnected = statusData.status === "Connected";
        setConn(isConnected);

        if (isConnected) {
          try {
            const telemetryRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`);
            if (telemetryRes.ok) {
              const data = await telemetryRes.json();

              setDeviceData({
                nbGenerator: {
                  ...data.nbGenerator,
                  pump_motor_frequency: data.nbGenerator?.pump_motor_frequency ?? 0,
                  pump_motor_current: data.nbGenerator?.pump_motor_current ?? 0,
                  total_running_hours: data.nbGenerator?.total_running_hours ?? 0,
                  auto_sequence_on_time: data.nbGenerator?.auto_sequence_on_time ?? 0,
                  auto_sequence_off_time: data.nbGenerator?.auto_sequence_off_time ?? 0,
                  auto_sequence_counter: data.nbGenerator?.auto_sequence_counter ?? 0,
                  auto_sequence_on_write: data.nbGenerator?.auto_sequence_on_write ?? 0,
                  auto_sequence_off_write: data.nbGenerator?.auto_sequence_off_write ?? 0,
                  auto_sequence_counter_write: data.nbGenerator?.auto_sequence_counter_write ?? 0,
                  oxygen_flow: data.nbGenerator?.oxygen_flow ?? 0,
                  spare_1: data.nbGenerator?.spare_1 ?? 0,
                  alert_status: data.nbGenerator?.alert_status ?? 0,
                },
                ozoneGenerator: { ...data.ozoneGenerator },
                oxygenGenerator: { ...data.oxygenGenerator },
              });

              const alertStatus = data.nbGenerator?.alert_status;
              setIsPowerOn(checkPowerStatusFromBit(alertStatus));
              setAutoMode(checkAutoModeFromBit(alertStatus));
            }
          } catch (telemetryError) {
            console.error("Telemetry fetch failed:", telemetryError);
          }
        }
      } catch (error) {
        console.error("Error fetching initial status:", error);
        setConn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialStatus();

    const safetyTimer = setTimeout(() => {
      setLoading((prev) => {
        if (prev) { console.warn("⚠️ Safety timeout: forcing loading to false"); return false; }
        return prev;
      });
    }, 8000);

    return () => clearTimeout(safetyTimer);
  }, [id]);

  useEffect(() => {
    if (!conn) return;

    fetchPowerStatusHistory();

    const dataInterval = setInterval(() => { fetchDeviceData(); }, 5000);
    const historyInterval = setInterval(() => { fetchPowerStatusHistory(); }, 30000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(historyInterval);
    };
  }, [conn, id]);

  // const handlePowerToggle = async () => {
  //   const desired = !isPowerOn;

  //   setNbWaiting(true);
  //   isWaitingRef.current = true;
  //   powerToggleTimeRef.current = Date.now();

  //   if (!conn) {
  //     setNbWaiting(false);
  //     isWaitingRef.current = false;
  //     powerToggleTimeRef.current = 0;
  //     return;
  //   }

  //   setIsPowerOn(desired);

  //   try {
  //     const url = `${process.env.REACT_APP_EP}/api/devices/${id}/toggle/nb`;
  //     const body = { action: desired ? "on" : "off" };

  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(body),
  //     });

  //     const data = await response.json();
  //     if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);

  //     setTimeout(async () => {
  //       isWaitingRef.current = false;
  //       setNbWaiting(false);
  //       await fetchPowerStatusHistory();
  //     }, 5000);

  //   } catch (err) {
  //     console.error("❌ [handlePowerToggle] Error:", err);
  //     setIsPowerOn(!desired);
  //     setNbWaiting(false);
  //     isWaitingRef.current = false;
  //     powerToggleTimeRef.current = 0;
  //     alert("Error updating power status. Please try again.");
  //   }
  // };

  // const handleAutoModeToggle = async () => {
  //   const desired = !autoMode;

  //   setAutoWaiting(true);
  //   isAutoWaitingRef.current = true;
  //   autoModeToggleTimeRef.current = Date.now();

  //   if (!conn) {
  //     setAutoWaiting(false);
  //     isAutoWaitingRef.current = false;
  //     autoModeToggleTimeRef.current = 0;
  //     return;
  //   }

  //   setAutoMode(desired);

  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/toggle/auto`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ action: desired ? "on" : "off" }),
  //     });

  //     if (!response.ok) throw new Error(`HTTP ${response.status}`);

  //     setTimeout(() => {
  //       isAutoWaitingRef.current = false;
  //       setAutoWaiting(false);
  //     }, 5000);

  //   } catch (err) {
  //     console.error("❌ [handleAutoModeToggle] Error:", err);
  //     setAutoMode(!desired);
  //     setAutoWaiting(false);
  //     isAutoWaitingRef.current = false;
  //     autoModeToggleTimeRef.current = 0;
  //     alert("Error toggling auto mode. Please try again.");
  //   }
  // };



const handlePowerToggle = async () => {
  const desired = !isPowerOn;

  console.log('🔌 [DEBUG] handlePowerToggle called:', {
    currentIsPowerOn: isPowerOn,
    desired,
    conn,
    nbWaiting,
    isWaitingRef: isWaitingRef.current
  });

  setNbWaiting(true);
  isWaitingRef.current = true;
  powerToggleTimeRef.current = Date.now();

  if (!conn) {
    console.log('❌ [DEBUG] Not connected, aborting toggle');
    setNbWaiting(false);
    isWaitingRef.current = false;
    powerToggleTimeRef.current = 0;
    return;
  }

  setIsPowerOn(desired);
  console.log('🔌 [DEBUG] Optimistically set isPowerOn to:', desired);

  try {
    const url = `${process.env.REACT_APP_EP}/api/devices/${id}/toggle/nb`;
    const body = { action: desired ? "on" : "off" };

    console.log('🔌 [DEBUG] Sending toggle request:', { url, body });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    console.log('🔌 [DEBUG] Toggle response:', {
      status: response.status,
      ok: response.ok,
      data
    });

    if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);

    console.log('✅ [DEBUG] Toggle successful. Setting timeout to release waiting...');
    
    setTimeout(async () => {
      console.log('🔌 [DEBUG] Cooldown timer fired. Releasing waiting state.');
      console.log('🔌 [DEBUG] Before release:', {
        isWaitingRef: isWaitingRef.current,
        powerToggleTimeRef: powerToggleTimeRef.current
      });
      
      isWaitingRef.current = false;
      setNbWaiting(false);
      
      console.log('🔌 [DEBUG] After release:', {
        isWaitingRef: isWaitingRef.current
      });
      
      await fetchPowerStatusHistory();
      await fetchDeviceData(); // Force immediate fetch
    }, 5000);

  } catch (err) {
    console.error("❌ [handlePowerToggle] Error:", err);
    setIsPowerOn(!desired);
    setNbWaiting(false);
    isWaitingRef.current = false;
    powerToggleTimeRef.current = 0;
    alert("Error updating power status. Please try again.");
  }
};

const handleAutoModeToggle = async () => {
  const desired = !autoMode;

  setAutoWaiting(true);
  isAutoWaitingRef.current = true;
  autoModeToggleTimeRef.current = Date.now();

  if (!conn) {
    setAutoWaiting(false);
    isAutoWaitingRef.current = false;
    autoModeToggleTimeRef.current = 0;
    return;
  }

  setAutoMode(desired);

  try {
    const response = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/toggle/auto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: desired ? "on" : "off" }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 504 || data.isTimeout) {
        console.warn("⚠️ Auto mode toggle timed out but command may have been sent");
        setTimeout(async () => {
          isAutoWaitingRef.current = false;
          setAutoWaiting(false);
          await fetchDeviceData();
        }, 5000);
        return;
      }
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    setTimeout(() => {
      isAutoWaitingRef.current = false;
      setAutoWaiting(false);
    }, 5000);

  } catch (err) {
    console.error("❌ [handleAutoModeToggle] Error:", err);

    if (!err.message.includes('timeout') && !err.message.includes('not responding')) {
      setAutoMode(!desired);
    }

    setAutoWaiting(false);
    isAutoWaitingRef.current = false;
    autoModeToggleTimeRef.current = 0;

    const message = err.message.includes('timeout') || err.message.includes('not responding')
      ? "Device is slow to respond. The command may have been sent - please wait and check the status."
      : "Error toggling auto mode. Please try again.";

    alert(message);
  }
};


  const getStatusText = (isPowered, timestamp, isWaiting) => {
    if (!conn) return "Disconnected";
    if (isWaiting) return "request sent";
    if (!isPowerOn) return "System OFF";
    return "";
  };

  const getGaugeValue = (dataField) => {
    const val = deviceData.nbGenerator[dataField];
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return isFinite(val) ? val : 0;
    if (typeof val === 'object' && val !== null) {
      const innerVal = val.value ?? val.Value ?? val.v ?? 0;
      const num = Number(innerVal);
      return isFinite(num) ? num : 0;
    }
    if (typeof val === 'string') {
      let num = Number(val);
      if (isFinite(num)) return num;
      const match = val.match(/[-+]?[0-9]*\.?[0-9]+/);
      if (match) { num = parseFloat(match[0]); return isFinite(num) ? num : 0; }
    }
    return 0;
  };

  return (
    <>
      <div className="device-details-banner">
        <div className="device-details-header">
          <h2 className="device-details-title">
            <span className="device-name">{deviceName}</span> ||{" "}
            <span className="device-name">{id}</span>
          </h2>
          <div className="device-details-status">
            <span className="device-connection-status">
              <FontAwesomeIcon icon={faLink} className={`status-icon ${conn ? "green" : "red"}`} />
              {conn ? "Connected" : "Disconnected"}
            </span>
            <span className={`connection-badge ${isPowerOn ? "on" : "off"}`}>{isPowerOn ? "ON" : "OFF"}</span>
            <span className={`connection-label ${isPowerOn ? "green" : "red"}`}>
              {isPowerOn ? "Power ON" : "Power OFF"}
            </span>
          </div>
        </div>
        {conn && (
          <div className="device-power-status-banner">
            <span className={`power-badge ${isPowerOn ? "on" : "off"}`}>{isPowerOn ? "ON" : "OFF"}</span>
            <span className={`power-label ${isPowerOn ? "green" : "red"}`}>{isPowerOn ? "Power ON" : "Power OFF"}</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="loading-backdrop">
          <div className="loading-spinner"></div>
          <div className="loading-text">Waiting for device...</div>
        </div>
      )}

      {!loading && (
        <div className="device-detail-container">
          {/* Basic Info */}
          <div className="device-info-card">
            <div className="device-info-header">
              <h3 className="section-title">Device Basic Information:</h3>
              <button className="editt-btn" onClick={handleEditToggle}>
                <FontAwesomeIcon icon={isEditMode ? faSave : faPencil} />
                {isEditMode ? "Save" : "Edit"}
              </button>
            </div>
            <div className="device-info-grid">
              <p><strong>Device Name:</strong> {deviceName}</p>
              <p className={isEditMode ? "editable-field-container" : ""}>
                <strong>Owner Name:</strong>
                {isEditMode ? (
                  <input type="text" value={editableInfo.owner_name} onChange={(e) => handleInputChange("owner_name", e.target.value)} className="inline-edit-input" />
                ) : (<span>{deviceInfo.owner_name}</span>)}
              </p>
              <p className={isEditMode ? "editable-field-container" : ""}>
                <strong>Owner Phone:</strong>
                {isEditMode ? (
                  <input type="tel" value={editableInfo.phone_number} onChange={(e) => handleInputChange("phone_number", e.target.value)} className="inline-edit-input" />
                ) : (<span>{deviceInfo.phone_number}</span>)}
              </p>
              <p><strong>Device ID:</strong> {id}</p>
              <p className={isEditMode ? "editable-field-container" : ""}>
                <strong>Owner Email ID:</strong>
                {isEditMode ? (
                  <input type="email" value={editableInfo.email_id} onChange={(e) => handleInputChange("email_id", e.target.value)} className="inline-edit-input" />
                ) : (<span>{deviceInfo.email_id}</span>)}
              </p>
              <p className={isEditMode ? "editable-field-container" : ""}>
                <strong>Device Sector:</strong>
                {isEditMode ? (
                  <input type="text" value={editableInfo.location} onChange={(e) => handleInputChange("location", e.target.value)} className="inline-edit-input" />
                ) : (<span>{deviceInfo.location}</span>)}
              </p>
            </div>
          </div>

          {/* Connection + Power section */}
          <div className="device-info-card">
            <div>
              <div className="device-info-header">
                <h3 className="section-title">Device Connection Status and Power:</h3>
              </div>

              <div className="power-status-layout">
                <div className="power-status-left">
                  <div className="device-connection-grid">
                    <p><strong>Connection Status:</strong> {conn ? "Connected" : "Disconnected"}</p>
                    <p><strong>Last Updated:</strong> {deviceData.nbGenerator.timestamp ? new Date(deviceData.nbGenerator.timestamp).toLocaleString() : 'N/A'}</p>

                    <div className="power-item">
                      <span>System Power </span>
                      <div className="power-toggle">
                        <span className={nbWaiting ? "status-waiting" : ""}>
                          {getStatusText(isPowerOn, deviceData.nbGenerator.timestamp, nbWaiting)}
                        </span>
                        <label className={`toggle-switch ${nbWaiting ? "toggle-waiting" : ""}`}>
                          <input type="checkbox" checked={isPowerOn} onChange={() => !nbWaiting && handlePowerToggle()} disabled={nbWaiting || !conn} />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="power-status-right">
                  <h4 className="status-history-title">Power Status History:</h4>
                  {loadingHistory ? (
                    <div className="status-history-loading">Loading history...</div>
                  ) : powerStatusHistory.length === 0 ? (
                    <div className="status-history-empty">No status history available</div>
                  ) : (
                    <div className="status-history-table-container">
                      <table className="status-history-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {powerStatusHistory.map((record, index) => (
                            <tr key={record.id} className={index === 0 ? 'current-status' : ''}>
                              <td>
                                {new Date(record.timestamp).toLocaleDateString('en-GB', {
                                  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                              </td>
                              <td><span className={`status-badge ${record.status.toLowerCase()}`}>{record.status}</span></td>
                              <td>{record.duration_formatted}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Device Configuration & Alerts */}
          <div className="device-info-card device-power-status">
            <div>
              <div className="config-section-header">
                <h3 className="section-title">Device Configuration & Alerts:</h3>
                {(Object.keys(customizedKeys).length > 0 || Object.keys(customizedMaxKeys).length > 0) && (
                  <button className="reset-all-labels-btn" onClick={resetAllLabels} title="Reset all custom names and gauge settings to defaults">
                    <FontAwesomeIcon icon={faRotateLeft} /> Reset All Names
                  </button>
                )}
              </div>

              <div className="device-config-container">
                {/* Headings Row */}
                <div className="config-row headings-row">
                  <div className="config-item config-item-left"></div>
                  <div className="config-item config-item-right">
                    <div className="config-headings">
                      <span className="config-heading">Actual</span>
                      <span className="config-heading">Set Value</span>
                      <span className="config-heading">Set New Value</span>
                      <span className="config-heading-spacer"></span>
                    </div>
                  </div>
                </div>

                {/* First Row */}
                <div className="config-row">
                  <div className="config-item">
                    <label>
                      <EditableLabel attributeKey="pump_motor_frequency" currentLabel={getLabel('pump_motor_frequency')} defaultLabel={defaultLabels.pump_motor_frequency || 'Pump Motor Frequency'} isCustomized={!!customizedKeys.pump_motor_frequency} onSave={saveLabel} onReset={resetLabel} />:
                    </label>
                    {/* <span className="config-value">{deviceData.nbGenerator.pump_motor_frequency || 0} Hz</span> */}
                    {/* <span className="config-value">{Number(deviceData.nbGenerator.pump_motor_frequency || 0).toFixed(2)} Hz</span> */}
                    <span className="config-value">{(parseFloat(typeof deviceData.nbGenerator.pump_motor_frequency === 'object' ? (deviceData.nbGenerator.pump_motor_frequency?.value ?? 0) : deviceData.nbGenerator.pump_motor_frequency) || 0).toFixed(2)} Hz</span>
                  </div>
                  <div className="config-item">
                    <label>
                      <EditableLabel attributeKey="auto_sequence_counter" currentLabel={getLabel('auto_sequence_counter')} defaultLabel={defaultLabels.auto_sequence_counter || 'Auto Sequence Counter'} isCustomized={!!customizedKeys.auto_sequence_counter} onSave={saveLabel} onReset={resetLabel} />:
                    </label>
                    <div className="editable-field">
                      <input type="number" value={deviceData.nbGenerator.auto_sequence_counter ?? 0} disabled={true} readOnly={true} className="config-input" title="Actual Counter Value" />
                      <input type="number" value={deviceData.nbGenerator.auto_sequence_counter_write ?? 0} disabled={true} readOnly={true} className="config-input" title="Previously Written Counter Value" />
                      <input type="number" value={counter} onChange={(e) => setCounter(e.target.value)} placeholder="Enter value" className="config-input editing" disabled={isWriting.counter} min="0" max="65535" />
                      <button className={`editt-btn ${writeSuccess.counter ? 'success-btn' : ''}`} onClick={handleCounterClick} disabled={!conn || isWriting.counter || !counter} title={counter ? "Click to write value" : "Enter a value first"}>
                        {isWriting.counter ? (<span className="spinner">⟳</span>) : (<FontAwesomeIcon icon={writeSuccess.counter ? faCheck : faCircleCheck} />)}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Second Row */}
                <div className="config-row">
                  <div className="config-item">
                    <label>
                      <EditableLabel attributeKey="pump_motor_current" currentLabel={getLabel('pump_motor_current')} defaultLabel={defaultLabels.pump_motor_current || 'Pump Motor Current'} isCustomized={!!customizedKeys.pump_motor_current} onSave={saveLabel} onReset={resetLabel} />:
                    </label>
                    {/* <span className="config-value">{Number(deviceData.nbGenerator.pump_motor_current || 0).toFixed(2)} A</span> */}
                    {/* <span className="config-value">{Number(deviceData.nbGenerator.pump_motor_current || 0).toFixed(2)} A</span> */}
                    <span className="config-value">{(parseFloat(typeof deviceData.nbGenerator.pump_motor_current === 'object' ? (deviceData.nbGenerator.pump_motor_current?.value ?? 0) : deviceData.nbGenerator.pump_motor_current) || 0).toFixed(2)} A</span>
                  </div>
                  <div className="config-item">
                    <label>
                      <EditableLabel attributeKey="auto_sequence_off_time" currentLabel={getLabel('auto_sequence_off_time')} defaultLabel={defaultLabels.auto_sequence_off_time || 'Auto Sequence OFF Time'} isCustomized={!!customizedKeys.auto_sequence_off_time} onSave={saveLabel} onReset={resetLabel} />:
                    </label>
                    <div className="editable-field">
                      <input type="number" value={deviceData.nbGenerator.auto_sequence_off_time ?? 0} disabled={true} readOnly={true} className="config-input" title="Actual OFF Time" />
                      <input type="number" value={deviceData.nbGenerator.auto_sequence_off_write ?? 0} disabled={true} readOnly={true} className="config-input" title="Previously Written OFF Time" />
                      <input type="number" value={offTime} onChange={(e) => setOffTime(e.target.value)} placeholder="Enter value" className="config-input editing" disabled={isWriting.offTime} min="0" max="65535" />
                      <button className={`editt-btn ${writeSuccess.offTime ? 'success-btn' : ''}`} onClick={handleOffTimeClick} disabled={!conn || isWriting.offTime || !offTime} title={offTime ? "Click to write value" : "Enter a value first"}>
                        {isWriting.offTime ? (<span className="spinner">⟳</span>) : (<FontAwesomeIcon icon={writeSuccess.offTime ? faCheck : faCircleCheck} />)}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Third Row */}
                <div className="config-row">
                  <div className="config-item">
                    <label>
                      <EditableLabel attributeKey="total_running_hours" currentLabel={getLabel('total_running_hours')} defaultLabel={defaultLabels.total_running_hours || 'Total Running Hours'} isCustomized={!!customizedKeys.total_running_hours} onSave={saveLabel} onReset={resetLabel} />:
                    </label>
                    {/* <span className="config-value">{deviceData.nbGenerator.total_running_hours || 0} H</span> */}
                    {/* <span className="config-value">{Number(deviceData.nbGenerator.total_running_hours || 0).toFixed(2)} H</span> */}
                    <span className="config-value">{(parseFloat(typeof deviceData.nbGenerator.total_running_hours === 'object' ? (deviceData.nbGenerator.total_running_hours?.value ?? 0) : deviceData.nbGenerator.total_running_hours) || 0).toFixed(2)} H</span>
                  </div>
                  <div className="config-item">
                    <label>
                      <EditableLabel attributeKey="auto_sequence_on_time" currentLabel={getLabel('auto_sequence_on_time')} defaultLabel={defaultLabels.auto_sequence_on_time || 'Auto Sequence ON Time'} isCustomized={!!customizedKeys.auto_sequence_on_time} onSave={saveLabel} onReset={resetLabel} />:
                    </label>
                    <div className="editable-field">
                      <input type="number" value={deviceData.nbGenerator.auto_sequence_on_time ?? 0} disabled={true} readOnly={true} className="config-input" title="Actual ON Time" />
                      <input type="number" value={deviceData.nbGenerator.auto_sequence_on_write ?? 0} disabled={true} readOnly={true} className="config-input" title="Previously Written ON Time" />
                      <input type="number" value={onTime} onChange={(e) => setOnTime(e.target.value)} placeholder="Enter value" className="config-input editing" disabled={isWriting.onTime} min="0" max="65535" />
                      <button className={`editt-btn ${writeSuccess.onTime ? 'success-btn' : ''}`} onClick={handleOnTimeClick} disabled={!conn || isWriting.onTime || !onTime} title={onTime ? "Click to write value" : "Enter a value first"}>
                        {isWriting.onTime ? (<span className="spinner">⟳</span>) : (<FontAwesomeIcon icon={writeSuccess.onTime ? faCheck : faCircleCheck} />)}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Fourth Row */}
                <div className="config-row">
                  <div className="config-item">
                    <label>
                      <EditableLabel attributeKey="total_water_outlet" currentLabel={getLabel('total_water_outlet')} defaultLabel={defaultLabels.total_water_outlet || 'Total Water Outlet Qty'} isCustomized={!!customizedKeys.total_water_outlet} onSave={saveLabel} onReset={resetLabel} />:
                    </label>
                    <span className="config-value">{deviceData.nbGenerator.totalWaterOutlet || 0} L</span>
                  </div>
                  <div className="config-item">
                    <label>
                      <EditableLabel attributeKey="auto_mode" currentLabel={getLabel('auto_mode')} defaultLabel={defaultLabels.auto_mode || 'Auto Mode'} isCustomized={!!customizedKeys.auto_mode} onSave={saveLabel} onReset={resetLabel} />:
                    </label>
                    <div className="auto-mode-toggle-container">
                      <span className={`auto-mode-status ${autoMode ? 'on' : 'off'}`}>
                        {autoWaiting ? 'Switching...' : (autoMode ? 'ON' : 'OFF')}
                      </span>
                      <label className={`auto-mode-switch ${autoWaiting ? "auto-mode-waiting" : ""}`}>
                        <input type="checkbox" checked={autoMode} onChange={() => !autoWaiting && handleAutoModeToggle()} disabled={autoWaiting || !conn} />
                        <span className="auto-mode-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Fifth Row */}
                <div className="config-row">
                  <div className="config-item">
                    <label>
                      <EditableLabel attributeKey="water_flow_rate" currentLabel={getLabel('water_flow_rate')} defaultLabel={defaultLabels.water_flow_rate || 'Water Flow Rate'} isCustomized={!!customizedKeys.water_flow_rate} onSave={saveLabel} onReset={resetLabel} />:
                    </label>
                    {/* <span className="config-value">{(parseFloat(typeof deviceData.nbGenerator.flowRate === 'object' ? (deviceData.nbGenerator.flowRate?.value ?? 0) : deviceData.nbGenerator.flowRate) || 0).toFixed(2)} L/Min</span> */}
                    <span className="config-value">{safeDisplay(deviceData.nbGenerator.flowRate)} L/min</span>
                  </div>
                  <div className="config-item">
                    <label>
                      <EditableLabel attributeKey="oxygen_flow" currentLabel={getLabel('oxygen_flow')} defaultLabel={defaultLabels.oxygen_flow || 'Oxygen Flow'} isCustomized={!!customizedKeys.oxygen_flow} onSave={saveLabel} onReset={resetLabel} />:
                    </label>
                    {/* <span className="config-value">{deviceData.nbGenerator.oxygen_flow || 0} L/min</span> */}
                    {/* <span className="config-value">{Number(deviceData.nbGenerator.oxygen_flow || 0).toFixed(2)} L/min</span> */}
                    <span className="config-value">{(parseFloat(typeof deviceData.nbGenerator.oxygen_flow === 'object' ? (deviceData.nbGenerator.oxygen_flow?.value ?? 0) : deviceData.nbGenerator.oxygen_flow) || 0).toFixed(2)} L/min</span>

                  </div>
                </div>

                {/* Sixth Row */}
                <div className="config-row">
                  <div className="config-item">
                    <label>
                      <EditableLabel attributeKey="water_pressure" currentLabel={getLabel('water_pressure')} defaultLabel={defaultLabels.water_pressure || 'Water Pressure'} isCustomized={!!customizedKeys.water_pressure} onSave={saveLabel} onReset={resetLabel} />:
                    </label>
                    {/* <span className="config-value">{(parseFloat(typeof deviceData.nbGenerator.pressure === 'object' ? (deviceData.nbGenerator.pressure?.value ?? 0) : deviceData.nbGenerator.pressure) || 0).toFixed(2)} bar</span> */}
                    <span className="config-value">{safeDisplay(deviceData.nbGenerator.pressure)} bar</span>
                  </div>
                  <div className="config-item">
                    <label>
                      <EditableLabel attributeKey="spare_1" currentLabel={getLabel('spare_1')} defaultLabel={defaultLabels.spare_1 || 'Spare 1'} isCustomized={!!customizedKeys.spare_1} onSave={saveLabel} onReset={resetLabel} />:
                    </label>
                    {/* <span className="config-value">{deviceData.nbGenerator.spare_1 || 0} L/min</span> */}
                    {/* <span className="config-value">{Number(deviceData.nbGenerator.spare_1 || 0).toFixed(2)} L/min</span> */}
                    <span className="config-value">{(parseFloat(typeof deviceData.nbGenerator.spare_1 === 'object' ? (deviceData.nbGenerator.spare_1?.value ?? 0) : deviceData.nbGenerator.spare_1) || 0).toFixed(2)} L/min</span>

                  </div>
                </div>

                {/* ==================== GAUGE ROW ==================== */}
                {/* <div className="config-gauge-row">
                  <div className="config-gauge-header">
                    <div className="config-gauge-title-wrapper">
                      <span className="config-gauge-title-icon">📡</span>
                      <h4 className="config-gauge-title">Live Sensor Readings</h4>
                    </div>
                    <div className="config-gauge-live-badge">
                      <span className="config-gauge-live-dot"></span>
                      LIVE
                    </div>
                  </div>
                  <div className="config-gauges-grid">
                    {GAUGE_CONFIGS.map((config) => (
                      <GaugeChart
                        key={config.key}
                        gaugeKey={config.maxKey}
                        value={getGaugeValue(config.dataField)}
                        min={config.min}
                        max={getGaugeMax(config)}
                        defaultMax={config.max}
                        unit={config.unit}
                        label={getLabel(config.labelKey)}
                        icon={config.icon}
                        colorStops={config.colorStops}
                        isMaxCustomized={isGaugeMaxCustomized(config.maxKey)}
                        onSaveMax={saveGaugeMax}
                        onResetMax={resetGaugeMax}
                      />
                    ))}
                  </div>
                </div> */}
                {/* ==================== GAUGE ROW ==================== */}
{/* <div className="config-gauge-row">
  <div className="config-gauge-header">
    <div className="config-gauge-title-wrapper">
      <span className="config-gauge-title-icon">📡</span>
      <h4 className="config-gauge-title">Live Sensor Readings</h4>
    </div>
    <div className="config-gauge-header-right">
      <div className="config-gauge-live-badge">
        <span className="config-gauge-live-dot"></span>
        LIVE
      </div>
      <button 
        className="view-logs-btn"
        onClick={() => navigate(`/device/${id}/logdetails`)}
      >
        View All Sensor Logs
      </button>
    </div>
  </div>
  <div className="config-gauges-grid">
    {GAUGE_CONFIGS.map((config) => (
      <GaugeChart
        key={config.key}
        gaugeKey={config.maxKey}
        value={getGaugeValue(config.dataField)}
        min={config.min}
        max={getGaugeMax(config)}
        defaultMax={config.max}
        unit={config.unit}
        label={getLabel(config.labelKey)}
        icon={config.icon}
        colorStops={config.colorStops}
        isMaxCustomized={isGaugeMaxCustomized(config.maxKey)}
        onSaveMax={saveGaugeMax}
        onResetMax={resetGaugeMax}
      />
    ))}
  </div>
</div> */}
<hr className="section-divider" />
<div className="config-gauge-row">
  <div className="config-gauge-header">
    <div className="config-gauge-title-wrapper">
      <span className="config-gauge-title-icon">📡</span>
      <h4 className="config-gauge-title">Live Sensor Readings</h4>
    </div>
    <div className="config-gauge-header-right">
      <div className="config-gauge-live-badge">
        <span className="config-gauge-live-dot"></span>
        LIVE
      </div>
      <button 
        className="view-logs-btn"
        onClick={() => navigate(`/device/${id}/logdetails`)}
      >
        View All Sensor Logs
      </button>
    </div>
  </div>
  <div className="config-gauges-grid">
    {GAUGE_CONFIGS.map((config) => (
      <GaugeChart
        key={config.key}
        gaugeKey={config.maxKey}
        value={getGaugeValue(config.dataField)}
        min={config.min}
        max={getGaugeMax(config)}
        defaultMax={config.max}
        unit={config.unit}
        label={getLabel(config.labelKey)}
        icon={config.icon}
        colorStops={config.colorStops}
        isMaxCustomized={isGaugeMaxCustomized(config.maxKey)}
        onSaveMax={saveGaugeMax}
        onResetMax={resetGaugeMax}
      />
    ))}
  </div>
</div>
              </div>
            </div>
              {/* Charts */}
          <DeviceCharts deviceId={id} />
          </div>

        

          {/* Device Alert and Info History */}
          {/* <div className="device-info-card">
            <div>
              <h3 className="section-title">Device Alert and Info History:</h3>
              <div className="alert-status-info">
                <p><strong>Alert Status Value:</strong> {deviceData.nbGenerator.alert_status || 0}</p>
                <p><strong>Binary Representation:</strong> {(deviceData.nbGenerator.alert_status || 0).toString(2).padStart(16, '0')}</p>
              </div>
              <div className="table-wrapper">
                <table className="alert-info-table">
                  <thead>
                    <tr>
                      {ALERT_BIT_KEYS.map((key) => (
                        <th key={key}>
                          <EditableLabel
                            attributeKey={key}
                            currentLabel={getLabel(key)}
                            defaultLabel={defaultLabels[key] || key}
                            isCustomized={!!customizedKeys[key]}
                            onSave={saveLabel}
                            onReset={resetLabel}
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {(() => {
                        const alertStatus = deviceData.nbGenerator.alert_status || 0;
                        const bits = [];
                        for (let i = 0; i < 16; i++) {
                          const bitValue = (alertStatus >> i) & 1;
                          bits.push(
                            <td key={i} className={`bit-value ${bitValue === 1 ? 'bit-on' : 'bit-off'}`}>{bitValue}</td>
                          );
                        }
                        return bits;
                      })()}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div> */}
          {/* Device Alert and Info History */}
{/* Device Alert and Info History */}
{/* Device Alert and Info History */}
<div className="device-info-card">
  <div>
    <h3 className="section-title">Device Alert and Info History:</h3>
    {/* <div className="alert-status-info">
      <p><strong>Alert Status Value:</strong> {deviceData.nbGenerator.alert_status || 0}</p>
      <p><strong>Binary Representation:</strong> {(deviceData.nbGenerator.alert_status || 0).toString(2).padStart(16, '0')}</p>
    </div> */}
    
    {/* Scrollable Alert Grid - 1 Row Visible */}
    <div className="alert-grid-wrapper">
      <div className="alert-grid">
        {(() => {
          const alertStatus = deviceData.nbGenerator.alert_status || 0;
          return ALERT_BIT_KEYS.map((key, index) => {
            const bitValue = (alertStatus >> index) & 1;
            return (
              <div key={key} className={`alert-item ${bitValue === 1 ? 'alert-on' : 'alert-off'}`}>
                {/* <div className="alert-label">
                  <EditableLabel
                    attributeKey={key}
                    currentLabel={getLabel(key)}
                    defaultLabel={defaultLabels[key] || key}
                    isCustomized={!!customizedKeys[key]}
                    onSave={saveLabel}
                    onReset={resetLabel}
                  />
                </div> */}
                <div className="alert-label">
  {getLabel(key)}
</div>
                <div className={`alert-value ${bitValue === 1 ? 'value-on' : 'value-off'}`}>
                  {bitValue === 1 ? 'ON' : 'OFF'}
                </div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  </div>
</div>
        </div>
      )}
    </>
  );
};

export default DeviceDetails;