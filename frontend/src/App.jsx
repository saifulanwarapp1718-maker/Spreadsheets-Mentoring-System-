import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';

import MigoBapPage from './pages/MigoBapPage';
import MigoMonitoringPage from './pages/MigoMonitoringPage';

// HALAMAN BARU PROVINSI KALTENG
import MonitoringProvinsiPage from './pages/MonitoringProvinsiPage';
import PerangkatProvinsiPage from './pages/PerangkatProvinsiPage';

import {
  FiFileText,
  FiUsers,
  FiLogOut
} from 'react-icons/fi';

import logoIconnet from './assets/logo-iconnet.png';


export default function App() {

  // ============================
  // SESSION LOGIN
  // ============================

  const [user, setUser] = useState(() => {

    const savedUser =
      localStorage.getItem(
        'migoUserSession'
      );

    return savedUser
      ? JSON.parse(savedUser)
      : null;

  });


  // ============================
  // SUMBER DATA GLOBAL
  // ============================

  const [dataSource, setDataSource] =
    useState(() => {

      return (
        localStorage.getItem(
          'dataSource'
        ) || 'pusat'
      );

    });


  const handleSourceChange = (
    source
  ) => {

    setDataSource(source);

    localStorage.setItem(
      'dataSource',
      source
    );

  };


  // ============================
  // LOGIN
  // ============================

  const handleLoginSuccess = (
    userData
  ) => {

    localStorage.setItem(
      'migoUserSession',
      JSON.stringify(userData)
    );

    setUser(userData);

  };


  // ============================
  // LOGOUT
  // ============================

  const handleLogout = () => {

    localStorage.removeItem(
      'migoUserSession'
    );

    setUser(null);

  };


  return (
    <>

      {!user ? (

        <LoginPage
          onLoginSuccess={
            handleLoginSuccess
          }
        />

      ) : (

        <Router>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              fontFamily:
                'Arial, sans-serif'
            }}
          >

            {/* =====================
                NAVBAR
            ====================== */}

            <nav
              style={{
                backgroundColor:
                  '#ffffff',

                padding:
                  '12px 24px',

                display: 'flex',

                gap: '12px',

                alignItems:
                  'center',

                boxShadow:
                  '0 2px 8px rgba(0,0,0,0.06)',

                borderBottom:
                  '1px solid #e5e7eb',

                position:
                  'sticky',

                top: 0,

                zIndex: 1000
              }}
            >


              {/* LOGO */}

              <div
                style={{
                  marginRight:
                    'auto',

                  display:
                    'flex',

                  alignItems:
                    'center'
                }}
              >

                <img
                  src={
                    logoIconnet
                  }

                  alt="Logo ICONNET"

                  style={{
                    height:
                      '38px',

                    objectFit:
                      'contain'
                  }}
                />

              </div>


              {/* =====================
                  TOGGLE GLOBAL
              ====================== */}

              <div
                style={{
                  display:
                    'flex',

                  backgroundColor:
                    '#f3f4f6',

                  borderRadius:
                    '7px',

                  padding:
                    '3px',

                  border:
                    '1px solid #e5e7eb'
                }}
              >

                <button
                  onClick={() =>
                    handleSourceChange(
                      'pusat'
                    )
                  }

                  style={
                    toggleButtonStyle(
                      dataSource ===
                        'pusat'
                    )
                  }
                >
                  ITEMS
                </button>


                <button
                  onClick={() =>
                    handleSourceChange(
                      'provinsi'
                    )
                  }

                  style={
                    toggleButtonStyle(
                      dataSource ===
                        'provinsi'
                    )
                  }
                >
                 Kalselteng
                </button>

              </div>


              {/* =====================
                  MENU BASTP
              ====================== */}

              <NavLink
                to="/"
                end
                style={navLinkStyle}
              >
                <FiFileText
                  size={17}
                  style={{ marginRight: '5px' }}
                />

                {dataSource === 'pusat'
                  ? 'Cari & Tambah BASTP'
                  : 'Cari & Tambah Perangkat'
                }
              </NavLink>


              {/* =====================
                  MONITORING
              ====================== */}

              <NavLink
                to="/monitoring"
                style={navLinkStyle}
              >
                <FiUsers
                  size={17}
                  style={{ marginRight: '5px' }}
                />

                Monitoring
              </NavLink>


              {/* =====================
                  ADMIN
              ====================== */}

              <div
                style={{
                  marginLeft:
                    '10px',

                  display:
                    'flex',

                  alignItems:
                    'center',

                  gap:
                    '15px',

                  borderLeft:
                    '1px solid #e5e7eb',

                  paddingLeft:
                    '16px'
                }}
              >

                <div>

                  <span
                    style={{
                      fontSize:
                        '13px',

                      fontWeight:
                        '600',

                      color:
                        '#374151',

                      display:
                        'block'
                    }}
                  >

                    {user.username}

                  </span>


                  <span
                    style={{
                      fontSize:
                        '11px',

                      color:
                        '#9ca3af'
                    }}
                  >

                    Administrator

                  </span>

                </div>


                <button
                  onClick={
                    handleLogout
                  }

                  style={
                    logoutButtonStyle
                  }
                >

                  <FiLogOut
                    size={15}

                    style={{
                      marginRight:
                        '5px'
                    }}
                  />

                  Logout

                </button>

              </div>

            </nav>


            {/* =====================
                CONTENT
            ====================== */}

            <div
              style={{
                flex: 1,
                backgroundColor:
                  '#f9fafb'
              }}
            >

              <Routes>


                {/* ===================
                    CARI & TAMBAH
                ==================== */}

                <Route
                  path="/"

                  element={
                    dataSource ===
                    'pusat'
                      ? (
                        <MigoBapPage />
                      )
                      : (
                        <PerangkatProvinsiPage />
                      )
                  }
                />


                {/* ===================
                    MONITORING
                ==================== */}

                <Route
                  path="/monitoring"

                  element={
                    dataSource ===
                    'pusat'
                      ? (
                        <MigoMonitoringPage />
                      )
                      : (
                        <MonitoringProvinsiPage />
                      )
                  }
                />


                {/* FALLBACK */}

                <Route
                  path="*"

                  element={
                    <Navigate
                      to="/"
                      replace
                    />
                  }
                />

              </Routes>

            </div>

          </div>

        </Router>

      )}

    </>
  );
}


// ===================================
// STYLE NAVBAR
// ===================================

const navLinkStyle = ({ isActive }) => ({
  color: isActive
    ? '#1d4ed8'
    : '#4b5563',

  textDecoration: 'none',

  fontSize: '14px',

  fontWeight: '600',

  padding: '9px 12px',

  display: 'flex',

  alignItems: 'center',

  borderRadius: '6px',

  backgroundColor: isActive
    ? '#eff6ff'
    : 'transparent',

  borderBottom: isActive
    ? '3px solid #2563eb'
    : '3px solid transparent',

  transition: '0.2s'
});


const logoutButtonStyle = {

  backgroundColor:
    '#fee2e2',

  color:
    '#dc2626',

  border:
    '1px solid #fca5a5',

  padding:
    '8px 14px',

  borderRadius:
    '6px',

  cursor:
    'pointer',

  fontWeight:
    'bold',

  display:
    'flex',

  alignItems:
    'center'

};


// ===================================
// STYLE TOGGLE
// ===================================

const toggleButtonStyle = (
  active
) => ({

  border:
    'none',

  padding:
    '7px 12px',

  borderRadius:
    '5px',

  cursor:
    'pointer',

  fontSize:
    '12px',

  fontWeight:
    '600',

  transition:
    '0.2s',

  backgroundColor:
    active
      ? '#2563eb'
      : 'transparent',

  color:
    active
      ? '#ffffff'
      : '#6b7280'

});