import React, { useState } from 'react';
import MigoMonitoringPage from './MigoMonitoringPage';
import MonitoringProvinsiPage from './MonitoringProvinsiPage';

export default function MonitoringPage() {
  const [activeMonitoring, setActiveMonitoring] = useState('pusat');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>

      {/* TOGGLE */}
      <div style={{
        padding: '24px 30px 0',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          backgroundColor: '#e9eef3',
          borderRadius: '10px',
          padding: '4px',
          gap: '4px'
        }}>

          <button
            onClick={() => setActiveMonitoring('pusat')}
            style={toggleStyle(activeMonitoring === 'pusat')}
          >
            Dari Pusat
          </button>

          <button
            onClick={() => setActiveMonitoring('provinsi')}
            style={toggleStyle(activeMonitoring === 'provinsi')}
          >
            Provinsi Kalteng
          </button>

        </div>
      </div>

      {/* ISI MONITORING */}
      {activeMonitoring === 'pusat'
        ? <MigoMonitoringPage />
        : <MonitoringProvinsiPage />
      }

    </div>
  );
}

const toggleStyle = (active) => ({
  border: 'none',
  padding: '10px 22px',
  borderRadius: '7px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px',

  backgroundColor: active
    ? '#ffffff'
    : 'transparent',

  color: active
    ? '#1f6f8b'
    : '#6b7280',

  boxShadow: active
    ? '0 2px 6px rgba(0,0,0,0.08)'
    : 'none'
});