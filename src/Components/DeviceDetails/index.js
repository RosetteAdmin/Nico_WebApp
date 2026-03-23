// // src/pages/DeviceDetails.jsx
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "./DeviceDetails.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import DeviceCharts from "../DataChart";
// import {
//   faLink, faPencil, faCheck, faSave, faTimes, faRotateLeft
// } from "@fortawesome/free-solid-svg-icons";
// import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
// import axios from "axios";
// import { useLabels } from '../../context/LabelContext';

// // ==================== EDITABLE LABEL COMPONENT ====================
// const EditableLabel = ({ deviceId, attributeKey, onSave, onReset }) => {
//   const { getLabel, isCustomized, getDefaultLabel } = useLabels();

//   const currentLabel = getLabel(deviceId, attributeKey);
//   const defaultLabel = getDefaultLabel(deviceId, attributeKey);
//   const customized = isCustomized(deviceId, attributeKey);

//   const [isEditing, setIsEditing] = useState(false);
//   const [editValue, setEditValue] = useState(currentLabel);
//   const [isSaving, setIsSaving] = useState(false);
//   const inputRef = useRef(null);
//   const containerRef = useRef(null);

//   useEffect(() => { setEditValue(currentLabel); }, [currentLabel]);
//   useEffect(() => {
//     if (isEditing && inputRef.current) {
//       inputRef.current.focus();
//       inputRef.current.select();
//     }
//   }, [isEditing]);

//   const handleSave = async () => {
//     const trimmed = editValue.trim();
//     if (!trimmed || trimmed === currentLabel) {
//       setEditValue(currentLabel);
//       setIsEditing(false);
//       return;
//     }
//     setIsSaving(true);
//     try {
//       await onSave(attributeKey, trimmed);
//       setIsEditing(false);
//     } catch (err) {
//       setEditValue(currentLabel);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleReset = async () => {
//     setIsSaving(true);
//     try {
//       await onReset(attributeKey);
//       setEditValue(defaultLabel);
//       setIsEditing(false);
//     } catch (err) {
//       console.error('Failed to reset:', err);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') handleSave();
//     else if (e.key === 'Escape') { setEditValue(currentLabel); setIsEditing(false); }
//   };

//   if (isEditing) {
//     return (
//       <span className="editable-label editing" ref={containerRef}>
//         <input
//           ref={inputRef} type="text" value={editValue}
//           onChange={(e) => setEditValue(e.target.value)}
//           onKeyDown={handleKeyDown}
//           onBlur={() => {
//             setTimeout(() => {
//               if (containerRef.current && containerRef.current.contains(document.activeElement)) return;
//               handleSave();
//             }, 200);
//           }}
//           className="label-edit-input" disabled={isSaving} maxLength={50}
//         />
//         <button className="label-btn label-save-btn" onClick={handleSave} disabled={isSaving} title="Save">
//           <FontAwesomeIcon icon={faCheck} />
//         </button>
//         <button className="label-btn label-cancel-btn" onClick={() => { setEditValue(currentLabel); setIsEditing(false); }} disabled={isSaving} title="Cancel">
//           <FontAwesomeIcon icon={faTimes} />
//         </button>
//         {customized && (
//           <button className="label-btn label-reset-btn" onClick={handleReset} disabled={isSaving} title={`Reset to: "${defaultLabel}"`}>
//             <FontAwesomeIcon icon={faRotateLeft} />
//           </button>
//         )}
//       </span>
//     );
//   }

//   return (
//     <span className="editable-label">
//       <span
//         className={`label-text ${customized ? 'customized' : ''}`}
//         onClick={() => setIsEditing(true)}
//         title={customized ? `Custom (default: "${defaultLabel}"). Click to edit.` : 'Click to rename'}
//       >
//         {currentLabel}{customized && <span className="custom-indicator">✎</span>}
//       </span>
//       <button className="label-btn label-edit-trigger" onClick={() => setIsEditing(true)} title="Rename">
//         <FontAwesomeIcon icon={faPencil} />
//       </button>
//     </span>
//   );
// };

// // ==================== EDITABLE MAX VALUE COMPONENT ====================
// const EditableMaxValue = ({ gaugeKey, currentMax, defaultMax, isCustomized, onSave, onReset }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editValue, setEditValue] = useState(String(currentMax));
//   const [isSaving, setIsSaving] = useState(false);
//   const inputRef = useRef(null);
//   const containerRef = useRef(null);

//   useEffect(() => { setEditValue(String(currentMax)); }, [currentMax]);
//   useEffect(() => {
//     if (isEditing && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); }
//   }, [isEditing]);

//   const handleSave = async () => {
//     const num = parseFloat(editValue);
//     if (isNaN(num) || num <= 0 || num === currentMax) {
//       setEditValue(String(currentMax));
//       setIsEditing(false);
//       return;
//     }
//     setIsSaving(true);
//     try { await onSave(gaugeKey, num); setIsEditing(false); }
//     catch (err) { setEditValue(String(currentMax)); }
//     finally { setIsSaving(false); }
//   };

//   const handleReset = async () => {
//     setIsSaving(true);
//     try { await onReset(gaugeKey); setEditValue(String(defaultMax)); setIsEditing(false); }
//     catch (err) { console.error('Failed to reset max:', err); }
//     finally { setIsSaving(false); }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') handleSave();
//     else if (e.key === 'Escape') { setEditValue(String(currentMax)); setIsEditing(false); }
//   };

//   if (isEditing) {
//     return (
//       <span className="editable-max editing" ref={containerRef}>
//         <input ref={inputRef} type="number" value={editValue}
//           onChange={(e) => setEditValue(e.target.value)} onKeyDown={handleKeyDown}
//           onBlur={() => { setTimeout(() => { if (containerRef.current && containerRef.current.contains(document.activeElement)) return; handleSave(); }, 200); }}
//           className="max-edit-input" disabled={isSaving} min="1" step="any" />
//         <button className="label-btn label-save-btn" onClick={handleSave} disabled={isSaving} title="Save"><FontAwesomeIcon icon={faCheck} /></button>
//         <button className="label-btn label-cancel-btn" onClick={() => { setEditValue(String(currentMax)); setIsEditing(false); }} disabled={isSaving} title="Cancel"><FontAwesomeIcon icon={faTimes} /></button>
//         {isCustomized && <button className="label-btn label-reset-btn" onClick={handleReset} disabled={isSaving} title={`Reset to default: ${defaultMax}`}><FontAwesomeIcon icon={faRotateLeft} /></button>}
//       </span>
//     );
//   }

//   return (
//     <span className="editable-max">
//       <span className={`max-value-text ${isCustomized ? 'customized' : ''}`} onClick={() => setIsEditing(true)}
//         title={isCustomized ? `Custom max (default: ${defaultMax}). Click to edit.` : 'Click to set custom max'}>
//         {currentMax}{isCustomized && <span className="custom-indicator">✎</span>}
//       </span>
//       <button className="label-btn label-edit-trigger" onClick={() => setIsEditing(true)} title="Edit max value"><FontAwesomeIcon icon={faPencil} /></button>
//     </span>
//   );
// };

// // ==================== GAUGE CHART COMPONENT ====================
// const GaugeChart = React.memo(({ value, min, max, unit, label, colorStops, icon, gaugeKey, defaultMax, isMaxCustomized, onSaveMax, onResetMax, deviceId, labelKey, onSaveLabel, onResetLabel }) => {
//   const canvasRef = useRef(null);
//   const animatedValue = useRef(0);
//   const animationRef = useRef(null);

//   const originalValue = (() => {
//     const v = Number(value);
//     if (!isFinite(v) || isNaN(v)) return 0;
//     return v;
//   })();

//   const safeValue = Math.min(Math.max(originalValue, min), max);

//   const getColor = (val) => {
//     const range = max - min;
//     if (range === 0) return colorStops[0].color;
//     const percentage = ((val - min) / range) * 100;
//     for (let i = colorStops.length - 1; i >= 0; i--) {
//       if (percentage >= colorStops[i].stop) return colorStops[i].color;
//     }
//     return colorStops[0].color;
//   };

//   const getGradientColors = (val) => {
//     const range = max - min;
//     if (range === 0) return { primary: colorStops[0].color, glow: colorStops[0].glow || colorStops[0].color, bg: colorStops[0].bg || colorStops[0].color + '15' };
//     const percentage = ((val - min) / range) * 100;
//     for (let i = colorStops.length - 1; i >= 0; i--) {
//       if (percentage >= colorStops[i].stop) return { primary: colorStops[i].color, glow: colorStops[i].glow || colorStops[i].color, bg: colorStops[i].bg || colorStops[i].color + '15' };
//     }
//     return { primary: colorStops[0].color, glow: colorStops[0].glow || colorStops[0].color, bg: colorStops[0].bg || colorStops[0].color + '15' };
//   };

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     const dpr = window.devicePixelRatio || 1;
//     const size = 220;
//     canvas.width = size * dpr;
//     canvas.height = size * dpr;
//     canvas.style.width = `${size}px`;
//     canvas.style.height = `${size}px`;
//     ctx.scale(dpr, dpr);

//     const centerX = size / 2;
//     const centerY = size / 2 + 10;
//     const radius = 78;
//     const startAngle = Math.PI * 0.8;
//     const endAngle = Math.PI * 2.2;
//     const totalAngle = endAngle - startAngle;

//     if (animationRef.current) { cancelAnimationFrame(animationRef.current); animationRef.current = null; }
//     let isActive = true;

//     const drawGauge = (ctx, cx, cy, r, startAngle, endAngle, totalAngle, currentVal, size) => {
//       ctx.clearRect(0, 0, size, size);
//       const range = max - min;
//       if (range === 0) return;
//       const sanitizedVal = isFinite(currentVal) ? currentVal : min;
//       const percentage = Math.max(0, Math.min((sanitizedVal - min) / range, 1));
//       if (!isFinite(percentage)) return;
//       const valueAngle = startAngle + totalAngle * percentage;
//       if (!isFinite(valueAngle)) return;
//       const colors = getGradientColors(sanitizedVal);

//       const ambientGlow = ctx.createRadialGradient(cx, cy, r - 20, cx, cy, r + 30);
//       ambientGlow.addColorStop(0, colors.primary + '08');
//       ambientGlow.addColorStop(0.5, colors.primary + '04');
//       ambientGlow.addColorStop(1, 'transparent');
//       ctx.beginPath(); ctx.arc(cx, cy, r + 25, 0, Math.PI * 2); ctx.fillStyle = ambientGlow; ctx.fill();

//       ctx.beginPath(); ctx.arc(cx, cy, r, startAngle, endAngle); ctx.strokeStyle = '#e8ecf1'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke();
//       ctx.beginPath(); ctx.arc(cx, cy, r, startAngle, endAngle); ctx.strokeStyle = '#f1f3f6'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.stroke();
//       ctx.beginPath(); ctx.arc(cx, cy, r, startAngle, endAngle); ctx.strokeStyle = '#e8ecf1'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke();

//       if (percentage > 0.005) {
//         ctx.beginPath(); ctx.arc(cx, cy, r, startAngle, valueAngle); ctx.strokeStyle = colors.primary + '25'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.stroke();
//         ctx.beginPath(); ctx.arc(cx, cy, r, startAngle, valueAngle);
//         const gradX1 = cx + Math.cos(startAngle) * r, gradY1 = cy + Math.sin(startAngle) * r;
//         const gradX2 = cx + Math.cos(valueAngle) * r, gradY2 = cy + Math.sin(valueAngle) * r;
//         if (isFinite(gradX1) && isFinite(gradY1) && isFinite(gradX2) && isFinite(gradY2) && (gradX1 !== gradX2 || gradY1 !== gradY2)) {
//           const arcGrad = ctx.createLinearGradient(gradX1, gradY1, gradX2, gradY2);
//           arcGrad.addColorStop(0, colors.primary + 'CC'); arcGrad.addColorStop(0.5, colors.primary); arcGrad.addColorStop(1, colors.glow);
//           ctx.strokeStyle = arcGrad;
//         } else { ctx.strokeStyle = colors.primary; }
//         ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke();

//         const dotX = cx + Math.cos(valueAngle) * r, dotY = cy + Math.sin(valueAngle) * r;
//         if (isFinite(dotX) && isFinite(dotY)) {
//           const dotGlow = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 14);
//           dotGlow.addColorStop(0, colors.primary + '60'); dotGlow.addColorStop(1, 'transparent');
//           ctx.beginPath(); ctx.arc(dotX, dotY, 14, 0, Math.PI * 2); ctx.fillStyle = dotGlow; ctx.fill();
//           ctx.beginPath(); ctx.arc(dotX, dotY, 5, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill();
//           ctx.strokeStyle = colors.primary; ctx.lineWidth = 2.5; ctx.stroke();
//         }
//       }

//       const majorTicks = 5, minorTicks = 25;
//       for (let i = 0; i <= minorTicks; i++) {
//         const tickAngle = startAngle + (totalAngle * i) / minorTicks;
//         const isPastValue = (i / minorTicks) <= percentage;
//         ctx.beginPath();
//         ctx.moveTo(cx + Math.cos(tickAngle) * (r - 17), cy + Math.sin(tickAngle) * (r - 17));
//         ctx.lineTo(cx + Math.cos(tickAngle) * (r - 13), cy + Math.sin(tickAngle) * (r - 13));
//         ctx.strokeStyle = isPastValue ? colors.primary + '60' : '#d1d5db'; ctx.lineWidth = 1; ctx.lineCap = 'round'; ctx.stroke();
//       }
//       for (let i = 0; i <= majorTicks; i++) {
//         const tickAngle = startAngle + (totalAngle * i) / majorTicks;
//         const isPastValue = (i / majorTicks) <= percentage;
//         ctx.beginPath();
//         ctx.moveTo(cx + Math.cos(tickAngle) * (r - 22), cy + Math.sin(tickAngle) * (r - 22));
//         ctx.lineTo(cx + Math.cos(tickAngle) * (r - 13), cy + Math.sin(tickAngle) * (r - 13));
//         ctx.strokeStyle = isPastValue ? colors.primary + '90' : '#9ca3af'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.stroke();
//         const labelR = r - 32;
//         const tickValue = min + ((max - min) * i) / majorTicks;
//         const labelX = cx + Math.cos(tickAngle) * labelR, labelY = cy + Math.sin(tickAngle) * labelR;
//         ctx.save();
//         ctx.fillStyle = isPastValue ? '#374151' : '#9ca3af';
//         ctx.font = `${isPastValue ? '600' : '400'} 9px 'Inter', system-ui, sans-serif`;
//         ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
//         let labelText;
//         if (tickValue >= 1000) labelText = `${(tickValue / 1000).toFixed(0)}k`;
//         else if (tickValue === Math.floor(tickValue)) labelText = tickValue.toFixed(0);
//         else labelText = tickValue.toFixed(1);
//         ctx.fillText(labelText, labelX, labelY);
//         ctx.restore();
//       }

//       const needleAngle = startAngle + totalAngle * percentage;
//       const needleLength = r - 10;
//       if (isFinite(needleAngle)) {
//         ctx.save();
//         ctx.shadowColor = 'rgba(0,0,0,0.15)'; ctx.shadowBlur = 8; ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 2;
//         ctx.beginPath();
//         ctx.moveTo(cx + Math.cos(needleAngle) * needleLength, cy + Math.sin(needleAngle) * needleLength);
//         ctx.lineTo(cx + Math.cos(needleAngle + Math.PI / 2) * 3, cy + Math.sin(needleAngle + Math.PI / 2) * 3);
//         ctx.lineTo(cx + Math.cos(needleAngle + Math.PI) * 12, cy + Math.sin(needleAngle + Math.PI) * 12);
//         ctx.lineTo(cx + Math.cos(needleAngle - Math.PI / 2) * 3, cy + Math.sin(needleAngle - Math.PI / 2) * 3);
//         ctx.closePath();
//         const nX1 = cx + Math.cos(needleAngle + Math.PI) * 12, nY1 = cy + Math.sin(needleAngle + Math.PI) * 12;
//         const nX2 = cx + Math.cos(needleAngle) * needleLength, nY2 = cy + Math.sin(needleAngle) * needleLength;
//         if (isFinite(nX1) && isFinite(nY1) && isFinite(nX2) && isFinite(nY2) && (nX1 !== nX2 || nY1 !== nY2)) {
//           const needleGrad = ctx.createLinearGradient(nX1, nY1, nX2, nY2);
//           needleGrad.addColorStop(0, '#6b7280'); needleGrad.addColorStop(0.4, '#374151'); needleGrad.addColorStop(0.8, colors.primary); needleGrad.addColorStop(1, colors.glow);
//           ctx.fillStyle = needleGrad;
//         } else { ctx.fillStyle = colors.primary; }
//         ctx.fill(); ctx.restore();
//       }

//       ctx.save();
//       ctx.shadowColor = 'rgba(0,0,0,0.1)'; ctx.shadowBlur = 6;
//       const outerHub = ctx.createRadialGradient(cx, cy - 2, 0, cx, cy, 14);
//       outerHub.addColorStop(0, '#f9fafb'); outerHub.addColorStop(0.3, '#e5e7eb'); outerHub.addColorStop(0.7, '#d1d5db'); outerHub.addColorStop(1, '#9ca3af');
//       ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fillStyle = outerHub; ctx.fill(); ctx.restore();
//       const innerHub = ctx.createRadialGradient(cx, cy - 2, 0, cx, cy, 10);
//       innerHub.addColorStop(0, '#ffffff'); innerHub.addColorStop(0.6, '#f3f4f6'); innerHub.addColorStop(1, '#e5e7eb');
//       ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fillStyle = innerHub; ctx.fill(); ctx.strokeStyle = '#d1d5db'; ctx.lineWidth = 0.5; ctx.stroke();
//       const dotGrad = ctx.createRadialGradient(cx, cy - 1, 0, cx, cy, 4);
//       dotGrad.addColorStop(0, colors.glow); dotGrad.addColorStop(1, colors.primary);
//       ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fillStyle = dotGrad; ctx.fill();
//     };

//     const animate = () => {
//       if (!isActive) return;
//       const diff = safeValue - animatedValue.current;
//       animatedValue.current += diff * 0.06;
//       if (Math.abs(diff) < 0.01) animatedValue.current = safeValue;
//       try { drawGauge(ctx, centerX, centerY, radius, startAngle, endAngle, totalAngle, animatedValue.current, size); }
//       catch (err) { console.error('Gauge draw error:', err); isActive = false; return; }
//       if (Math.abs(diff) > 0.01 && isActive) { animationRef.current = requestAnimationFrame(animate); }
//     };

//     animationRef.current = requestAnimationFrame(animate);
//     return () => { isActive = false; if (animationRef.current) { cancelAnimationFrame(animationRef.current); animationRef.current = null; } };
//   }, [safeValue, min, max]);

//   const currentColor = getColor(Math.min(originalValue, max));
//   const colors = getGradientColors(Math.min(originalValue, max));

//   return (
//     <div className="gauge-card" style={{ '--gauge-color': currentColor, '--gauge-glow': colors.glow }}>
//       <div className="gauge-card-accent" style={{ background: `linear-gradient(90deg, ${currentColor}00, ${currentColor}, ${currentColor}00)` }} />
//       <div className="gauge-card-header">
//         <div className="gauge-icon-wrapper" style={{ background: colors.bg, borderColor: currentColor + '30' }}>
//           <span className="gauge-icon">{icon}</span>
//         </div>
//         <span className="gauge-label">
//           {deviceId && labelKey && onSaveLabel && onResetLabel ? (
//             <EditableLabel deviceId={deviceId} attributeKey={labelKey} onSave={onSaveLabel} onReset={onResetLabel} />
//           ) : (
//             label
//           )}
//         </span>
//       </div>
//       <div className="gauge-canvas-wrapper">
//         <canvas ref={canvasRef} className="gauge-canvas" />
//         <div className="gauge-center-value">
//           {/* <span className="gauge-value" style={{ color: currentColor }}>{originalValue.toFixed(1)}</span> */}
//                     <span className="gauge-value" style={{ color: currentColor }}>{originalValue.toFixed(2)}</span>
//           <span className="gauge-unit">{unit}</span>
//         </div>
//       </div>
//       <div className="gauge-footer">
//         <div className="gauge-range">
//           <span className="gauge-min">{min}</span>
//           <div className="gauge-max-editable">
//             <span className="gauge-max-label">Max:</span>
//             <EditableMaxValue gaugeKey={gaugeKey} currentMax={max} defaultMax={defaultMax} isCustomized={isMaxCustomized} onSave={onSaveMax} onReset={onResetMax} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }, (prevProps, nextProps) => {
//   return prevProps.value === nextProps.value && prevProps.min === nextProps.min &&
//     prevProps.max === nextProps.max && prevProps.label === nextProps.label &&
//     prevProps.isMaxCustomized === nextProps.isMaxCustomized;
// });

// // ==================== GAUGE CONFIGS ====================
// const safeDisplay = (val, decimals = 2) => {
//   if (val === null || val === undefined || val === '') return (0).toFixed(decimals);
//   if (typeof val === 'object' && val !== null) {
//     const inner = val.value ?? val.Value ?? val.v ?? 0;
//     const num = parseFloat(inner);
//     return isFinite(num) ? num.toFixed(decimals) : (0).toFixed(decimals);
//   }
//   const num = parseFloat(val);
//   return isFinite(num) ? num.toFixed(decimals) : (0).toFixed(decimals);
// };

// const GAUGE_CONFIGS = [
//   {
//     key: 'flowRate', dataField: 'flowRate', labelKey: 'gauge_flow_rate',
//     maxKey: 'gauge_flow_rate_max', label: 'Water Flow Rate', unit: 'L/min',
//     min: 0, max: 120, icon: '💧',
//     colorStops: [
//       { stop: 0, color: '#3b82f6', glow: '#60a5fa', bg: 'rgba(59,130,246,0.08)' },
//       { stop: 30, color: '#10b981', glow: '#34d399', bg: 'rgba(16,185,129,0.08)' },
//       { stop: 60, color: '#f59e0b', glow: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
//       { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
//     ]
//   },
//   {
//     key: 'pressure', dataField: 'pressure', labelKey: 'gauge_pressure',
//     maxKey: 'gauge_pressure_max', label: 'Water Pressure', unit: 'bar',
//     min: 0, max: 10, icon: '🔵',
//     colorStops: [
//       { stop: 0, color: '#06b6d4', glow: '#22d3ee', bg: 'rgba(6,182,212,0.08)' },
//       { stop: 30, color: '#10b981', glow: '#34d399', bg: 'rgba(16,185,129,0.08)' },
//       { stop: 60, color: '#f59e0b', glow: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
//       { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
//     ]
//   },
//   {
//     key: 'pumpMotorFrequency', dataField: 'pump_motor_frequency', labelKey: 'gauge_motor_frequency',
//     maxKey: 'gauge_motor_frequency_max', label: 'Motor Frequency', unit: 'Hz',
//     min: 0, max: 100, icon: '⚡',
//     colorStops: [
//       { stop: 0, color: '#8b5cf6', glow: '#a78bfa', bg: 'rgba(139,92,246,0.08)' },
//       { stop: 30, color: '#3b82f6', glow: '#60a5fa', bg: 'rgba(59,130,246,0.08)' },
//       { stop: 60, color: '#f59e0b', glow: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
//       { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
//     ]
//   },
//   {
//     key: 'pumpMotorCurrent', dataField: 'pump_motor_current', labelKey: 'gauge_motor_current',
//     maxKey: 'gauge_motor_current_max', label: 'Motor Current', unit: 'A',
//     min: 0, max: 20, icon: '🔌',
//     colorStops: [
//       { stop: 0, color: '#14b8a6', glow: '#2dd4bf', bg: 'rgba(20,184,166,0.08)' },
//       { stop: 30, color: '#22c55e', glow: '#4ade80', bg: 'rgba(34,197,94,0.08)' },
//       { stop: 60, color: '#eab308', glow: '#facc15', bg: 'rgba(234,179,8,0.08)' },
//       { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
//     ]
//   }
// ];

// const GAUGE_CONFIGS_ROW2 = [
//   {
//     key: 'oxygenFlow', dataField: 'oxygen_flow', labelKey: 'gauge_oxygen_flow',
//     maxKey: 'gauge_oxygen_flow_max', label: 'Oxygen Flow', unit: 'L/min',
//     min: 0, max: 50, icon: '🫧',
//     colorStops: [
//       { stop: 0, color: '#0ea5e9', glow: '#38bdf8', bg: 'rgba(14,165,233,0.08)' },
//       { stop: 30, color: '#10b981', glow: '#34d399', bg: 'rgba(16,185,129,0.08)' },
//       { stop: 60, color: '#f59e0b', glow: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
//       { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
//     ]
//   },
//   {
//     key: 'spare1', dataField: 'spare_1', labelKey: 'gauge_spare_1',
//     maxKey: 'gauge_spare_1_max', label: 'Spare 1', unit: 'L/min',
//     min: 0, max: 50, icon: '📊',
//     colorStops: [
//       { stop: 0, color: '#a855f7', glow: '#c084fc', bg: 'rgba(168,85,247,0.08)' },
//       { stop: 30, color: '#6366f1', glow: '#818cf8', bg: 'rgba(99,102,241,0.08)' },
//       { stop: 60, color: '#f59e0b', glow: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
//       { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
//     ]
//   }
// ];

// const ALERT_BIT_KEYS = [
//   'alert_auto_mode_fbk', 'alert_manual_mode_fbk', 'alert_vfd_trip_fbk',
//   'alert_pump_on_fbk', 'alert_solenoid_valve_on_fbk', 'alert_oxygen_on_fbk',
//   'alert_low_oxygen_flow', 'alert_high_oxygen_flow', 'alert_auto_sequence_status',
//   'alert_spare_2', 'alert_spare_3', 'alert_spare_4',
//   'alert_spare_5', 'alert_spare_6', 'alert_spare_7', 'alert_spare_8',
// ];

// // ==================== MAIN COMPONENT ====================
// const DeviceDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const {
//     fetchLabels, getLabel: getLabelFromContext, saveLabel: saveLabelToContext,
//     resetLabel: resetLabelFromContext, resetAllLabels: resetAllFromContext,
//     isCustomized: isLabelCustomized, getDefaultLabel,
//     isLoaded: isLabelsLoaded,
//     getGaugeMax: getGaugeMaxFromContext, isGaugeMaxCustomized: isMaxCustomizedFromContext,
//     saveGaugeMax: saveGaugeMaxToContext, resetGaugeMax: resetGaugeMaxFromContext,
//   } = useLabels();

//   const getLabel = useCallback((key) => getLabelFromContext(id, key), [getLabelFromContext, id]);
//   const handleSaveLabel = useCallback(async (key, value) => await saveLabelToContext(id, key, value), [saveLabelToContext, id]);
//   const handleResetLabel = useCallback(async (key) => await resetLabelFromContext(id, key), [resetLabelFromContext, id]);
//   const handleResetAll = useCallback(async () => await resetAllFromContext(id), [resetAllFromContext, id]);
//   const getGaugeMax = useCallback((config) => getGaugeMaxFromContext(id, config.maxKey, config.max), [getGaugeMaxFromContext, id]);
//   const isGaugeMaxCustomized = useCallback((maxKey) => isMaxCustomizedFromContext(id, maxKey), [isMaxCustomizedFromContext, id]);
//   const handleSaveGaugeMax = useCallback(async (maxKey, value) => await saveGaugeMaxToContext(id, maxKey, value), [saveGaugeMaxToContext, id]);
//   const handleResetGaugeMax = useCallback(async (maxKey) => await resetGaugeMaxFromContext(id, maxKey), [resetGaugeMaxFromContext, id]);

//   const hasCustomizations = useCallback(() => {
//     return ALERT_BIT_KEYS.some(k => isLabelCustomized(id, k)) ||
//       ['pump_motor_frequency', 'pump_motor_current', 'total_running_hours', 'total_water_outlet',
//         'water_flow_rate', 'water_pressure', 'auto_sequence_counter', 'auto_sequence_off_time',
//         'auto_sequence_on_time', 'auto_mode', 'oxygen_flow', 'spare_1',
//         'gauge_flow_rate', 'gauge_pressure', 'gauge_motor_frequency', 'gauge_motor_current',
//         'gauge_oxygen_flow', 'gauge_spare_1'
//       ].some(k => isLabelCustomized(id, k));
//   }, [isLabelCustomized, id]);

//   const isWaitingRef = useRef(false);
//   const isAutoWaitingRef = useRef(false);
//   const autoModeToggleTimeRef = useRef(0);
//   const powerToggleTimeRef = useRef(0);

//   const checkPowerStatusFromBit = (statusValue) => {
//     if (statusValue === null || statusValue === undefined) return false;
//     return ((statusValue >> 3) & 1) === 1;
//   };

//   const checkAutoModeFromBit = (statusValue) => {
//     if (statusValue === null || statusValue === undefined) return false;
//     return ((statusValue >> 8) & 1) === 1;
//   };

//   const [powerStatusHistory, setPowerStatusHistory] = useState([]);
//   const [loadingHistory, setLoadingHistory] = useState(false);
//   const [autoWaiting, setAutoWaiting] = useState(false);
//   const [deviceName, setDeviceName] = useState("Loading...");
//   const [deviceInfo, setDeviceInfo] = useState({ owner_name: "Loading...", phone_number: "Loading...", email_id: "Loading...", location: "Loading..." });
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editableInfo, setEditableInfo] = useState({ owner_name: "", phone_number: "", email_id: "", location: "" });
//   const [isWriting, setIsWriting] = useState({ counter: false, onTime: false, offTime: false });
//   const [writeSuccess, setWriteSuccess] = useState({ counter: false, onTime: false, offTime: false });
//   const [lastWritten, setLastWritten] = useState({ counter: "", onTime: "", offTime: "" });
//   const [deviceData, setDeviceData] = useState({
//     nbGenerator: { flowRate: "", pressure: "", waterTemperature: "", systemTemperature: "", totalWaterOutlet: "", pump_motor_frequency: 0, pump_motor_current: 0, total_running_hours: 0, auto_sequence_on_time: 0, auto_sequence_off_time: 0, auto_sequence_counter: 0, auto_sequence_on_write: 0, auto_sequence_off_write: 0, auto_sequence_counter_write: 0, oxygen_flow: 0, spare_1: 0, alert_status: 0, timestamp: "" },
//     ozoneGenerator: { flowRate: "", pressure: "", waterTemperature: "", systemTemperature: "", totalWaterOutlet: "", timestamp: "" },
//     oxygenGenerator: { flowRate: "", pressure: "", waterTemperature: "", systemTemperature: "", totalWaterOutlet: "", timestamp: "" },
//   });
//   const [loading, setLoading] = useState(true);
//   const [conn, setConn] = useState(false);
//   const [nbWaiting, setNbWaiting] = useState(false);
//   const [autoMode, setAutoMode] = useState(false);
//   const [onTime, setOnTime] = useState("");
//   const [offTime, setOffTime] = useState("");
//   const [counter, setCounter] = useState("");
//   const [isPowerOn, setIsPowerOn] = useState(false);

//   const POWER_COOLDOWN_MS = 6000;
//   const AUTO_MODE_COOLDOWN_MS = 6000;

//   useEffect(() => { fetchLabels(id); }, [fetchLabels, id]);

//   const fetchPowerStatusHistory = async () => {
//     // if (!conn) return;
//     setLoadingHistory(true);
//     try {
//       const response = await fetch(`${process.env.REACT_APP_EP}/data/devices/${id}/power-status-history?limit=20`);
//       if (!response.ok) throw new Error(`HTTP ${response.status}`);
//       const data = await response.json();
//       if (data.status === 'success') setPowerStatusHistory(data.data);
//     } catch (error) { console.error('Error fetching power status history:', error); }
//     finally { setLoadingHistory(false); }
//   };

//   useEffect(() => {
//   fetchPowerStatusHistory();
// }, [id]);

//   const fetchDeviceData = async () => {
//     try {
//       const telemetryRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`);
//       if (!telemetryRes.ok) return;
//       const data = await telemetryRes.json();

//       setDeviceData({
//         nbGenerator: {
//           ...data.nbGenerator,
//           pump_motor_frequency: data.nbGenerator?.pump_motor_frequency ?? 0,
//           pump_motor_current: data.nbGenerator?.pump_motor_current ?? 0,
//           total_running_hours: data.nbGenerator?.total_running_hours ?? 0,
//           auto_sequence_on_time: data.nbGenerator?.auto_sequence_on_time ?? 0,
//           auto_sequence_off_time: data.nbGenerator?.auto_sequence_off_time ?? 0,
//           auto_sequence_counter: data.nbGenerator?.auto_sequence_counter ?? 0,
//           auto_sequence_on_write: data.nbGenerator?.auto_sequence_on_write ?? 0,
//           auto_sequence_off_write: data.nbGenerator?.auto_sequence_off_write ?? 0,
//           auto_sequence_counter_write: data.nbGenerator?.auto_sequence_counter_write ?? 0,
//           oxygen_flow: data.nbGenerator?.oxygen_flow ?? 0,
//           spare_1: data.nbGenerator?.spare_1 ?? 0,
//           alert_status: data.nbGenerator?.alert_status ?? 0
//         },
//         ozoneGenerator: { ...data.ozoneGenerator },
//         oxygenGenerator: { ...data.oxygenGenerator },
//       });

//       const alertStatus = data.nbGenerator?.alert_status;

//       if (!isWaitingRef.current) {
//         const timeSincePowerToggle = Date.now() - powerToggleTimeRef.current;
//         if (timeSincePowerToggle > POWER_COOLDOWN_MS) {
//           const newPowerStatus = checkPowerStatusFromBit(alertStatus);
//           setIsPowerOn(prev => prev !== newPowerStatus ? newPowerStatus : prev);
//         }
//       }

//       if (!isAutoWaitingRef.current) {
//         const timeSinceAutoToggle = Date.now() - autoModeToggleTimeRef.current;
//         if (timeSinceAutoToggle > AUTO_MODE_COOLDOWN_MS) {
//           const newAutoMode = checkAutoModeFromBit(alertStatus);
//           setAutoMode(prev => prev !== newAutoMode ? newAutoMode : prev);
//         }
//       }

//       if (nbWaiting) setNbWaiting(false);
//     } catch (err) {
//       console.error("Error:", err);
//       setNbWaiting(false);
//     }
//   };

//   const writeToRegister = async (registerType, value) => {
//     if (!value || value === '') return false;
//     const fieldMap = { 'auto_sequence_counter': 'counter', 'auto_sequence_on': 'onTime', 'auto_sequence_off': 'offTime' };
//     const fieldName = fieldMap[registerType];
//     setIsWriting(prev => ({ ...prev, [fieldName]: true }));

//     try {
//       const response = await axios.post(`${process.env.REACT_APP_EP}/api/devices/${id}/write-register`, { registerType, value: parseInt(value) });

//       if (response.data.success) {
//         setWriteSuccess(prev => ({ ...prev, [fieldName]: true }));
//         setLastWritten(prev => ({ ...prev, [fieldName]: value }));
//         switch (registerType) {
//           case 'auto_sequence_counter': setCounter(''); break;
//           case 'auto_sequence_on': setOnTime(''); break;
//           case 'auto_sequence_off': setOffTime(''); break;
//           default: break;
//         }
//         setTimeout(() => { setWriteSuccess(prev => ({ ...prev, [fieldName]: false })); }, 5000);
//         await fetchDeviceData();
//         return true;
//       }
//     } catch (error) {
//       console.error('Error writing to register:', error);
//       const rd = error.response?.data;
//       const isTimeout = error.response?.status === 504 || rd?.isTimeout || (error.message || '').toLowerCase().includes('timeout');
//       alert(isTimeout
//         ? "⚠️ Device not responding. Value was NOT written. Check device connection."
//         : "❌ Failed to write: " + (rd?.error || error.message));
//       return false;
//     } finally {
//       setIsWriting(prev => ({ ...prev, [fieldName]: false }));
//     }
//   };

//   const handleCounterClick = async () => { if (counter) await writeToRegister('auto_sequence_counter', counter); };
//   const handleOnTimeClick = async () => { if (onTime) await writeToRegister('auto_sequence_on', onTime); };
//   const handleOffTimeClick = async () => { if (offTime) await writeToRegister('auto_sequence_off', offTime); };

//   const handleEditToggle = async () => {
//     if (isEditMode) {
//       if (!editableInfo.email_id || !editableInfo.owner_name) { alert("Please fill in both owner name and email fields"); return; }
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (editableInfo.email_id !== "N/A" && !emailRegex.test(editableInfo.email_id)) { alert("Please enter a valid email address"); return; }
//       const confirmUpdate = window.confirm("Are you sure you want to update this device?");
//       if (!confirmUpdate) return;
//       setLoading(true);
//       try {
//         const response = await fetch(`${process.env.REACT_APP_EP}/data/updatedevice`, {
//           method: "POST", headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ azure_device_id: id, owner_name: editableInfo.owner_name, email_id: editableInfo.email_id, phone_number: editableInfo.phone_number, location: editableInfo.location }),
//         });
//         const result = await response.json();
//         if (result.status === "success") { alert("Device updated successfully!"); setDeviceInfo(editableInfo); setIsEditMode(false); }
//         else { alert(`Failed to update device: ${result.message}`); }
//       } catch (error) { console.error("Error updating device:", error); alert("Failed to update device."); }
//       finally { setLoading(false); }
//     } else { setIsEditMode(true); }
//   };

//   const handleInputChange = (field, value) => { setEditableInfo(prev => ({ ...prev, [field]: value })); };

//   const handlePowerToggle = async () => {
//     const desired = !isPowerOn;
//     setNbWaiting(true);
//     isWaitingRef.current = true;
//     powerToggleTimeRef.current = Date.now();

//     if (!conn) { setNbWaiting(false); isWaitingRef.current = false; powerToggleTimeRef.current = 0; return; }

//     setIsPowerOn(desired);

//     try {
//       const response = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/toggle/nb`, {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ action: desired ? "on" : "off" }),
//       });
//       const data = await response.json();

//       if (!response.ok) {
//         if (data.isTimeout || response.status === 504) {
//           setIsPowerOn(!desired); setNbWaiting(false); isWaitingRef.current = false; powerToggleTimeRef.current = 0;
//           alert("⚠️ Device not responding. Check device connection and try again.");
//           return;
//         }
//         throw new Error(data.error || `HTTP ${response.status}`);
//       }

//       setTimeout(async () => { isWaitingRef.current = false; setNbWaiting(false); await fetchPowerStatusHistory(); await fetchDeviceData(); }, 5000);

//     } catch (err) {
//       setIsPowerOn(!desired); setNbWaiting(false); isWaitingRef.current = false; powerToggleTimeRef.current = 0;
//       const msg = (err.message || '').toLowerCase();
//       alert(msg.includes('timeout') || msg.includes('failed to fetch')
//         ? "⚠️ Device not responding. Check device connection and try again."
//         : "❌ Error: " + err.message);
//     }
//   };

//   const handleAutoModeToggle = async () => {
//     const desired = !autoMode;
//     setAutoWaiting(true); isAutoWaitingRef.current = true; autoModeToggleTimeRef.current = Date.now();

//     if (!conn) { setAutoWaiting(false); isAutoWaitingRef.current = false; autoModeToggleTimeRef.current = 0; return; }

//     setAutoMode(desired);

//     try {
//       const response = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/toggle/auto`, {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ action: desired ? "on" : "off" }),
//       });
//       const data = await response.json();

//       if (!response.ok) {
//         if (data.isTimeout || response.status === 504) {
//           setAutoMode(!desired); setAutoWaiting(false); isAutoWaitingRef.current = false; autoModeToggleTimeRef.current = 0;
//           alert("⚠️ Device not responding. Check device connection and try again.");
//           return;
//         }
//         throw new Error(data.error || `HTTP ${response.status}`);
//       }

//       setTimeout(() => { isAutoWaitingRef.current = false; setAutoWaiting(false); }, 5000);

//     } catch (err) {
//       setAutoMode(!desired); setAutoWaiting(false); isAutoWaitingRef.current = false; autoModeToggleTimeRef.current = 0;
//       const msg = (err.message || '').toLowerCase();
//       alert(msg.includes('timeout') || msg.includes('failed to fetch')
//         ? "⚠️ Device not responding. Check device connection and try again."
//         : "❌ Error: " + err.message);
//     }
//   };

//   useEffect(() => {
//     const fetchDeviceInfo = async () => {
//       try {
//         const response = await fetch(`${process.env.REACT_APP_EP}/data/devices/${id}/info`);
//         if (!response.ok) { const f = { owner_name: "N/A", phone_number: "N/A", email_id: "N/A", location: "N/A" }; setDeviceInfo(f); setEditableInfo(f); return; }
//         const resp = await response.json();
//         if (resp.status === "success" && resp.data) {
//           const info = { owner_name: resp.data.owner_name || "N/A", phone_number: resp.data.phone_number || "N/A", email_id: resp.data.email_id || "N/A", location: resp.data.location || "N/A" };
//           setDeviceInfo(info); setEditableInfo(info);
//         }
//       } catch (error) { const f = { owner_name: "N/A", phone_number: "N/A", email_id: "N/A", location: "N/A" }; setDeviceInfo(f); setEditableInfo(f); }
//     };
//     fetchDeviceInfo();
//   }, [id]);

//   useEffect(() => {
//     let cancelled = false;
//     fetch(`${process.env.REACT_APP_EP}/api/devices`).then(r => { if (!r.ok) throw new Error(); return r.json(); })
//       .then(payload => { const list = Array.isArray(payload) ? payload : payload.value || []; const dev = list.find(d => String(d.id) === String(id)); if (!cancelled) setDeviceName(dev ? dev.displayName || dev.name || "N/A" : "N/A"); })
//       .catch(() => { if (!cancelled) setDeviceName("Error"); });
//     return () => { cancelled = true; };
//   }, [id]);

//   useEffect(() => {
//     const fetchInitialStatus = async () => {
//       try {
//         const statusRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/status`);
//         if (!statusRes.ok) { setConn(false); setLoading(false); return; }
//         const statusData = await statusRes.json();
//         const isConnected = statusData.status === "Connected";
//         setConn(isConnected);
//         if (isConnected) {
//           try {
//             const telemetryRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`);
//             if (telemetryRes.ok) {
//               const data = await telemetryRes.json();
//               setDeviceData({
//                 nbGenerator: { ...data.nbGenerator, pump_motor_frequency: data.nbGenerator?.pump_motor_frequency ?? 0, pump_motor_current: data.nbGenerator?.pump_motor_current ?? 0, total_running_hours: data.nbGenerator?.total_running_hours ?? 0, auto_sequence_on_time: data.nbGenerator?.auto_sequence_on_time ?? 0, auto_sequence_off_time: data.nbGenerator?.auto_sequence_off_time ?? 0, auto_sequence_counter: data.nbGenerator?.auto_sequence_counter ?? 0, auto_sequence_on_write: data.nbGenerator?.auto_sequence_on_write ?? 0, auto_sequence_off_write: data.nbGenerator?.auto_sequence_off_write ?? 0, auto_sequence_counter_write: data.nbGenerator?.auto_sequence_counter_write ?? 0, oxygen_flow: data.nbGenerator?.oxygen_flow ?? 0, spare_1: data.nbGenerator?.spare_1 ?? 0, alert_status: data.nbGenerator?.alert_status ?? 0 },
//                 ozoneGenerator: { ...data.ozoneGenerator }, oxygenGenerator: { ...data.oxygenGenerator },
//               });
//               const alertStatus = data.nbGenerator?.alert_status;
//               setIsPowerOn(checkPowerStatusFromBit(alertStatus));
//               setAutoMode(checkAutoModeFromBit(alertStatus));
//             }
//           } catch (e) { console.error("Telemetry fetch failed:", e); }
//         }
//       } catch (error) { console.error("Error:", error); setConn(false); }
//       finally { setLoading(false); }
//     };
//     fetchInitialStatus();
//     const safetyTimer = setTimeout(() => { setLoading(prev => { if (prev) return false; return prev; }); }, 8000);
//     return () => clearTimeout(safetyTimer);
//   }, [id]);

//   useEffect(() => {
//     if (!conn) return;
//     // fetchPowerStatusHistory();
//     const dataInterval = setInterval(() => { fetchDeviceData(); }, 5000);
//     const historyInterval = setInterval(() => { fetchPowerStatusHistory(); }, 30000);
//     return () => { clearInterval(dataInterval); clearInterval(historyInterval); };
//   }, [conn, id]);

//   const getStatusText = (isPowered, timestamp, isWaiting) => {
//     if (!conn) return "Disconnected";
//     if (isWaiting) return "request sent";
//     if (!isPowerOn) return "System OFF";
//     return "";
//   };

//   const getGaugeValue = (dataField) => {
//     const val = deviceData.nbGenerator[dataField];
//     if (val === null || val === undefined || val === '') return 0;
//     if (typeof val === 'number') return isFinite(val) ? val : 0;
//     if (typeof val === 'object' && val !== null) { const v = Number(val.value ?? val.Value ?? val.v ?? 0); return isFinite(v) ? v : 0; }
//     if (typeof val === 'string') { let num = Number(val); if (isFinite(num)) return num; const match = val.match(/[-+]?[0-9]*\.?[0-9]+/); if (match) { num = parseFloat(match[0]); return isFinite(num) ? num : 0; } }
//     return 0;
//   };

//   const parseVal = (v) => (parseFloat(typeof v === 'object' ? (v?.value ?? 0) : v) || 0).toFixed(2);

//     // ==================== AGGREGATE DAILY POWER STATUS ====================
//   const getDailyPowerSummary = useCallback(() => {
//     if (!powerStatusHistory || powerStatusHistory.length === 0) return [];

//     const dayMap = {}; // key: "YYYY-MM-DD" => { date, onMs, offMs, records }

//     // Sort records oldest first for correct duration calculation
//     const sorted = [...powerStatusHistory].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

//     for (let i = 0; i < sorted.length; i++) {
//       const record = sorted[i];
//       const ts = new Date(record.timestamp);
//       const dateKey = ts.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

//       if (!dayMap[dateKey]) {
//         dayMap[dateKey] = { date: dateKey, onMs: 0, offMs: 0, latestStatus: null, latestTimestamp: null };
//       }

//       // Calculate duration this status lasted
//       let durationMs = 0;
//       if (i < sorted.length - 1) {
//         // Duration until next status change
//         const nextTs = new Date(sorted[i + 1].timestamp);
//         const nextDateKey = nextTs.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

//         if (nextDateKey === dateKey) {
//           // Same day - full duration goes to this day
//           durationMs = nextTs - ts;
//         } else {
//           // Crosses midnight - only count until end of this day
//           const endOfDay = new Date(ts);
//           endOfDay.setHours(23, 59, 59, 999);
//           durationMs = endOfDay - ts;

//           // Add remaining to next day(s) - simplified: add to the next record's day
//           const startOfNextDay = new Date(nextTs);
//           startOfNextDay.setHours(0, 0, 0, 0);
//           const overflowMs = nextTs - startOfNextDay;
//           // This will be handled when we process the next record
//         }
//       } else {
//         // Last record - duration until now
//         const now = new Date();
//         const nowDateKey = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
//         if (nowDateKey === dateKey) {
//           durationMs = now - ts;
//         } else {
//           const endOfDay = new Date(ts);
//           endOfDay.setHours(23, 59, 59, 999);
//           durationMs = endOfDay - ts;
//         }
//       }

//       if (record.status === 'ON') {
//         dayMap[dateKey].onMs += durationMs;
//       } else {
//         dayMap[dateKey].offMs += durationMs;
//       }

//       // Track latest status for this day
//       if (!dayMap[dateKey].latestTimestamp || ts > new Date(dayMap[dateKey].latestTimestamp)) {
//         dayMap[dateKey].latestStatus = record.status;
//         dayMap[dateKey].latestTimestamp = record.timestamp;
//       }
//     }

//     // Convert to array and sort newest first
//     const result = Object.values(dayMap).sort((a, b) => {
//       const dateA = new Date(a.date.replace(/(\d{2})-(\w{3})-(\d{4})/, '$2 $1, $3'));
//       const dateB = new Date(b.date.replace(/(\d{2})-(\w{3})-(\d{4})/, '$2 $1, $3'));
//       return dateB - dateA;
//     });

//     return result;
//   }, [powerStatusHistory]);

//   const formatDuration = (ms) => {
//     if (!ms || ms <= 0) return '0m';
//     const totalSeconds = Math.floor(ms / 1000);
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;
//     if (hours > 0) return `${hours}h ${minutes}m`;
//     if (minutes > 0) return `${minutes}m ${seconds}s`;
//     return `${seconds}s`;
//   };

//   const dailySummary = getDailyPowerSummary();

//   return (
//     <>
//       <div className="device-details-banner">
//         <div className="device-details-header">
//           <h2 className="device-details-title">
//             <span className="device-name">{deviceName}</span> || <span className="device-name">{id}</span>
//           </h2>
//           <div className="device-details-status">
//             <span className="device-connection-status">
//               <FontAwesomeIcon icon={faLink} className={`status-icon ${conn ? "green" : "red"}`} />
//               {conn ? "Connected" : "Disconnected"}
//             </span>
//             <span className={`connection-badge ${isPowerOn ? "on" : "off"}`}>{isPowerOn ? "ON" : "OFF"}</span>
//             <span className={`connection-label ${isPowerOn ? "green" : "red"}`}>{isPowerOn ? "Power ON" : "Power OFF"}</span>
//           </div>
//         </div>
//       </div>

//       {loading && (
//         <div className="loading-backdrop">
//           <div className="loading-spinner"></div>
//           <div className="loading-text">Waiting for device...</div>
//         </div>
//       )}

//       {!loading && (
//         <div className="device-detail-container unified-layout">

//           {/* ====== SECTION: Device Basic Information ====== */}
//           <div className="unified-section">
//             <div className="device-info-header">
//               <h3 className="section-title">Device Basic Information:</h3>
//               <button className="editt-btn" onClick={handleEditToggle}>
//                 <FontAwesomeIcon icon={isEditMode ? faSave : faPencil} />
//                 {isEditMode ? "Save" : "Edit"}
//               </button>
//             </div>
//             <div className="device-info-grid">
//               <p><strong>Device Name:</strong> {deviceName}</p>
//               <p className={isEditMode ? "editable-field-container" : ""}>
//                 <strong>Owner Name:</strong>
//                 {isEditMode ? <input type="text" value={editableInfo.owner_name} onChange={(e) => handleInputChange("owner_name", e.target.value)} className="inline-edit-input" /> : <span>{deviceInfo.owner_name}</span>}
//               </p>
//               <p className={isEditMode ? "editable-field-container" : ""}>
//                 <strong>Owner Phone:</strong>
//                 {isEditMode ? <input type="tel" value={editableInfo.phone_number} onChange={(e) => handleInputChange("phone_number", e.target.value)} className="inline-edit-input" /> : <span>{deviceInfo.phone_number}</span>}
//               </p>
//               <p><strong>Device ID:</strong> {id}</p>
//               <p className={isEditMode ? "editable-field-container" : ""}>
//                 <strong>Owner Email ID:</strong>
//                 {isEditMode ? <input type="email" value={editableInfo.email_id} onChange={(e) => handleInputChange("email_id", e.target.value)} className="inline-edit-input" /> : <span>{deviceInfo.email_id}</span>}
//               </p>
//               <p className={isEditMode ? "editable-field-container" : ""}>
//                 <strong>Device Sector:</strong>
//                 {isEditMode ? <input type="text" value={editableInfo.location} onChange={(e) => handleInputChange("location", e.target.value)} className="inline-edit-input" /> : <span>{deviceInfo.location}</span>}
//               </p>
//             </div>
//           </div>

//           <hr className="section-divider" />

//           {/* ====== SECTION: Device Connection Status and Power ====== */}
//           <div className="unified-section">
//             <div className="device-info-header">
//               <h3 className="section-title">Device Connection Status and Power:</h3>
//             </div>

//             <div className="power-status-layout">
//               <div className="power-status-left">
//                 <div className="device-connection-grid">
//                   <p><strong>Connection Status:</strong> {conn ? "Connected" : "Disconnected"}</p>
//                   <p><strong>Last Updated:</strong> {
//                     powerStatusHistory.length > 0
//                       ? new Date(powerStatusHistory[0].timestamp).toLocaleString('en-GB', {
//                           day: '2-digit', month: 'short', year: 'numeric',
//                           hour: '2-digit', minute: '2-digit', second: '2-digit'
//                         })
//                       : 'N/A'
//                   }</p>

//                   <div className="power-item">
//                     <span>System Power </span>
//                     <div className="power-toggle">
//                       <span className={nbWaiting ? "status-waiting" : ""}>
//                         {getStatusText(isPowerOn, deviceData.nbGenerator.timestamp, nbWaiting)}
//                       </span>
//                       <label className={`toggle-switch ${nbWaiting ? "toggle-waiting" : ""}`}>
//                         <input type="checkbox" checked={isPowerOn} onChange={() => !nbWaiting && handlePowerToggle()} disabled={nbWaiting || !conn} />
//                         <span className="toggle-slider"></span>
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//                <div className="power-status-right">
//                 <h4 className="status-history-title">Power Status History:</h4>
//                 {loadingHistory ? (
//                   <div className="status-history-loading">Loading history...</div>
//                 ) : dailySummary.length === 0 ? (
//                   <div className="status-history-empty">No status history available</div>
//                 ) : (
//                   <div className="status-history-table-container">
//                     <table className="status-history-table daily-summary-table">
//                       <thead>
//                         <tr>
//                           <th>Date</th>
//                           <th>Status</th>
//                           <th>Duration</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {dailySummary.map((day, index) => (
//                           <tr key={day.date} className={index === 0 ? 'current-status' : ''}>
//                             <td className="daily-date-cell">{day.date}</td>
//                             <td className="daily-status-cell">
//                               <div className="daily-status-stack">
//                                 <span className="status-badge on">ON</span>
//                                 <span className="status-badge off">OFF</span>
//                               </div>
//                             </td>
//                             <td className="daily-duration-cell">
//                               <div className="daily-duration-stack">
//                                 <span className="duration-on">{formatDuration(day.onMs)}</span>
//                                 <span className="duration-off">{formatDuration(day.offMs)}</span>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//                 </div>

//             </div>
//           </div>

//           <hr className="section-divider" />

//           {/* ====== SECTION: Device Configuration & Alerts ====== */}
//           <div className="unified-section">
//             {/* <div className="config-section-header">
//               <h3 className="section-title">Device Configuration & Alerts:</h3>
//               {hasCustomizations() && (
//                 <button className="reset-all-labels-btn" onClick={handleResetAll} title="Reset all custom names and gauge settings to defaults">
//                   <FontAwesomeIcon icon={faRotateLeft} /> Reset All Names
//                 </button>
//               )}
//             </div> */}

//             <div className="device-config-container">

//               {/* Row 1 */}
//               {/* <div className="config-row">
//                 <div className="config-item">
//                   <label><EditableLabel deviceId={id} attributeKey="pump_motor_frequency" onSave={handleSaveLabel} onReset={handleResetLabel} />:</label>
//                   <span className="config-value">{parseVal(deviceData.nbGenerator.pump_motor_frequency)} Hz</span>
//                 </div>
//                 <div className="config-item">
//                   <label><EditableLabel deviceId={id} attributeKey="pump_motor_current" onSave={handleSaveLabel} onReset={handleResetLabel} />:</label>
//                   <span className="config-value">{parseVal(deviceData.nbGenerator.pump_motor_current)} A</span>
//                 </div>
//               </div> */}

//               {/* Row 2 */}
//               {/* <div className="config-row">
//                 <div className="config-item">
//                   <label><EditableLabel deviceId={id} attributeKey="water_flow_rate" onSave={handleSaveLabel} onReset={handleResetLabel} />:</label>
//                   <span className="config-value">{safeDisplay(deviceData.nbGenerator.flowRate)} L/min</span>
//                 </div>
//                 <div className="config-item">
//                   <label><EditableLabel deviceId={id} attributeKey="water_pressure" onSave={handleSaveLabel} onReset={handleResetLabel} />:</label>
//                   <span className="config-value">{safeDisplay(deviceData.nbGenerator.pressure)} bar</span>
//                 </div>
//               </div> */}

//               {/* Row 3 */}
//               {/* <div className="config-row">
//                 <div className="config-item">
//                   <label><EditableLabel deviceId={id} attributeKey="oxygen_flow" onSave={handleSaveLabel} onReset={handleResetLabel} />:</label>
//                   <span className="config-value">{parseVal(deviceData.nbGenerator.oxygen_flow)} L/min</span>
//                 </div>
//                 <div className="config-item">
//                   <label><EditableLabel deviceId={id} attributeKey="spare_1" onSave={handleSaveLabel} onReset={handleResetLabel} />:</label>
//                   <span className="config-value">{parseVal(deviceData.nbGenerator.spare_1)} L/min</span>
//                 </div>
//               </div> */}

//               {/* <hr className="section-divider" /> */}

//               {/* ====== GAUGES + VALUE CARDS ====== */}
//               <div className="config-gauge-row">
//                 <div className="config-gauge-header">
//                   <div className="config-gauge-title-wrapper">
//                     {/* <span className="config-gauge-title-icon">📡</span> */}
//                     <h4 className="config-gauge-title">Process Parameters</h4>
//                     {hasCustomizations() && (
//                       <button className="reset-all-labels-btn" onClick={handleResetAll} title="Reset all custom names and gauge settings to defaults">
//                         <FontAwesomeIcon icon={faRotateLeft} /> Reset All Names
//                       </button>
//                     )}
//                   </div>
//                   <div className="config-gauge-header-right">
//                     <div className="config-gauge-live-badge">
                  
//                       <span className="config-gauge-live-dot"></span>LIVE
//                     </div>
//                     <button className="view-logs-btn" onClick={() => navigate(`/device/${id}/logdetails`)}>View All Sensor Logs</button>
//                   </div>
//                 </div>

//                 {/* Gauge Row 1 - 4 gauges */}
//                 <div className="config-gauges-grid">
//                   {GAUGE_CONFIGS.map((config) => (
//                     <GaugeChart
//                       key={config.key}
//                       gaugeKey={config.maxKey}
//                       value={getGaugeValue(config.dataField)}
//                       min={config.min}
//                       max={getGaugeMax(config)}
//                       defaultMax={config.max}
//                       unit={config.unit}
//                       label={getLabel(config.labelKey)}
//                       icon={config.icon}
//                       colorStops={config.colorStops}
//                       isMaxCustomized={isGaugeMaxCustomized(config.maxKey)}
//                       onSaveMax={handleSaveGaugeMax}
//                       onResetMax={handleResetGaugeMax}
//                       deviceId={id}
//                       labelKey={config.labelKey}
//                       onSaveLabel={handleSaveLabel}
//                       onResetLabel={handleResetLabel}
//                     />
//                   ))}
//                 </div>

//                                 {/* Row 2 - Oxygen Flow, Spare 1, Total Running Hours, Total Water Outlet */}
//                 <div className="config-gauges-grid">
//                   {GAUGE_CONFIGS_ROW2.map((config) => (
//                     <GaugeChart
//                       key={config.key}
//                       gaugeKey={config.maxKey}
//                       value={getGaugeValue(config.dataField)}
//                       min={config.min}
//                       max={getGaugeMax(config)}
//                       defaultMax={config.max}
//                       unit={config.unit}
//                       label={getLabel(config.labelKey)}
//                       icon={config.icon}
//                       colorStops={config.colorStops}
//                       isMaxCustomized={isGaugeMaxCustomized(config.maxKey)}
//                       onSaveMax={handleSaveGaugeMax}
//                       onResetMax={handleResetGaugeMax}
//                       deviceId={id}
//                       labelKey={config.labelKey}
//                       onSaveLabel={handleSaveLabel}
//                       onResetLabel={handleResetLabel}
//                     />
//                   ))}

//                   {/* Total Running Hours */}
//                   <div className="gauge-card value-only-card" style={{ '--gauge-color': '#f59e0b', '--gauge-glow': '#fbbf24' }}>
//                     <div className="gauge-card-accent" style={{ background: 'linear-gradient(90deg, #f59e0b00, #f59e0b, #f59e0b00)' }} />
//                     <div className="gauge-card-header">
//                       <div className="gauge-icon-wrapper" style={{ background: 'rgba(245,158,11,0.08)', borderColor: '#f59e0b30' }}>
//                         <span className="gauge-icon">⏱️</span>
//                       </div>
//                       <span className="gauge-label">
//                         <EditableLabel deviceId={id} attributeKey="total_running_hours" onSave={handleSaveLabel} onReset={handleResetLabel} />
//                       </span>
//                     </div>
//                     <div className="value-only-display">
//                       <span className="value-only-number" style={{ color: '#f59e0b' }}>
//                         {parseVal(deviceData.nbGenerator.total_running_hours)}
//                       </span>
//                       <span className="value-only-unit">Hours</span>
//                     </div>
//                   </div>

//                   {/* Total Water Outlet */}
//                   <div className="gauge-card value-only-card" style={{ '--gauge-color': '#3b82f6', '--gauge-glow': '#60a5fa' }}>
//                     <div className="gauge-card-accent" style={{ background: 'linear-gradient(90deg, #3b82f600, #3b82f6, #3b82f600)' }} />
//                     <div className="gauge-card-header">
//                       <div className="gauge-icon-wrapper" style={{ background: 'rgba(59,130,246,0.08)', borderColor: '#3b82f630' }}>
//                         <span className="gauge-icon">🚿</span>
//                       </div>
//                       <span className="gauge-label">
//                         <EditableLabel deviceId={id} attributeKey="total_water_outlet" onSave={handleSaveLabel} onReset={handleResetLabel} />
//                       </span>
//                     </div>
//                     <div className="value-only-display">
//                       <span className="value-only-number" style={{ color: '#3b82f6' }}>
//                         {deviceData.nbGenerator.totalWaterOutlet || 0}
//                       </span>
//                       <span className="value-only-unit">Litres</span>
//                     </div>
//                   </div>
//                 </div>



//               </div>


//               {/* ====== SETTINGS SECTION ====== */}
//               <div className="settings-section">
//                 <div className="settings-section-header">
//                   <div className="settings-title-wrapper">
//                     <h4 className="settings-title">Settings</h4>
//                   </div>
//                 </div>

//                 <div className="settings-content">
//                   {/* Auto Mode */}
//                   <div className="settings-single-row">
//                     <div className="config-item">
//                       <label><EditableLabel deviceId={id} attributeKey="auto_mode" onSave={handleSaveLabel} onReset={handleResetLabel} />:</label>
//                       <div className="auto-mode-toggle-container">
//                         <span className={`auto-mode-status ${autoMode ? 'on' : 'off'}`}>{autoWaiting ? 'Switching...' : (autoMode ? 'ON' : 'OFF')}</span>
//                         <label className={`auto-mode-switch ${autoWaiting ? "auto-mode-waiting" : ""}`}>
//                           <input type="checkbox" checked={autoMode} onChange={() => !autoWaiting && handleAutoModeToggle()} disabled={autoWaiting || !conn} />
//                           <span className="auto-mode-slider"></span>
//                         </label>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Settings Column Headings */}
//                   <div className="settings-headings-row">
//                     <div className="settings-heading-label"></div>
//                     <div className="settings-heading-values">
//                       <span className="config-heading">Actual</span>
//                       <span className="config-heading">Set Value</span>
//                       <span className="config-heading">Set New Value</span>
//                       <span className="config-heading-spacer"></span>
//                     </div>
//                   </div>
                  
//                   {/* Auto Sequence Counter */}
//                   <div className="settings-single-row">
//                     <div className="config-item settings-full-item">  
//                       <label><EditableLabel deviceId={id} attributeKey="auto_sequence_counter" onSave={handleSaveLabel} onReset={handleResetLabel} />:</label>
//                       <div className="editable-field">
//                         <input type="number" value={deviceData.nbGenerator.auto_sequence_counter ?? 0} disabled className="config-input" />
//                         <input type="number" value={deviceData.nbGenerator.auto_sequence_counter_write ?? 0} disabled className="config-input" />
//                         <input type="number" value={counter} onChange={(e) => setCounter(e.target.value)} placeholder="Enter value" className="config-input editing" disabled={isWriting.counter} min="0" max="65535" />
//                         <button className={`editt-btn ${writeSuccess.counter ? 'success-btn' : ''}`} onClick={handleCounterClick} disabled={!conn || isWriting.counter || !counter}>
//                           {isWriting.counter ? <span className="spinner">⟳</span> : <FontAwesomeIcon icon={writeSuccess.counter ? faCheck : faCircleCheck} />}
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Auto Sequence Off Time */}
//                   <div className="settings-single-row">
//                     <div className="config-item settings-full-item">
//                       <label><EditableLabel deviceId={id} attributeKey="auto_sequence_off_time" onSave={handleSaveLabel} onReset={handleResetLabel} />:</label>
//                       <div className="editable-field">
//                         <input type="number" value={deviceData.nbGenerator.auto_sequence_off_time ?? 0} disabled className="config-input" />
//                         <input type="number" value={deviceData.nbGenerator.auto_sequence_off_write ?? 0} disabled className="config-input" />
//                         <input type="number" value={offTime} onChange={(e) => setOffTime(e.target.value)} placeholder="Enter value" className="config-input editing" disabled={isWriting.offTime} min="0" max="65535" />
//                         <button className={`editt-btn ${writeSuccess.offTime ? 'success-btn' : ''}`} onClick={handleOffTimeClick} disabled={!conn || isWriting.offTime || !offTime}>
//                           {isWriting.offTime ? <span className="spinner">⟳</span> : <FontAwesomeIcon icon={writeSuccess.offTime ? faCheck : faCircleCheck} />}
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Auto Sequence On Time */}
//                   <div className="settings-single-row">
//                     <div className="config-item settings-full-item">
//                       <label><EditableLabel deviceId={id} attributeKey="auto_sequence_on_time" onSave={handleSaveLabel} onReset={handleResetLabel} />:</label>
//                       <div className="editable-field">
//                         <input type="number" value={deviceData.nbGenerator.auto_sequence_on_time ?? 0} disabled className="config-input" />
//                         <input type="number" value={deviceData.nbGenerator.auto_sequence_on_write ?? 0} disabled className="config-input" />
//                         <input type="number" value={onTime} onChange={(e) => setOnTime(e.target.value)} placeholder="Enter value" className="config-input editing" disabled={isWriting.onTime} min="0" max="65535" />
//                         <button className={`editt-btn ${writeSuccess.onTime ? 'success-btn' : ''}`} onClick={handleOnTimeClick} disabled={!conn || isWriting.onTime || !onTime}>
//                           {isWriting.onTime ? <span className="spinner">⟳</span> : <FontAwesomeIcon icon={writeSuccess.onTime ? faCheck : faCircleCheck} />}
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* <hr className="section-divider" /> */}

//           {/* ====== SECTION: Charts ====== */}
//           <div className="unified-section">
//             <DeviceCharts deviceId={id} />
//           </div>

//           <hr className="section-divider" />

//           {/* ====== SECTION: Device Alert and Info History ====== */}
//           <div className="unified-section">
//             <h3 className="section-title">Digital I/O Feedback Status:</h3>
//             <div className="alert-grid-wrapper">
//               <div className="alert-grid">
//                 {(() => {
//                   const alertStatus = deviceData.nbGenerator.alert_status || 0;
//                   return ALERT_BIT_KEYS.map((key, index) => {
//                     const bitValue = (alertStatus >> index) & 1;
//                     return (
//                       <div key={key} className={`alert-item ${bitValue === 1 ? 'alert-on' : 'alert-off'}`}>
//                         <div className="alert-label">
//                           <EditableLabel deviceId={id} attributeKey={key} onSave={handleSaveLabel} onReset={handleResetLabel} />
//                         </div>
//                         <div className={`alert-value ${bitValue === 1 ? 'value-on' : 'value-off'}`}>{bitValue === 1 ? 'ON' : 'OFF'}</div>
//                       </div>
//                     );
//                   });
//                 })()}
//               </div>
//             </div>
//           </div>

//         </div>
//       )}
//     </>
//   );
// };

// export default DeviceDetails;







// src/pages/DeviceDetails.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DeviceDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DeviceCharts from "../DataChart";
import {
  faLink, faPencil, faCheck, faSave, faTimes, faRotateLeft
} from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import axios from "axios";
import { useLabels } from '../../context/LabelContext';
import {
  canEditDeviceInfo,
  canEditLabels,
  canEditGaugeMax,
  canTogglePower,
  canToggleAutoMode,
  canWriteRegisters,
} from '../../constants/roles';

// ==================== EDITABLE LABEL COMPONENT ====================
const EditableLabel = ({ deviceId, attributeKey, onSave, onReset }) => {
  const { getLabel, isCustomized, getDefaultLabel } = useLabels();

  const currentLabel = getLabel(deviceId, attributeKey);
  const defaultLabel = getDefaultLabel(deviceId, attributeKey);
  const customized = isCustomized(deviceId, attributeKey);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentLabel);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => { setEditValue(currentLabel); }, [currentLabel]);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === currentLabel) {
      setEditValue(currentLabel);
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(attributeKey, trimmed);
      setIsEditing(false);
    } catch (err) {
      setEditValue(currentLabel);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsSaving(true);
    try {
      await onReset(attributeKey);
      setEditValue(defaultLabel);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to reset:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') { setEditValue(currentLabel); setIsEditing(false); }
  };

  if (isEditing) {
    return (
      <span className="editable-label editing" ref={containerRef}>
        <input
          ref={inputRef} type="text" value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setTimeout(() => {
              if (containerRef.current && containerRef.current.contains(document.activeElement)) return;
              handleSave();
            }, 200);
          }}
          className="label-edit-input" disabled={isSaving} maxLength={50}
        />
        <button className="label-btn label-save-btn" onClick={handleSave} disabled={isSaving} title="Save">
          <FontAwesomeIcon icon={faCheck} />
        </button>
        <button className="label-btn label-cancel-btn" onClick={() => { setEditValue(currentLabel); setIsEditing(false); }} disabled={isSaving} title="Cancel">
          <FontAwesomeIcon icon={faTimes} />
        </button>
        {customized && (
          <button className="label-btn label-reset-btn" onClick={handleReset} disabled={isSaving} title={`Reset to: "${defaultLabel}"`}>
            <FontAwesomeIcon icon={faRotateLeft} />
          </button>
        )}
      </span>
    );
  }

  return (
    <span className="editable-label">
      <span
        className={`label-text ${customized ? 'customized' : ''}`}
        onClick={() => setIsEditing(true)}
        title={customized ? `Custom (default: "${defaultLabel}"). Click to edit.` : 'Click to rename'}
      >
        {currentLabel}{customized && <span className="custom-indicator">✎</span>}
      </span>
      <button className="label-btn label-edit-trigger" onClick={() => setIsEditing(true)} title="Rename">
        <FontAwesomeIcon icon={faPencil} />
      </button>
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
  useEffect(() => {
    if (isEditing && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); }
  }, [isEditing]);

  const handleSave = async () => {
    const num = parseFloat(editValue);
    if (isNaN(num) || num <= 0 || num === currentMax) {
      setEditValue(String(currentMax));
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try { await onSave(gaugeKey, num); setIsEditing(false); }
    catch (err) { setEditValue(String(currentMax)); }
    finally { setIsSaving(false); }
  };

  const handleReset = async () => {
    setIsSaving(true);
    try { await onReset(gaugeKey); setEditValue(String(defaultMax)); setIsEditing(false); }
    catch (err) { console.error('Failed to reset max:', err); }
    finally { setIsSaving(false); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') { setEditValue(String(currentMax)); setIsEditing(false); }
  };

  if (isEditing) {
    return (
      <span className="editable-max editing" ref={containerRef}>
        <input ref={inputRef} type="number" value={editValue}
          onChange={(e) => setEditValue(e.target.value)} onKeyDown={handleKeyDown}
          onBlur={() => { setTimeout(() => { if (containerRef.current && containerRef.current.contains(document.activeElement)) return; handleSave(); }, 200); }}
          className="max-edit-input" disabled={isSaving} min="1" step="any" />
        <button className="label-btn label-save-btn" onClick={handleSave} disabled={isSaving} title="Save"><FontAwesomeIcon icon={faCheck} /></button>
        <button className="label-btn label-cancel-btn" onClick={() => { setEditValue(String(currentMax)); setIsEditing(false); }} disabled={isSaving} title="Cancel"><FontAwesomeIcon icon={faTimes} /></button>
        {isCustomized && <button className="label-btn label-reset-btn" onClick={handleReset} disabled={isSaving} title={`Reset to default: ${defaultMax}`}><FontAwesomeIcon icon={faRotateLeft} /></button>}
      </span>
    );
  }

  return (
    <span className="editable-max">
      <span className={`max-value-text ${isCustomized ? 'customized' : ''}`} onClick={() => setIsEditing(true)}
        title={isCustomized ? `Custom max (default: ${defaultMax}). Click to edit.` : 'Click to set custom max'}>
        {currentMax}{isCustomized && <span className="custom-indicator">✎</span>}
      </span>
      <button className="label-btn label-edit-trigger" onClick={() => setIsEditing(true)} title="Edit max value"><FontAwesomeIcon icon={faPencil} /></button>
    </span>
  );
};

// ==================== GAUGE CHART COMPONENT ====================
const GaugeChart = React.memo(({ value, min, max, unit, label, colorStops, icon, gaugeKey, defaultMax, isMaxCustomized, onSaveMax, onResetMax, deviceId, labelKey, onSaveLabel, onResetLabel }) => {
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
    if (range === 0) return { primary: colorStops[0].color, glow: colorStops[0].glow || colorStops[0].color, bg: colorStops[0].bg || colorStops[0].color + '15' };
    const percentage = ((val - min) / range) * 100;
    for (let i = colorStops.length - 1; i >= 0; i--) {
      if (percentage >= colorStops[i].stop) return { primary: colorStops[i].color, glow: colorStops[i].glow || colorStops[i].color, bg: colorStops[i].bg || colorStops[i].color + '15' };
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

    if (animationRef.current) { cancelAnimationFrame(animationRef.current); animationRef.current = null; }
    let isActive = true;

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

      const ambientGlow = ctx.createRadialGradient(cx, cy, r - 20, cx, cy, r + 30);
      ambientGlow.addColorStop(0, colors.primary + '08');
      ambientGlow.addColorStop(0.5, colors.primary + '04');
      ambientGlow.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(cx, cy, r + 25, 0, Math.PI * 2); ctx.fillStyle = ambientGlow; ctx.fill();

      ctx.beginPath(); ctx.arc(cx, cy, r, startAngle, endAngle); ctx.strokeStyle = '#e8ecf1'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, r, startAngle, endAngle); ctx.strokeStyle = '#f1f3f6'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, r, startAngle, endAngle); ctx.strokeStyle = '#e8ecf1'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke();

      if (percentage > 0.005) {
        ctx.beginPath(); ctx.arc(cx, cy, r, startAngle, valueAngle); ctx.strokeStyle = colors.primary + '25'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, r, startAngle, valueAngle);
        const gradX1 = cx + Math.cos(startAngle) * r, gradY1 = cy + Math.sin(startAngle) * r;
        const gradX2 = cx + Math.cos(valueAngle) * r, gradY2 = cy + Math.sin(valueAngle) * r;
        if (isFinite(gradX1) && isFinite(gradY1) && isFinite(gradX2) && isFinite(gradY2) && (gradX1 !== gradX2 || gradY1 !== gradY2)) {
          const arcGrad = ctx.createLinearGradient(gradX1, gradY1, gradX2, gradY2);
          arcGrad.addColorStop(0, colors.primary + 'CC'); arcGrad.addColorStop(0.5, colors.primary); arcGrad.addColorStop(1, colors.glow);
          ctx.strokeStyle = arcGrad;
        } else { ctx.strokeStyle = colors.primary; }
        ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke();

        const dotX = cx + Math.cos(valueAngle) * r, dotY = cy + Math.sin(valueAngle) * r;
        if (isFinite(dotX) && isFinite(dotY)) {
          const dotGlow = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 14);
          dotGlow.addColorStop(0, colors.primary + '60'); dotGlow.addColorStop(1, 'transparent');
          ctx.beginPath(); ctx.arc(dotX, dotY, 14, 0, Math.PI * 2); ctx.fillStyle = dotGlow; ctx.fill();
          ctx.beginPath(); ctx.arc(dotX, dotY, 5, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill();
          ctx.strokeStyle = colors.primary; ctx.lineWidth = 2.5; ctx.stroke();
        }
      }

      const majorTicks = 5, minorTicks = 25;
      for (let i = 0; i <= minorTicks; i++) {
        const tickAngle = startAngle + (totalAngle * i) / minorTicks;
        const isPastValue = (i / minorTicks) <= percentage;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(tickAngle) * (r - 17), cy + Math.sin(tickAngle) * (r - 17));
        ctx.lineTo(cx + Math.cos(tickAngle) * (r - 13), cy + Math.sin(tickAngle) * (r - 13));
        ctx.strokeStyle = isPastValue ? colors.primary + '60' : '#d1d5db'; ctx.lineWidth = 1; ctx.lineCap = 'round'; ctx.stroke();
      }
      for (let i = 0; i <= majorTicks; i++) {
        const tickAngle = startAngle + (totalAngle * i) / majorTicks;
        const isPastValue = (i / majorTicks) <= percentage;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(tickAngle) * (r - 22), cy + Math.sin(tickAngle) * (r - 22));
        ctx.lineTo(cx + Math.cos(tickAngle) * (r - 13), cy + Math.sin(tickAngle) * (r - 13));
        ctx.strokeStyle = isPastValue ? colors.primary + '90' : '#9ca3af'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.stroke();
        const labelR = r - 32;
        const tickValue = min + ((max - min) * i) / majorTicks;
        const labelX = cx + Math.cos(tickAngle) * labelR, labelY = cy + Math.sin(tickAngle) * labelR;
        ctx.save();
        ctx.fillStyle = isPastValue ? '#374151' : '#9ca3af';
        ctx.font = `${isPastValue ? '600' : '400'} 9px 'Inter', system-ui, sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        let labelText;
        if (tickValue >= 1000) labelText = `${(tickValue / 1000).toFixed(0)}k`;
        else if (tickValue === Math.floor(tickValue)) labelText = tickValue.toFixed(0);
        else labelText = tickValue.toFixed(1);
        ctx.fillText(labelText, labelX, labelY);
        ctx.restore();
      }

      const needleAngle = startAngle + totalAngle * percentage;
      const needleLength = r - 10;
      if (isFinite(needleAngle)) {
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.15)'; ctx.shadowBlur = 8; ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(needleAngle) * needleLength, cy + Math.sin(needleAngle) * needleLength);
        ctx.lineTo(cx + Math.cos(needleAngle + Math.PI / 2) * 3, cy + Math.sin(needleAngle + Math.PI / 2) * 3);
        ctx.lineTo(cx + Math.cos(needleAngle + Math.PI) * 12, cy + Math.sin(needleAngle + Math.PI) * 12);
        ctx.lineTo(cx + Math.cos(needleAngle - Math.PI / 2) * 3, cy + Math.sin(needleAngle - Math.PI / 2) * 3);
        ctx.closePath();
        const nX1 = cx + Math.cos(needleAngle + Math.PI) * 12, nY1 = cy + Math.sin(needleAngle + Math.PI) * 12;
        const nX2 = cx + Math.cos(needleAngle) * needleLength, nY2 = cy + Math.sin(needleAngle) * needleLength;
        if (isFinite(nX1) && isFinite(nY1) && isFinite(nX2) && isFinite(nY2) && (nX1 !== nX2 || nY1 !== nY2)) {
          const needleGrad = ctx.createLinearGradient(nX1, nY1, nX2, nY2);
          needleGrad.addColorStop(0, '#6b7280'); needleGrad.addColorStop(0.4, '#374151'); needleGrad.addColorStop(0.8, colors.primary); needleGrad.addColorStop(1, colors.glow);
          ctx.fillStyle = needleGrad;
        } else { ctx.fillStyle = colors.primary; }
        ctx.fill(); ctx.restore();
      }

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.1)'; ctx.shadowBlur = 6;
      const outerHub = ctx.createRadialGradient(cx, cy - 2, 0, cx, cy, 14);
      outerHub.addColorStop(0, '#f9fafb'); outerHub.addColorStop(0.3, '#e5e7eb'); outerHub.addColorStop(0.7, '#d1d5db'); outerHub.addColorStop(1, '#9ca3af');
      ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fillStyle = outerHub; ctx.fill(); ctx.restore();
      const innerHub = ctx.createRadialGradient(cx, cy - 2, 0, cx, cy, 10);
      innerHub.addColorStop(0, '#ffffff'); innerHub.addColorStop(0.6, '#f3f4f6'); innerHub.addColorStop(1, '#e5e7eb');
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fillStyle = innerHub; ctx.fill(); ctx.strokeStyle = '#d1d5db'; ctx.lineWidth = 0.5; ctx.stroke();
      const dotGrad = ctx.createRadialGradient(cx, cy - 1, 0, cx, cy, 4);
      dotGrad.addColorStop(0, colors.glow); dotGrad.addColorStop(1, colors.primary);
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fillStyle = dotGrad; ctx.fill();
    };

    const animate = () => {
      if (!isActive) return;
      const diff = safeValue - animatedValue.current;
      animatedValue.current += diff * 0.06;
      if (Math.abs(diff) < 0.01) animatedValue.current = safeValue;
      try { drawGauge(ctx, centerX, centerY, radius, startAngle, endAngle, totalAngle, animatedValue.current, size); }
      catch (err) { console.error('Gauge draw error:', err); isActive = false; return; }
      if (Math.abs(diff) > 0.01 && isActive) { animationRef.current = requestAnimationFrame(animate); }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => { isActive = false; if (animationRef.current) { cancelAnimationFrame(animationRef.current); animationRef.current = null; } };
  }, [safeValue, min, max]);

  const currentColor = getColor(Math.min(originalValue, max));
  const colors = getGradientColors(Math.min(originalValue, max));

  return (
    <div className="gauge-card" style={{ '--gauge-color': currentColor, '--gauge-glow': colors.glow }}>
      <div className="gauge-card-accent" style={{ background: `linear-gradient(90deg, ${currentColor}00, ${currentColor}, ${currentColor}00)` }} />
      <div className="gauge-card-header">
        <div className="gauge-icon-wrapper" style={{ background: colors.bg, borderColor: currentColor + '30' }}>
          <span className="gauge-icon">{icon}</span>
        </div>
        <span className="gauge-label">
          {deviceId && labelKey && onSaveLabel && onResetLabel ? (
            <EditableLabel deviceId={deviceId} attributeKey={labelKey} onSave={onSaveLabel} onReset={onResetLabel} />
          ) : (
            label
          )}
        </span>
      </div>
      <div className="gauge-canvas-wrapper">
        <canvas ref={canvasRef} className="gauge-canvas" />
        <div className="gauge-center-value">
          <span className="gauge-value" style={{ color: currentColor }}>{originalValue.toFixed(2)}</span>
          <span className="gauge-unit">{unit}</span>
        </div>
      </div>
      <div className="gauge-footer">
        <div className="gauge-range">
          <span className="gauge-min">{min}</span>
          <div className="gauge-max-editable">
            <span className="gauge-max-label">Max:</span>
            <EditableMaxValue gaugeKey={gaugeKey} currentMax={max} defaultMax={defaultMax} isCustomized={isMaxCustomized} onSave={onSaveMax} onReset={onResetMax} />
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value && prevProps.min === nextProps.min &&
    prevProps.max === nextProps.max && prevProps.label === nextProps.label &&
    prevProps.isMaxCustomized === nextProps.isMaxCustomized;
});

// ==================== GAUGE CONFIGS ====================
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
    key: 'flowRate', dataField: 'flowRate', labelKey: 'gauge_flow_rate',
    maxKey: 'gauge_flow_rate_max', label: 'Water Flow Rate', unit: 'L/min',
    min: 0, max: 120, icon: '💧',
    colorStops: [
      { stop: 0, color: '#3b82f6', glow: '#60a5fa', bg: 'rgba(59,130,246,0.08)' },
      { stop: 30, color: '#10b981', glow: '#34d399', bg: 'rgba(16,185,129,0.08)' },
      { stop: 60, color: '#f59e0b', glow: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
      { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
    ]
  },
  {
    key: 'pressure', dataField: 'pressure', labelKey: 'gauge_pressure',
    maxKey: 'gauge_pressure_max', label: 'Water Pressure', unit: 'bar',
    min: 0, max: 10, icon: '🔵',
    colorStops: [
      { stop: 0, color: '#06b6d4', glow: '#22d3ee', bg: 'rgba(6,182,212,0.08)' },
      { stop: 30, color: '#10b981', glow: '#34d399', bg: 'rgba(16,185,129,0.08)' },
      { stop: 60, color: '#f59e0b', glow: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
      { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
    ]
  },
  {
    key: 'pumpMotorFrequency', dataField: 'pump_motor_frequency', labelKey: 'gauge_motor_frequency',
    maxKey: 'gauge_motor_frequency_max', label: 'Motor Frequency', unit: 'Hz',
    min: 0, max: 100, icon: '⚡',
    colorStops: [
      { stop: 0, color: '#8b5cf6', glow: '#a78bfa', bg: 'rgba(139,92,246,0.08)' },
      { stop: 30, color: '#3b82f6', glow: '#60a5fa', bg: 'rgba(59,130,246,0.08)' },
      { stop: 60, color: '#f59e0b', glow: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
      { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
    ]
  },
  {
    key: 'pumpMotorCurrent', dataField: 'pump_motor_current', labelKey: 'gauge_motor_current',
    maxKey: 'gauge_motor_current_max', label: 'Motor Current', unit: 'A',
    min: 0, max: 20, icon: '🔌',
    colorStops: [
      { stop: 0, color: '#14b8a6', glow: '#2dd4bf', bg: 'rgba(20,184,166,0.08)' },
      { stop: 30, color: '#22c55e', glow: '#4ade80', bg: 'rgba(34,197,94,0.08)' },
      { stop: 60, color: '#eab308', glow: '#facc15', bg: 'rgba(234,179,8,0.08)' },
      { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
    ]
  }
];

const GAUGE_CONFIGS_ROW2 = [
  {
    key: 'oxygenFlow', dataField: 'oxygen_flow', labelKey: 'gauge_oxygen_flow',
    maxKey: 'gauge_oxygen_flow_max', label: 'Oxygen Flow', unit: 'L/min',
    min: 0, max: 50, icon: '🫧',
    colorStops: [
      { stop: 0, color: '#0ea5e9', glow: '#38bdf8', bg: 'rgba(14,165,233,0.08)' },
      { stop: 30, color: '#10b981', glow: '#34d399', bg: 'rgba(16,185,129,0.08)' },
      { stop: 60, color: '#f59e0b', glow: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
      { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
    ]
  },
  {
    key: 'spare1', dataField: 'spare_1', labelKey: 'gauge_spare_1',
    maxKey: 'gauge_spare_1_max', label: 'Spare 1', unit: 'L/min',
    min: 0, max: 50, icon: '📊',
    colorStops: [
      { stop: 0, color: '#a855f7', glow: '#c084fc', bg: 'rgba(168,85,247,0.08)' },
      { stop: 30, color: '#6366f1', glow: '#818cf8', bg: 'rgba(99,102,241,0.08)' },
      { stop: 60, color: '#f59e0b', glow: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
      { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
    ]
  }
];

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
  const navigate = useNavigate();

  const storedUser = (() => {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
})();
const userRole = storedUser?.role !== undefined ? Number(storedUser.role) : null;

  const {
    fetchLabels, getLabel: getLabelFromContext, saveLabel: saveLabelToContext,
    resetLabel: resetLabelFromContext, resetAllLabels: resetAllFromContext,
    isCustomized: isLabelCustomized, getDefaultLabel,
    getGaugeMax: getGaugeMaxFromContext, isGaugeMaxCustomized: isMaxCustomizedFromContext,
    saveGaugeMax: saveGaugeMaxToContext, resetGaugeMax: resetGaugeMaxFromContext,
  } = useLabels();

  const getLabel = useCallback((key) => getLabelFromContext(id, key), [getLabelFromContext, id]);
  const handleSaveLabel = useCallback(async (key, value) => await saveLabelToContext(id, key, value), [saveLabelToContext, id]);
  const handleResetLabel = useCallback(async (key) => await resetLabelFromContext(id, key), [resetLabelFromContext, id]);
  const handleResetAll = useCallback(async () => await resetAllFromContext(id), [resetAllFromContext, id]);
  const getGaugeMax = useCallback((config) => getGaugeMaxFromContext(id, config.maxKey, config.max), [getGaugeMaxFromContext, id]);
  const isGaugeMaxCustomized = useCallback((maxKey) => isMaxCustomizedFromContext(id, maxKey), [isMaxCustomizedFromContext, id]);
  const handleSaveGaugeMax = useCallback(async (maxKey, value) => await saveGaugeMaxToContext(id, maxKey, value), [saveGaugeMaxToContext, id]);
  const handleResetGaugeMax = useCallback(async (maxKey) => await resetGaugeMaxFromContext(id, maxKey), [resetGaugeMaxFromContext, id]);

  const hasCustomizations = useCallback(() => {
    return ALERT_BIT_KEYS.some(k => isLabelCustomized(id, k)) ||
      ['pump_motor_frequency', 'pump_motor_current', 'total_running_hours', 'total_water_outlet',
        'water_flow_rate', 'water_pressure', 'auto_sequence_counter', 'auto_sequence_off_time',
        'auto_sequence_on_time', 'auto_mode', 'oxygen_flow', 'spare_1',
        'gauge_flow_rate', 'gauge_pressure', 'gauge_motor_frequency', 'gauge_motor_current',
        'gauge_oxygen_flow', 'gauge_spare_1'
      ].some(k => isLabelCustomized(id, k));
  }, [isLabelCustomized, id]);

  const isWaitingRef = useRef(false);
  const isAutoWaitingRef = useRef(false);
  const autoModeToggleTimeRef = useRef(0);
  const powerToggleTimeRef = useRef(0);

  const checkPowerStatusFromBit = (statusValue) => {
    if (statusValue === null || statusValue === undefined) return false;
    return ((statusValue >> 3) & 1) === 1;
  };

  const checkAutoModeFromBit = (statusValue) => {
    if (statusValue === null || statusValue === undefined) return false;
    return ((statusValue >> 8) & 1) === 1;
  };

  const [powerStatusHistory, setPowerStatusHistory] = useState([]);
  const [connectedIntervals, setConnectedIntervals] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [autoWaiting, setAutoWaiting] = useState(false);
  const [deviceName, setDeviceName] = useState("Loading...");
  const [deviceInfo, setDeviceInfo] = useState({ owner_name: "Loading...", phone_number: "Loading...", email_id: "Loading...", location: "Loading..." });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableInfo, setEditableInfo] = useState({ owner_name: "", phone_number: "", email_id: "", location: "" });
  const [isWriting, setIsWriting] = useState({ counter: false, onTime: false, offTime: false });
  const [writeSuccess, setWriteSuccess] = useState({ counter: false, onTime: false, offTime: false });
  const [lastWritten, setLastWritten] = useState({ counter: "", onTime: "", offTime: "" });
  const [deviceData, setDeviceData] = useState({
    nbGenerator: { flowRate: "", pressure: "", waterTemperature: "", systemTemperature: "", totalWaterOutlet: "", pump_motor_frequency: 0, pump_motor_current: 0, total_running_hours: 0, auto_sequence_on_time: 0, auto_sequence_off_time: 0, auto_sequence_counter: 0, auto_sequence_on_write: 0, auto_sequence_off_write: 0, auto_sequence_counter_write: 0, oxygen_flow: 0, spare_1: 0, alert_status: 0, timestamp: "" },
    ozoneGenerator: { flowRate: "", pressure: "", waterTemperature: "", systemTemperature: "", totalWaterOutlet: "", timestamp: "" },
    oxygenGenerator: { flowRate: "", pressure: "", waterTemperature: "", systemTemperature: "", totalWaterOutlet: "", timestamp: "" },
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

  useEffect(() => { fetchLabels(id); }, [fetchLabels, id]);

  // ==================== FETCH POWER STATUS HISTORY ====================
  const fetchPowerStatusHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_EP}/data/devices/${id}/power-status-history?days=20`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.status === 'success') {
        if (Array.isArray(data.data)) {
          setPowerStatusHistory(data.data);
          setConnectedIntervals([]);
        } else {
          setPowerStatusHistory(data.data.statusChanges || []);
          setConnectedIntervals(data.data.connectedIntervals || []);
        }
      }
    } catch (error) { console.error('Error fetching power status history:', error); }
    finally { setLoadingHistory(false); }
  }, [id]);

  useEffect(() => {
    fetchPowerStatusHistory();
  }, [fetchPowerStatusHistory]);

  // ==================== FETCH DEVICE DATA ====================
  const fetchDeviceData = useCallback(async () => {
    try {
      const telemetryRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`);
      if (!telemetryRes.ok) return;
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
          alert_status: data.nbGenerator?.alert_status ?? 0
        },
        ozoneGenerator: { ...data.ozoneGenerator },
        oxygenGenerator: { ...data.oxygenGenerator },
      });

      const alertStatus = data.nbGenerator?.alert_status;

      if (!isWaitingRef.current) {
        const timeSincePowerToggle = Date.now() - powerToggleTimeRef.current;
        if (timeSincePowerToggle > POWER_COOLDOWN_MS) {
          const newPowerStatus = checkPowerStatusFromBit(alertStatus);
          setIsPowerOn(prev => prev !== newPowerStatus ? newPowerStatus : prev);
        }
      }

      if (!isAutoWaitingRef.current) {
        const timeSinceAutoToggle = Date.now() - autoModeToggleTimeRef.current;
        if (timeSinceAutoToggle > AUTO_MODE_COOLDOWN_MS) {
          const newAutoMode = checkAutoModeFromBit(alertStatus);
          setAutoMode(prev => prev !== newAutoMode ? newAutoMode : prev);
        }
      }

      if (nbWaiting) setNbWaiting(false);
    } catch (err) {
      console.error("Error:", err);
      setNbWaiting(false);
    }
  }, [id, nbWaiting]);

  const writeToRegister = async (registerType, value) => {
    if (!value || value === '') return false;
    const fieldMap = { 'auto_sequence_counter': 'counter', 'auto_sequence_on': 'onTime', 'auto_sequence_off': 'offTime' };
    const fieldName = fieldMap[registerType];
    setIsWriting(prev => ({ ...prev, [fieldName]: true }));

    try {
      const response = await axios.post(`${process.env.REACT_APP_EP}/api/devices/${id}/write-register`, { registerType, value: parseInt(value) });

      if (response.data.success) {
        setWriteSuccess(prev => ({ ...prev, [fieldName]: true }));
        setLastWritten(prev => ({ ...prev, [fieldName]: value }));
        switch (registerType) {
          case 'auto_sequence_counter': setCounter(''); break;
          case 'auto_sequence_on': setOnTime(''); break;
          case 'auto_sequence_off': setOffTime(''); break;
          default: break;
        }
        setTimeout(() => { setWriteSuccess(prev => ({ ...prev, [fieldName]: false })); }, 5000);
        await fetchDeviceData();
        return true;
      }
    } catch (error) {
      console.error('Error writing to register:', error);
      const rd = error.response?.data;
      const isTimeout = error.response?.status === 504 || rd?.isTimeout || (error.message || '').toLowerCase().includes('timeout');
      alert(isTimeout
        ? "⚠️ Device not responding. Value was NOT written. Check device connection."
        : "❌ Failed to write: " + (rd?.error || error.message));
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
      if (!editableInfo.email_id || !editableInfo.owner_name) { alert("Please fill in both owner name and email fields"); return; }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (editableInfo.email_id !== "N/A" && !emailRegex.test(editableInfo.email_id)) { alert("Please enter a valid email address"); return; }
      const confirmUpdate = window.confirm("Are you sure you want to update this device?");
      if (!confirmUpdate) return;
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_EP}/data/updatedevice`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ azure_device_id: id, owner_name: editableInfo.owner_name, email_id: editableInfo.email_id, phone_number: editableInfo.phone_number, location: editableInfo.location }),
        });
        const result = await response.json();
        if (result.status === "success") { alert("Device updated successfully!"); setDeviceInfo(editableInfo); setIsEditMode(false); }
        else { alert(`Failed to update device: ${result.message}`); }
      } catch (error) { console.error("Error updating device:", error); alert("Failed to update device."); }
      finally { setLoading(false); }
    } else { setIsEditMode(true); }
  };

  const handleInputChange = (field, value) => { setEditableInfo(prev => ({ ...prev, [field]: value })); };

  const handlePowerToggle = async () => {
    const desired = !isPowerOn;
    setNbWaiting(true);
    isWaitingRef.current = true;
    powerToggleTimeRef.current = Date.now();

    if (!conn) { setNbWaiting(false); isWaitingRef.current = false; powerToggleTimeRef.current = 0; return; }

    setIsPowerOn(desired);

    try {
      const response = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/toggle/nb`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: desired ? "on" : "off" }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.isTimeout || response.status === 504) {
          setIsPowerOn(!desired); setNbWaiting(false); isWaitingRef.current = false; powerToggleTimeRef.current = 0;
          alert("⚠️ Device not responding. Check device connection and try again.");
          return;
        }
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      setTimeout(async () => { isWaitingRef.current = false; setNbWaiting(false); await fetchPowerStatusHistory(); await fetchDeviceData(); }, 5000);

    } catch (err) {
      setIsPowerOn(!desired); setNbWaiting(false); isWaitingRef.current = false; powerToggleTimeRef.current = 0;
      const msg = (err.message || '').toLowerCase();
      alert(msg.includes('timeout') || msg.includes('failed to fetch')
        ? "⚠️ Device not responding. Check device connection and try again."
        : "❌ Error: " + err.message);
    }
  };

  const handleAutoModeToggle = async () => {
    const desired = !autoMode;
    setAutoWaiting(true); isAutoWaitingRef.current = true; autoModeToggleTimeRef.current = Date.now();

    if (!conn) { setAutoWaiting(false); isAutoWaitingRef.current = false; autoModeToggleTimeRef.current = 0; return; }

    setAutoMode(desired);

    try {
      const response = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/toggle/auto`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: desired ? "on" : "off" }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.isTimeout || response.status === 504) {
          setAutoMode(!desired); setAutoWaiting(false); isAutoWaitingRef.current = false; autoModeToggleTimeRef.current = 0;
          alert("⚠️ Device not responding. Check device connection and try again.");
          return;
        }
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      setTimeout(() => { isAutoWaitingRef.current = false; setAutoWaiting(false); }, 5000);

    } catch (err) {
      setAutoMode(!desired); setAutoWaiting(false); isAutoWaitingRef.current = false; autoModeToggleTimeRef.current = 0;
      const msg = (err.message || '').toLowerCase();
      alert(msg.includes('timeout') || msg.includes('failed to fetch')
        ? "⚠️ Device not responding. Check device connection and try again."
        : "❌ Error: " + err.message);
    }
  };

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_EP}/data/devices/${id}/info`);
        if (!response.ok) { const f = { owner_name: "N/A", phone_number: "N/A", email_id: "N/A", location: "N/A" }; setDeviceInfo(f); setEditableInfo(f); return; }
        const resp = await response.json();
        if (resp.status === "success" && resp.data) {
          const info = { owner_name: resp.data.owner_name || "N/A", phone_number: resp.data.phone_number || "N/A", email_id: resp.data.email_id || "N/A", location: resp.data.location || "N/A" };
          setDeviceInfo(info); setEditableInfo(info);
        }
      } catch (error) { const f = { owner_name: "N/A", phone_number: "N/A", email_id: "N/A", location: "N/A" }; setDeviceInfo(f); setEditableInfo(f); }
    };
    fetchDeviceInfo();
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${process.env.REACT_APP_EP}/api/devices`).then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(payload => { const list = Array.isArray(payload) ? payload : payload.value || []; const dev = list.find(d => String(d.id) === String(id)); if (!cancelled) setDeviceName(dev ? dev.displayName || dev.name || "N/A" : "N/A"); })
      .catch(() => { if (!cancelled) setDeviceName("Error"); });
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    const fetchInitialStatus = async () => {
      try {
        const statusRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/status`);
        if (!statusRes.ok) { setConn(false); setLoading(false); return; }
        const statusData = await statusRes.json();
        const isConnected = statusData.status === "Connected";
        setConn(isConnected);
        if (isConnected) {
          try {
            const telemetryRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`);
            if (telemetryRes.ok) {
              const data = await telemetryRes.json();
              setDeviceData({
                nbGenerator: { ...data.nbGenerator, pump_motor_frequency: data.nbGenerator?.pump_motor_frequency ?? 0, pump_motor_current: data.nbGenerator?.pump_motor_current ?? 0, total_running_hours: data.nbGenerator?.total_running_hours ?? 0, auto_sequence_on_time: data.nbGenerator?.auto_sequence_on_time ?? 0, auto_sequence_off_time: data.nbGenerator?.auto_sequence_off_time ?? 0, auto_sequence_counter: data.nbGenerator?.auto_sequence_counter ?? 0, auto_sequence_on_write: data.nbGenerator?.auto_sequence_on_write ?? 0, auto_sequence_off_write: data.nbGenerator?.auto_sequence_off_write ?? 0, auto_sequence_counter_write: data.nbGenerator?.auto_sequence_counter_write ?? 0, oxygen_flow: data.nbGenerator?.oxygen_flow ?? 0, spare_1: data.nbGenerator?.spare_1 ?? 0, alert_status: data.nbGenerator?.alert_status ?? 0 },
                ozoneGenerator: { ...data.ozoneGenerator }, oxygenGenerator: { ...data.oxygenGenerator },
              });
              const alertStatus = data.nbGenerator?.alert_status;
              setIsPowerOn(checkPowerStatusFromBit(alertStatus));
              setAutoMode(checkAutoModeFromBit(alertStatus));
            }
          } catch (e) { console.error("Telemetry fetch failed:", e); }
        }
      } catch (error) { console.error("Error:", error); setConn(false); }
      finally { setLoading(false); }
    };
    fetchInitialStatus();
    const safetyTimer = setTimeout(() => { setLoading(prev => { if (prev) return false; return prev; }); }, 8000);
    return () => clearTimeout(safetyTimer);
  }, [id]);

  useEffect(() => {
    if (!conn) return;
    const dataInterval = setInterval(() => { fetchDeviceData(); }, 5000);
    const historyInterval = setInterval(() => { fetchPowerStatusHistory(); }, 30000);
    return () => { clearInterval(dataInterval); clearInterval(historyInterval); };
  }, [conn, id, fetchDeviceData, fetchPowerStatusHistory]);

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
    if (typeof val === 'object' && val !== null) { const v = Number(val.value ?? val.Value ?? val.v ?? 0); return isFinite(v) ? v : 0; }
    if (typeof val === 'string') { let num = Number(val); if (isFinite(num)) return num; const match = val.match(/[-+]?[0-9]*\.?[0-9]+/); if (match) { num = parseFloat(match[0]); return isFinite(num) ? num : 0; } }
    return 0;
  };

  const parseVal = (v) => (parseFloat(typeof v === 'object' ? (v?.value ?? 0) : v) || 0).toFixed(2);

  // ==================== DATE HELPERS ====================
  const getDateKey = useCallback((date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }, []);

  const getStartOfDay = useCallback((date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const getEndOfDay = useCallback((date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }, []);

  // ==================== AGGREGATE DAILY POWER STATUS ====================
 const getDailyPowerSummary = useCallback(() => {
  const now = new Date();
  const DAYS_TO_SHOW = 20;

  const allDateKeys = [];
  for (let i = 0; i < DAYS_TO_SHOW; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    allDateKeys.push(getDateKey(d));
  }

  const dayMap = {};
  allDateKeys.forEach(dateKey => {
    dayMap[dateKey] = { date: dateKey, onMs: 0, offMs: 0, disconnectedMs: 0 };
  });

  const windowStart = getStartOfDay(
    new Date(now.getTime() - (DAYS_TO_SHOW - 1) * 24 * 60 * 60 * 1000)
  );

  if (
    (!powerStatusHistory || powerStatusHistory.length === 0) &&
    (!connectedIntervals || connectedIntervals.length === 0)
  ) {
    allDateKeys.forEach((dateKey, idx) => {
      const d = new Date(now);
      d.setDate(d.getDate() - idx);
      const dayStart = getStartOfDay(d);
      const dayEnd = idx === 0 ? now : getEndOfDay(d);
      dayMap[dateKey].disconnectedMs = dayEnd - dayStart;
    });
    return allDateKeys.map(key => dayMap[key]);
  }

  // Parse intervals - make COPIES so we don't mutate state
  const parsedIntervals = (connectedIntervals || [])
    .map(i => ({ start: new Date(i.start), end: new Date(i.end) }))
    .sort((a, b) => a.start - b.start);

  const sortedStatus = [...powerStatusHistory].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const getStatusAt = (time) => {
    let status = 'OFF';
    for (let i = sortedStatus.length - 1; i >= 0; i--) {
      if (new Date(sortedStatus[i].timestamp) <= time) {
        status = sortedStatus[i].status.toUpperCase() === 'ON' ? 'ON' : 'OFF';
        break;
      }
    }
    return status;
  };

  const segments = [];

  if (parsedIntervals.length > 0) {

    // ============================================================
    // KEY FIX: If device is currently connected, ALWAYS extend 
    // the last interval to NOW. No gap checks. No thresholds.
    // The frontend KNOWS conn=true from the status API.
    // ============================================================
    if (conn) {
      const lastInterval = parsedIntervals[parsedIntervals.length - 1];
      if (lastInterval.end < now) {
        lastInterval.end = new Date(now);
      }
    }

    let cursor = new Date(windowStart);

    for (const interval of parsedIntervals) {
      const intStart = interval.start < windowStart
        ? new Date(windowStart) : new Date(interval.start);
      const intEnd = interval.end > now
        ? new Date(now) : new Date(interval.end);

      if (intEnd < windowStart) continue;
      if (intStart > now) break;

      // Gap before = DISCONNECTED
      if (cursor < intStart) {
        segments.push({
          start: new Date(cursor),
          end: new Date(intStart),
          status: 'DISCONNECTED'
        });
      }

      // Find active status at interval start
      let activeStatus = getStatusAt(intStart);

      // Changes within this interval
      const changesInInterval = sortedStatus.filter(s => {
        const t = new Date(s.timestamp);
        return t > intStart && t <= intEnd;
      });

      let segCursor = new Date(intStart);

      for (const change of changesInInterval) {
        const changeTime = new Date(change.timestamp);
        if (changeTime > segCursor) {
          segments.push({
            start: new Date(segCursor),
            end: new Date(changeTime),
            status: activeStatus
          });
        }
        activeStatus = change.status.toUpperCase() === 'ON' ? 'ON' : 'OFF';
        segCursor = new Date(changeTime);
      }

      if (segCursor < intEnd) {
        segments.push({
          start: new Date(segCursor),
          end: new Date(intEnd),
          status: activeStatus
        });
      }

      cursor = new Date(intEnd);
    }

    // Anything after all intervals = DISCONNECTED
    if (cursor < now) {
      segments.push({
        start: new Date(cursor),
        end: now,
        status: 'DISCONNECTED'
      });
    }

  } else if (sortedStatus.length > 0) {
    // PATH B: No connected intervals, only status changes

    let initialStatus = null;
    for (let i = sortedStatus.length - 1; i >= 0; i--) {
      if (new Date(sortedStatus[i].timestamp) <= windowStart) {
        initialStatus = sortedStatus[i].status.toUpperCase() === 'ON'
          ? 'ON' : 'OFF';
        break;
      }
    }

    const changesInWindow = sortedStatus.filter(
      s => new Date(s.timestamp) > windowStart && new Date(s.timestamp) <= now
    );

    let cursor = new Date(windowStart);

    if (initialStatus !== null) {
      if (changesInWindow.length > 0) {
        const firstChange = new Date(changesInWindow[0].timestamp);
        segments.push({
          start: new Date(cursor),
          end: new Date(firstChange),
          status: initialStatus
        });
        cursor = new Date(firstChange);
      } else {
        segments.push({
          start: new Date(cursor),
          end: now,
          status: initialStatus
        });
        cursor = now;
      }
    } else if (changesInWindow.length > 0) {
      const firstChange = new Date(changesInWindow[0].timestamp);
      if (firstChange > windowStart) {
        segments.push({
          start: new Date(windowStart),
          end: new Date(firstChange),
          status: 'DISCONNECTED'
        });
      }
      cursor = new Date(firstChange);
    }

    for (let i = 0; i < changesInWindow.length; i++) {
      const changeTime = new Date(changesInWindow[i].timestamp);
      const status = changesInWindow[i].status.toUpperCase() === 'ON'
        ? 'ON' : 'OFF';
      const statusEnd = i < changesInWindow.length - 1
        ? new Date(changesInWindow[i + 1].timestamp)
        : now;

      if (changeTime >= cursor) {
        segments.push({
          start: new Date(changeTime),
          end: new Date(statusEnd),
          status: status
        });
        cursor = new Date(statusEnd);
      }
    }

    if (cursor < now) {
      const lastKnown = changesInWindow.length > 0
        ? (changesInWindow[changesInWindow.length - 1]
            .status.toUpperCase() === 'ON' ? 'ON' : 'OFF')
        : (initialStatus || 'DISCONNECTED');
      segments.push({
        start: new Date(cursor),
        end: now,
        status: conn ? lastKnown : 'DISCONNECTED'
      });
    }
  } else {
    segments.push({
      start: new Date(windowStart),
      end: now,
      status: 'DISCONNECTED'
    });
  }

  // Distribute across days
  for (const seg of segments) {
    let cur = new Date(seg.start);
    const segEnd = new Date(seg.end);

    if (segEnd < windowStart) continue;
    if (cur < windowStart) cur = new Date(windowStart);

    while (cur < segEnd) {
      const dateKey = getDateKey(cur);
      if (!dayMap[dateKey]) {
        const nextDay = new Date(cur);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        cur = nextDay;
        continue;
      }

      const endOfThisDay = getEndOfDay(cur);
      const finalEnd = segEnd <= endOfThisDay
        ? segEnd
        : new Date(endOfThisDay.getTime() + 1);
      const durationMs = finalEnd - cur;

      if (durationMs > 0) {
        if (seg.status === 'ON') dayMap[dateKey].onMs += durationMs;
        else if (seg.status === 'OFF') dayMap[dateKey].offMs += durationMs;
        else dayMap[dateKey].disconnectedMs += durationMs;
      }

      const nextDay = new Date(cur);
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      cur = nextDay;
    }
  }

  allDateKeys.forEach((dateKey, idx) => {
    const day = dayMap[dateKey];
    if (day.onMs === 0 && day.offMs === 0 && day.disconnectedMs === 0) {
      const d = new Date(now);
      d.setDate(d.getDate() - idx);
      const dayStart = getStartOfDay(d);
      const dayEnd = idx === 0 ? now : getEndOfDay(d);
      day.disconnectedMs = Math.max(0, dayEnd - dayStart);
    }
  });

  return allDateKeys.map(key => dayMap[key]);
}, [powerStatusHistory, connectedIntervals, conn, getDateKey, getStartOfDay, getEndOfDay]);

  const formatDuration = (ms) => {
    if (!ms || ms <= 0) return '0m';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const dailySummary = getDailyPowerSummary();

  return (
    <>
      <div className="device-details-banner">
        <div className="device-details-header">
          <h2 className="device-details-title">
            <span className="device-name">{deviceName}</span> || <span className="device-name">{id}</span>
          </h2>
          <div className="device-details-status">
            <span className="device-connection-status">
              <FontAwesomeIcon icon={faLink} className={`status-icon ${conn ? "green" : "red"}`} />
              {conn ? "Connected" : "Disconnected"}
            </span>
            <span className={`connection-badge ${isPowerOn ? "on" : "off"}`}>{isPowerOn ? "ON" : "OFF"}</span>
            <span className={`connection-label ${isPowerOn ? "green" : "red"}`}>{isPowerOn ? "Power ON" : "Power OFF"}</span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-backdrop">
          <div className="loading-spinner"></div>
          <div className="loading-text">Waiting for device...</div>
        </div>
      )}

      {!loading && (
        <div className="device-detail-container unified-layout">

          {/* ====== SECTION: Device Basic Information ====== */}
          <div className="unified-section">
            <div className="device-info-header">
              <h3 className="section-title">Device Basic Information:</h3>
              {/* Only Master Admin and Company Admin can edit device info */}
              {canEditDeviceInfo(userRole) && (
                <button className="editt-btn" onClick={handleEditToggle}>
                  <FontAwesomeIcon icon={isEditMode ? faSave : faPencil} />
                  {isEditMode ? "Save" : "Edit"}
                </button>
              )}
            </div>
            {/* rest of device info grid unchanged */}
            <div className="device-info-grid">
              <p><strong>Device Name:</strong> {deviceName}</p>
              <p className={isEditMode && canEditDeviceInfo(userRole) ? "editable-field-container" : ""}>
                <strong>Owner Name:</strong>
                {isEditMode && canEditDeviceInfo(userRole)
                  ? <input type="text" value={editableInfo.owner_name} onChange={(e) => handleInputChange("owner_name", e.target.value)} className="inline-edit-input" />
                  : <span>{deviceInfo.owner_name}</span>}
              </p>
              <p className={isEditMode && canEditDeviceInfo(userRole) ? "editable-field-container" : ""}>
                <strong>Owner Phone:</strong>
                {isEditMode && canEditDeviceInfo(userRole)
                  ? <input type="tel" value={editableInfo.phone_number} onChange={(e) => handleInputChange("phone_number", e.target.value)} className="inline-edit-input" />
                  : <span>{deviceInfo.phone_number}</span>}
              </p>
              <p><strong>Device ID:</strong> {id}</p>
              <p className={isEditMode && canEditDeviceInfo(userRole) ? "editable-field-container" : ""}>
                <strong>Owner Email ID:</strong>
                {isEditMode && canEditDeviceInfo(userRole)
                  ? <input type="email" value={editableInfo.email_id} onChange={(e) => handleInputChange("email_id", e.target.value)} className="inline-edit-input" />
                  : <span>{deviceInfo.email_id}</span>}
              </p>
              <p className={isEditMode && canEditDeviceInfo(userRole) ? "editable-field-container" : ""}>
                <strong>Device Sector:</strong>
                {isEditMode && canEditDeviceInfo(userRole)
                  ? <input type="text" value={editableInfo.location} onChange={(e) => handleInputChange("location", e.target.value)} className="inline-edit-input" />
                  : <span>{deviceInfo.location}</span>}
              </p>
            </div>
          </div>

          <hr className="section-divider" />

          {/* ====== SECTION: Device Connection Status and Power ====== */}
          <div className="unified-section">
            <div className="device-info-header">
              <h3 className="section-title">Device Power Status:</h3>
            </div>

            <div className="power-status-layout">
              <div className="power-status-left">
                <div className="device-connection-grid">
                  {/* <p><strong>Connection Status:</strong> {conn ? "Connected" : "Disconnected"}</p> */}
                  

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

                  <p><strong>Last Updated:</strong> {
                    powerStatusHistory.length > 0
                      ? new Date(powerStatusHistory[0].timestamp).toLocaleString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit', second: '2-digit'
                        })
                      : 'N/A'
                  }</p>


                </div>
              </div>

              <div className="power-status-right">
                <h4 className="status-history-title">Power Status History (Last 20 Days):</h4>
                {loadingHistory ? (
                  <div className="status-history-loading">Loading history...</div>
                ) : dailySummary.length === 0 ? (
                  <div className="status-history-empty">No status history available</div>
                ) : (
                  <div className="status-history-table-container">
                    <table className="status-history-table daily-summary-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dailySummary.map((day, index) => (
                          <tr key={day.date} className={index === 0 ? 'current-status' : ''}>
                            <td className="daily-date-cell">{day.date}</td>
                            <td className="daily-status-cell">
                              <div className="daily-status-stack">
                                <span className="status-badge on">ON</span>
                                <span className="status-badge off">OFF</span>
                                <span className="status-badge disconnected">DISC</span>
                              </div>
                            </td>
                            <td className="daily-duration-cell">
                              <div className="daily-duration-stack">
                                <span className="duration-on">{formatDuration(day.onMs)}</span>
                                <span className="duration-off">{formatDuration(day.offMs)}</span>
                                <span className="duration-disconnected">{formatDuration(day.disconnectedMs)}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          </div>

          <hr className="section-divider" />

          {/* ====== SECTION: Device Configuration & Alerts ====== */}
          <div className="unified-section">
            <div className="device-config-container">

              {/* ====== GAUGES + VALUE CARDS ====== */}
              <div className="config-gauge-row">
                <div className="config-gauge-header">
                  <div className="config-gauge-title-wrapper">
                  <h4 className="config-gauge-title">Process Parameters</h4>
                  {canEditLabels(userRole) && hasCustomizations() && (
                    <button className="reset-all-labels-btn" onClick={handleResetAll} title="Reset all custom names and gauge settings to defaults">
                      <FontAwesomeIcon icon={faRotateLeft} /> Reset All Names
                    </button>
                  )}
                </div>
                  <div className="config-gauge-header-right">
                    <div className="config-gauge-live-badge">
                      <span className="config-gauge-live-dot"></span>LIVE
                    </div>
                    <button className="view-logs-btn" onClick={() => navigate(`/device/${id}/logdetails`)}>View All Sensor Logs</button>
                  </div>
                </div>

                {/* Gauge Row 1 */}
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
                    onSaveMax={canEditGaugeMax(userRole) ? handleSaveGaugeMax : null}
                    onResetMax={canEditGaugeMax(userRole) ? handleResetGaugeMax : null}
                    deviceId={canEditLabels(userRole) ? id : null}
                    labelKey={config.labelKey}
                    onSaveLabel={canEditLabels(userRole) ? handleSaveLabel : null}
                    onResetLabel={canEditLabels(userRole) ? handleResetLabel : null}
                  />
                ))}
              </div>

              {/* Gauge Row 2 */}
              <div className="config-gauges-grid">
                {GAUGE_CONFIGS_ROW2.map((config) => (
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
                    onSaveMax={canEditGaugeMax(userRole) ? handleSaveGaugeMax : null}
                    onResetMax={canEditGaugeMax(userRole) ? handleResetGaugeMax : null}
                    deviceId={canEditLabels(userRole) ? id : null}
                    labelKey={config.labelKey}
                    onSaveLabel={canEditLabels(userRole) ? handleSaveLabel : null}
                    onResetLabel={canEditLabels(userRole) ? handleResetLabel : null}
                  />
                ))}

                {/* Total Running Hours — label editable only for role 0,1 */}
                <div className="gauge-card value-only-card" style={{ '--gauge-color': '#f59e0b', '--gauge-glow': '#fbbf24' }}>
                  <div className="gauge-card-accent" style={{ background: 'linear-gradient(90deg, #f59e0b00, #f59e0b, #f59e0b00)' }} />
                  <div className="gauge-card-header">
                    <div className="gauge-icon-wrapper" style={{ background: 'rgba(245,158,11,0.08)', borderColor: '#f59e0b30' }}>
                      <span className="gauge-icon">⏱️</span>
                    </div>
                    <span className="gauge-label">
                      {canEditLabels(userRole) ? (
                        <EditableLabel deviceId={id} attributeKey="total_running_hours" onSave={handleSaveLabel} onReset={handleResetLabel} />
                      ) : (
                        getLabel('total_running_hours')
                      )}
                    </span>
                  </div>
                  <div className="value-only-display">
                    <span className="value-only-number" style={{ color: '#f59e0b' }}>
                      {parseVal(deviceData.nbGenerator.total_running_hours)}
                    </span>
                    <span className="value-only-unit">Hours</span>
                  </div>
                </div>

                {/* Total Water Outlet — label editable only for role 0,1 */}
                <div className="gauge-card value-only-card" style={{ '--gauge-color': '#3b82f6', '--gauge-glow': '#60a5fa' }}>
                  <div className="gauge-card-accent" style={{ background: 'linear-gradient(90deg, #3b82f600, #3b82f6, #3b82f600)' }} />
                  <div className="gauge-card-header">
                    <div className="gauge-icon-wrapper" style={{ background: 'rgba(59,130,246,0.08)', borderColor: '#3b82f630' }}>
                      <span className="gauge-icon">🚿</span>
                    </div>
                    <span className="gauge-label">
                      {canEditLabels(userRole) ? (
                        <EditableLabel deviceId={id} attributeKey="total_water_outlet" onSave={handleSaveLabel} onReset={handleResetLabel} />
                      ) : (
                        getLabel('total_water_outlet')
                      )}
                    </span>
                  </div>
                  <div className="value-only-display">
                    <span className="value-only-number" style={{ color: '#3b82f6' }}>
                      {deviceData.nbGenerator.totalWaterOutlet || 0}
                    </span>
                    <span className="value-only-unit">Litres</span>
                  </div>
                </div>
              </div>

              </div>

              {/* ====== SETTINGS SECTION ====== */}
              <div className="settings-section">
                <div className="settings-section-header">
                  <div className="settings-title-wrapper">
                    <h4 className="settings-title">Settings</h4>
                  </div>
                </div>

                <div className="settings-content">
                  {/* Auto Mode — hidden for Operator (role 3) */}
                  {canToggleAutoMode(userRole) && (
                    <div className="settings-single-row">
                      <div className="config-item">
                        <label>
                          {canEditLabels(userRole) ? (
                            <EditableLabel deviceId={id} attributeKey="auto_mode" onSave={handleSaveLabel} onReset={handleResetLabel} />
                          ) : (
                            getLabel('auto_mode')
                          )}:
                        </label>
                        <div className="auto-mode-toggle-container">
                          <span className={`auto-mode-status ${autoMode ? 'on' : 'off'}`}>
                            {autoWaiting ? 'Switching...' : (autoMode ? 'ON' : 'OFF')}
                          </span>
                          <label className={`auto-mode-switch ${autoWaiting ? "auto-mode-waiting" : ""}`}>
                            <input
                              type="checkbox"
                              checked={autoMode}
                              onChange={() => !autoWaiting && handleAutoModeToggle()}
                              disabled={autoWaiting || !conn}
                            />
                            <span className="auto-mode-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}  

                  {/* Settings Column Headings */}
                  <div className="settings-headings-row">
                  <div className="settings-heading-label"></div>
                  <div className="settings-heading-values">
                    <span className="config-heading">Actual</span>
                    <span className="config-heading">Set Value</span>
                    {canWriteRegisters(userRole) && (
                      <span className="config-heading">Set New Value</span>
                    )}
                    {canWriteRegisters(userRole) && (
                      <span className="config-heading-spacer"></span>
                    )}
                  </div>
                </div>
                  
                  {/* Auto Sequence Counter */}
                    {canToggleAutoMode(userRole) && (
                      <div className="settings-single-row">
                        <div className="config-item settings-full-item">
                          <label>
                            {canEditLabels(userRole) ? (
                              <EditableLabel deviceId={id} attributeKey="auto_sequence_counter" onSave={handleSaveLabel} onReset={handleResetLabel} />
                            ) : (
                              getLabel('auto_sequence_counter')
                            )}:
                          </label>
                          <div className="editable-field">
                            <input type="number" value={deviceData.nbGenerator.auto_sequence_counter ?? 0} disabled className="config-input" />
                            <input type="number" value={deviceData.nbGenerator.auto_sequence_counter_write ?? 0} disabled className="config-input" />
                            {canWriteRegisters(userRole) && (
                              <>
                                <input
                                  type="number"
                                  value={counter}
                                  onChange={(e) => setCounter(e.target.value)}
                                  placeholder="Enter value"
                                  className="config-input editing"
                                  disabled={isWriting.counter}
                                  min="0"
                                  max="65535"
                                />
                                <button
                                  className={`editt-btn ${writeSuccess.counter ? 'success-btn' : ''}`}
                                  onClick={handleCounterClick}
                                  disabled={!conn || isWriting.counter || !counter}
                                >
                                  {isWriting.counter
                                    ? <span className="spinner">⟳</span>
                                    : <FontAwesomeIcon icon={writeSuccess.counter ? faCheck : faCircleCheck} />
                                  }
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Auto Sequence Off Time */}
                    {canToggleAutoMode(userRole) && (
                      <div className="settings-single-row">
                        <div className="config-item settings-full-item">
                          <label>
                            {canEditLabels(userRole) ? (
                              <EditableLabel deviceId={id} attributeKey="auto_sequence_off_time" onSave={handleSaveLabel} onReset={handleResetLabel} />
                            ) : (
                              getLabel('auto_sequence_off_time')
                            )}:
                          </label>
                          <div className="editable-field">
                            <input type="number" value={deviceData.nbGenerator.auto_sequence_off_time ?? 0} disabled className="config-input" />
                            <input type="number" value={deviceData.nbGenerator.auto_sequence_off_write ?? 0} disabled className="config-input" />
                            {canWriteRegisters(userRole) && (
                              <>
                                <input
                                  type="number"
                                  value={offTime}
                                  onChange={(e) => setOffTime(e.target.value)}
                                  placeholder="Enter value"
                                  className="config-input editing"
                                  disabled={isWriting.offTime}
                                  min="0"
                                  max="65535"
                                />
                                <button
                                  className={`editt-btn ${writeSuccess.offTime ? 'success-btn' : ''}`}
                                  onClick={handleOffTimeClick}
                                  disabled={!conn || isWriting.offTime || !offTime}
                                >
                                  {isWriting.offTime
                                    ? <span className="spinner">⟳</span>
                                    : <FontAwesomeIcon icon={writeSuccess.offTime ? faCheck : faCircleCheck} />
                                  }
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Auto Sequence On Time */}
                    {canToggleAutoMode(userRole) && (
                      <div className="settings-single-row">
                        <div className="config-item settings-full-item">
                          <label>
                            {canEditLabels(userRole) ? (
                              <EditableLabel deviceId={id} attributeKey="auto_sequence_on_time" onSave={handleSaveLabel} onReset={handleResetLabel} />
                            ) : (
                              getLabel('auto_sequence_on_time')
                            )}:
                          </label>
                          <div className="editable-field">
                            <input type="number" value={deviceData.nbGenerator.auto_sequence_on_time ?? 0} disabled className="config-input" />
                            <input type="number" value={deviceData.nbGenerator.auto_sequence_on_write ?? 0} disabled className="config-input" />
                            {canWriteRegisters(userRole) && (
                              <>
                                <input
                                  type="number"
                                  value={onTime}
                                  onChange={(e) => setOnTime(e.target.value)}
                                  placeholder="Enter value"
                                  className="config-input editing"
                                  disabled={isWriting.onTime}
                                  min="0"
                                  max="65535"
                                />
                                <button
                                  className={`editt-btn ${writeSuccess.onTime ? 'success-btn' : ''}`}
                                  onClick={handleOnTimeClick}
                                  disabled={!conn || isWriting.onTime || !onTime}
                                >
                                  {isWriting.onTime
                                    ? <span className="spinner">⟳</span>
                                    : <FontAwesomeIcon icon={writeSuccess.onTime ? faCheck : faCircleCheck} />
                                  }
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                </div>
              </div>
            </div>
          </div>

          {/* ====== SECTION: Charts ====== */}
          <div className="unified-section">
            <DeviceCharts deviceId={id} />
          </div>

          <hr className="section-divider" />

          {/* ====== SECTION: Device Alert and Info History ====== */}
          <div className="unified-section">
            <h3 className="section-title">Digital I/O Feedback Status:</h3>
            <div className="alert-grid-wrapper">
              <div className="alert-grid">
                {(() => {
                  const alertStatus = deviceData.nbGenerator.alert_status || 0;
                  return ALERT_BIT_KEYS.map((key, index) => {
                    const bitValue = (alertStatus >> index) & 1;
                    return (
                      <div key={key} className={`alert-item ${bitValue === 1 ? 'alert-on' : 'alert-off'}`}>
                        <div className="alert-label">
                          <EditableLabel deviceId={id} attributeKey={key} onSave={handleSaveLabel} onReset={handleResetLabel} />
                        </div>
                        <div className={`alert-value ${bitValue === 1 ? 'value-on' : 'value-off'}`}>{bitValue === 1 ? 'ON' : 'OFF'}</div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default DeviceDetails;