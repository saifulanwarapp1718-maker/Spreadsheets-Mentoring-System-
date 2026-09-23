import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import BASE_URL from '../utils/api';

const ROWS_PER_PAGE = 15;

export default function MonitoringProvinsiPage() {

  const [data, setData] = useState(null);

  // loading pertama kali
  const [loading, setLoading] = useState(true);

  // khusus tombol refresh
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState('');

  // FILTER
  const [up3Filter, setUp3Filter] = useState('ALL');
  const [jenisFilter, setJenisFilter] = useState('ALL');
  const [merkFilter, setMerkFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // PAGINATION
  const [page, setPage] = useState(1);
  const [detailModal, setDetailModal] = useState(null);
  const [detailSearch, setDetailSearch] = useState('');
  const [detailPage, setDetailPage] = useState(1);
  const DETAIL_PER_PAGE = 10;

  // =========================
  // AMBIL DATA
  // =========================

  const fetchData = async (refresh = false) => {

    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');

    try {

      const response = await fetch(
        `${BASE_URL}/api/monitoring/provinsi`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Gagal mengambil data.'
        );
      }

      setData(result);

    } catch (err) {

      setError(
        err.message ||
        'Gagal terhubung ke backend.'
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  useEffect(() => {
    fetchData();
  }, []);


  // =========================
  // DATA PERANGKAT
  // =========================

  const devices = data?.devices || [];


  // =========================
  // FILTER DATA
  // =========================

  const filteredDevices = useMemo(() => {

    const keyword = search
      .trim()
      .toLowerCase();

    return devices.filter(device => {

      const cocokUP3 =
        up3Filter === 'ALL' ||
        device.up3 === up3Filter;


      const cocokJenis =
        jenisFilter === 'ALL' ||
        device.jenis === jenisFilter;

      const cocokMerk =
       merkFilter === 'ALL' ||
       device.merk === merkFilter;

      const text = [
        device.serialNumber,
        device.noPA,
        device.unit,
        device.area,
        device.model,
        device.up3,
        device.jenis
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();


      const cocokSearch =
        keyword === '' ||
        text.includes(keyword);


      return (
        cocokUP3 &&
        cocokJenis &&
        cocokMerk &&
        cocokSearch
      );
    });

  }, [
    devices,
    up3Filter,
    jenisFilter,
    merkFilter,
    search
  ]);


  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredDevices.length /
      ROWS_PER_PAGE
    )
  );


  const currentPage = Math.min(
    page,
    totalPages
  );


  const startIndex =
    (currentPage - 1) *
    ROWS_PER_PAGE;


  const currentDevices =
    filteredDevices.slice(
      startIndex,
      startIndex + ROWS_PER_PAGE
    );


  // =========================
  // LOADING AWAL
  // =========================

  if (loading && !data) {

    return (
      <div style={{
        padding: '50px',
        textAlign: 'center'
      }}>

        <h3>
          🔄 Memuat Monitoring Provinsi Kalselteng...
        </h3>

        <p>
          Mengambil data dari Google Spreadsheet.
        </p>

      </div>
    );
  }


  // =========================
  // ERROR AWAL
  // =========================

  if (!data && error) {

    return (
      <div style={{
        padding: '50px',
        textAlign: 'center',
        color: '#c0392b'
      }}>

        <h3>
          ❌ Data gagal dimuat
        </h3>

        <p>
          {error}
        </p>

        <button
          onClick={() => fetchData()}
          style={buttonStyle}
        >
          Coba Lagi
        </button>

      </div>
    );
  }


  const summary =
    data?.summary || {};

  const byUP3 =
  data?.byUP3 || {};

  const byJenis =
  data?.byJenis || [];

  const byMerk =
  data?.byMerk || [];

  const byModel =
  data?.byModel || [];


// ==============================
// PIE CHART
// ==============================

    const PieChart = ({
      data,
      title
    }) => {

      const total = data.reduce(
        (sum, item) => sum + Number(item.value || 0),
        0
      );

      if (!total) {
        return (
          <div style={panelStyle}>
            <h3 style={titleStyle}>
              {title}
            </h3>

            <p style={{
              color: '#7f8c8d',
              textAlign: 'center'
            }}>
              Tidak ada data.
            </p>
          </div>
        );
      }


      const colors = [
        '#3498db',
        '#e67e22',
        '#2ecc71',
        '#9b59b6',
        '#e74c3c',
        '#1abc9c',
        '#f1c40f',
        '#34495e'
      ];


      let currentPercent = 0;

      const gradient = data
        .map((item, index) => {

          const percent =
            (Number(item.value) / total) * 100;

          const start =
            currentPercent;

          const end =
            currentPercent + percent;

          currentPercent = end;

          return `${colors[index % colors.length]} ${start}% ${end}%`;

        })
        .join(', ');


      return (
        <div style={panelStyle}>

          <h3 style={titleStyle}>
            {title}
          </h3>


          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '30px',
            flexWrap: 'wrap',
            padding: '15px 0'
          }}>

            {/* PIE */}

            <div style={{
              width: '190px',
              height: '190px',
              borderRadius: '50%',
              background:
                `conic-gradient(${gradient})`,
              position: 'relative',
              flexShrink: 0
            }}>

              {/* LUBANG TENGAH */}

              <div style={{
                position: 'absolute',
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: '#ffffff',
                top: '50%',
                left: '50%',
                transform:
                  'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>

                <strong style={{
                  fontSize: '24px',
                  color: '#2c3e50'
                }}>
                  {total}
                </strong>

                <span style={{
                  fontSize: '11px',
                  color: '#7f8c8d'
                }}>
                  Total
                </span>

              </div>

            </div>


            {/* LEGEND */}

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              minWidth: '170px'
            }}>

              {data.map((item, index) => {

                const percent =
                  (
                    Number(item.value) /
                    total
                  ) * 100;


                return (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >

                    <span style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '3px',
                      background:
                        colors[
                          index %
                          colors.length
                        ],
                      display: 'inline-block',
                      flexShrink: 0
                    }} />

                    <span style={{
                      fontSize: '13px',
                      color: '#2c3e50'
                    }}>
                      {item.label}
                    </span>

                    <strong style={{
                      marginLeft: 'auto',
                      fontSize: '13px'
                    }}>
                      {item.value}
                    </strong>

                    <span style={{
                      fontSize: '11px',
                      color: '#7f8c8d',
                      minWidth: '42px'
                    }}>
                      ({percent.toFixed(1)}%)
                    </span>

                  </div>
                );

              })}

            </div>

          </div>

        </div>
      );
    };


// ==============================
// DETAIL MODAL SERIAL NUMBER
// ==============================

const openDetailModal = ({
  title,
  subtitle,
  devices
}) => {

  setDetailModal({
    title,
    subtitle,
    devices
  });

  setDetailSearch('');
  setDetailPage(1);
};


const closeDetailModal = () => {

  setDetailModal(null);
  setDetailSearch('');
  setDetailPage(1);

};


const detailDevices =
  detailModal?.devices || [];


const filteredDetailDevices =
  detailDevices.filter(device => {

    const keyword =
      detailSearch
        .trim()
        .toLowerCase();

    if (!keyword) {
      return true;
    }

    return (
      device.serialNumber || ''
    )
      .toLowerCase()
      .includes(keyword);

  });


const detailTotalPages =
  Math.max(
    1,
    Math.ceil(
      filteredDetailDevices.length /
      DETAIL_PER_PAGE
    )
  );


const currentDetailPage =
  Math.min(
    detailPage,
    detailTotalPages
  );


const detailStart =
  (currentDetailPage - 1) *
  DETAIL_PER_PAGE;


const paginatedDetailDevices =
  filteredDetailDevices.slice(
    detailStart,
    detailStart +
    DETAIL_PER_PAGE
  );

  // ==============================
// DATA PIE CHART
// ==============================

const jenisChartData =
  byJenis.map(item => ({
    label: item.jenis,
    value: item.total
  }));


const up3ChartData =
  Object.entries(byUP3).map(
    ([name, item]) => ({
      label: name,
      value: item.total
    })
  );

  return (

    <div style={{
      padding: '25px 30px 40px',
      fontFamily: 'Arial, sans-serif'
    }}>


      {/* =========================
          HEADER
      ========================== */}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        paddingBottom: '15px',
        borderBottom: '3px solid #34495e'
      }}>

        <div>

          <h2 style={{
            margin: 0,
            color: '#2c3e50'
          }}>
            Monitoring Perangkat Provinsi Kalselteng
          </h2>

          <p style={{
            margin: '6px 0 0',
            color: '#7f8c8d',
            fontSize: '14px'
          }}>
            Data perangkat UP3 Palangka,
            Kapuas dan Pangkalan Bun.
          </p>

        </div>


        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          style={{
            ...buttonStyle,

            backgroundColor:
              refreshing
                ? '#82e0aa'
                : '#27ae60',

            cursor:
              refreshing
                ? 'not-allowed'
                : 'pointer'
          }}
        >

          {refreshing
            ? '⏳ Memperbarui...'
            : '🔄 Refresh Data'
          }

        </button>

      </div>


      {/* ERROR REFRESH
          DATA LAMA TETAP TAMPIL */}

      {error && (

        <div style={{
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>

          ⚠️ Refresh gagal: {error}

        </div>

      )}


      {/* =========================
          SUMMARY CARD
      ========================== */}

{/* =========================
    VISUAL STATISTIK
========================== */}

<div style={{
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit, minmax(420px, 1fr))',
  gap: '20px',
  marginBottom: '25px'
}}>

  <PieChart
    title="Komposisi Jenis Perangkat"
    data={jenisChartData}
  />


  <PieChart
    title="Distribusi Perangkat per UP3"
    data={up3ChartData}
  />

</div>

      <div style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(190px, 1fr))',

        gap: '18px',

        marginBottom: '25px'
      }}>


      <Card
        title="Total Perangkat"
        value={summary.total || 0}
        color="#3498db"
      />

      {byJenis.map((item, index) => {

        const colors = [
          '#16a085',
          '#e67e22',
          '#8e44ad',
          '#2980b9',
          '#c0392b',
          '#2c3e50'
        ];


        return (

          <Card
            key={item.jenis}

            title={item.jenis}

            value={item.total}

            color={
              colors[
                index % colors.length
              ]
            }

            onClick={() => {

              const selected =
                devices.filter(
                  device =>
                    device.jenis ===
                    item.jenis
                );


              openDetailModal({

                title:
                  item.jenis,

                subtitle:
                  'Serial Number berdasarkan jenis perangkat',

                devices:
                  selected

              });

            }}
          />

        );

      })}

      </div>


      {/* =========================
          DISTRIBUSI
      ========================== */}

      <div style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(420px, 1fr))',

        gap: '20px',

        marginBottom: '25px'
      }}>


        {/* UP3 */}

        <div style={panelStyle}>

          <h3 style={titleStyle}>
            Sebaran Perangkat per UP3
          </h3>

          <table style={tableStyle}>

            <thead>

            <tr>

              <th style={thStyle}>
                UP3
              </th>

              <th style={thStyle}>
                Total
              </th>

              <th style={thStyle}>
                Rincian Jenis
              </th>

            </tr>

          </thead>


            <tbody>

            {Object.entries(byUP3)
              .map(([name, item]) => (

                <tr key={name}>

                  <td style={tdStyle}>

                    <button
                      type="button"

                      onClick={() => {

                        const selected =
                          devices.filter(
                            device =>
                              device.up3 === name
                          );


                        openDetailModal({

                          title:
                            name,

                          subtitle:
                            'Serial Number berdasarkan UP3',

                          devices:
                            selected

                        });

                      }}

                      style={detailLinkStyle}
                    >

                      🔍 {name}

                    </button>

                  </td>

                  <td style={tdStyle}>
                    <strong>
                      {item.total}
                    </strong>
                  </td>

                  <td style={tdStyle}>

                    {Object.entries(
                      item.byJenis || {}
                    ).map(
                      ([jenis, total]) => (

                        <span
                          key={jenis}
                          style={{
                            display: 'inline-block',
                            marginRight: '12px',
                            marginBottom: '4px'
                          }}
                        >

                          <strong>
                            {jenis}:
                          </strong>
                          {' '}
                          {total}

                        </span>

                      )
                    )}

                  </td>

                </tr>

              ))}

          </tbody>

          </table>

        </div>


        {/* MODEL */}

        <div style={panelStyle}>

          <h3 style={titleStyle}>
            Distribusi Model Perangkat
          </h3>

          <div style={{
            maxHeight: '270px',
            overflowY: 'auto'
          }}>

            <table style={tableStyle}>

              <thead>

                <tr>

                  <th style={thStyle}>
                    Jenis
                  </th>

                  <th style={thStyle}>
                    Merk
                  </th>

                  <th style={thStyle}>
                    Model
                  </th>

                  <th style={thStyle}>
                    Jumlah
                  </th>

                </tr>

              </thead>


              <tbody>

                {byModel.map(
                  (item, index) => (

                    <tr
                      key={
                        `${item.jenis}-${item.merk}-${item.model}-${index}`
                      }
                    >

                      <td style={tdStyle}>
                        {item.jenis}
                      </td>

                      <td style={tdStyle}>
                        {item.merk}
                      </td>

                      <td style={tdStyle}>

                        <button
                          type="button"

                          onClick={() => {

                            const selected =
                              devices.filter(
                                device =>
                                  device.jenis ===
                                    item.jenis &&

                                  device.merk ===
                                    item.merk &&

                                  device.model ===
                                    item.model
                              );


                            openDetailModal({

                              title:
                                item.model,

                              subtitle:
                                `${item.jenis} • ${item.merk}`,

                              devices:
                                selected

                            });

                          }}

                          style={detailLinkStyle}
                        >

                          🔍 {item.model}

                        </button>

                      </td>

                      <td style={tdStyle}>
                        {item.total}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>


      {/* =========================
          DETAIL PERANGKAT
      ========================== */}

      <div style={panelStyle}>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '15px',
          marginBottom: '15px'
        }}>


          <div>

            <h3 style={{
              ...titleStyle,
              marginBottom: '5px'
            }}>
              Detail Perangkat
            </h3>

            <span style={{
              color: '#7f8c8d',
              fontSize: '13px'
            }}>

              {filteredDevices.length}
              {' '}dari{' '}
              {devices.length}
              {' '}perangkat

            </span>

          </div>


          {/* FILTER */}

          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
          }}>


            <select
              value={up3Filter}
              onChange={(e) => {
                setUp3Filter(
                  e.target.value
                );

                setPage(1);
              }}
              style={inputStyle}
            >

              <option value="ALL">
                Semua UP3
              </option>


              {Object.keys(byUP3)
                .map(up3 => (

                  <option
                    key={up3}
                    value={up3}
                  >
                    {up3}
                  </option>

                ))}

            </select>


            <select
              value={jenisFilter}
              onChange={(e) => {

                setJenisFilter(
                  e.target.value
                );

                setPage(1);

              }}
              style={inputStyle}
            >

              <option value="ALL">
                Semua Jenis
              </option>

              {byJenis.map(item => (

                <option
                  key={item.jenis}
                  value={item.jenis}
                >
                  {item.jenis}
                </option>

              ))}

            </select>

          <select
              value={merkFilter}
              onChange={(e) => {

                setMerkFilter(
                  e.target.value
                );

                setPage(1);

              }}
              style={inputStyle}
            >

              <option value="ALL">
                Semua Merk
              </option>

              {byMerk.map(item => (

                <option
                  key={item.merk}
                  value={item.merk}
                >
                  {item.merk}
                </option>

              ))}

            </select>

            <input
              value={search}
              onChange={(e) => {

                setSearch(
                  e.target.value
                );

                setPage(1);

              }}
              placeholder="Cari serial, No. PA, unit, model..."
              style={{
                ...inputStyle,
                minWidth: '250px'
              }}
            />

          </div>

        </div>


        <div style={{
          overflowX: 'auto'
        }}>

          <table style={tableStyle}>

            <thead>

              <tr>

                <th style={thStyle}>
                  No
                </th>

                <th style={thStyle}>
                  Jenis
                </th>

                <th style={thStyle}>
                  Model
                </th>

                <th style={thStyle}>
                  Serial Number
                </th>

                <th style={thStyle}>
                  No. PA
                </th>

                <th style={thStyle}>
                  Unit / Lokasi
                </th>

                <th style={thStyle}>
                  UP3
                </th>

              </tr>

            </thead>


            <tbody>

              {currentDevices.length > 0
                ? currentDevices.map(
                    (device, index) => (

                      <tr
                        key={
                          device.id ||
                          device.serialNumber
                        }
                      >

                        <td style={tdStyle}>
                          {startIndex +
                            index + 1}
                        </td>

                        <td style={tdStyle}>
                          {device.jenis}
                        </td>

                        <td style={tdStyle}>
                          {device.model || '-'}
                        </td>

                        <td style={{
                          ...tdStyle,
                          fontWeight: 'bold'
                        }}>
                          {device.serialNumber}
                        </td>

                        <td style={tdStyle}>
                          {device.noPA || '-'}
                        </td>

                        <td style={tdStyle}>
                          {device.unit ||
                            device.area ||
                            '-'}
                        </td>

                        <td style={tdStyle}>
                          {device.up3}
                        </td>

                      </tr>

                    )
                  )

                : (

                  <tr>

                    <td
                      colSpan="7"
                      style={{
                        ...tdStyle,
                        textAlign: 'center',
                        padding: '30px'
                      }}
                    >

                      Data tidak ditemukan.

                    </td>

                  </tr>

                )
              }

            </tbody>

          </table>

        </div>


        {/* PAGINATION */}

        <div style={{
          marginTop: '18px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px'
        }}>


          <button
            disabled={
              currentPage <= 1
            }
            onClick={() =>
              setPage(
                currentPage - 1
              )
            }
          >
            ← Sebelumnya
          </button>


          <strong>
            Halaman {currentPage}
            {' / '}
            {totalPages}
          </strong>


          <button
            disabled={
              currentPage >=
              totalPages
            }
            onClick={() =>
              setPage(
                currentPage + 1
              )
            }
          >
            Berikutnya →
          </button>


        </div>

      </div>


      {/* ======================================
          MODAL DETAIL SERIAL NUMBER
      ====================================== */}

      {detailModal && (

        <div
          onClick={closeDetailModal}
          style={modalOverlayStyle}
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={modalContentStyle}
          >

            {/* HEADER */}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '20px',
                marginBottom: '18px'
              }}
            >

              <div>

                <h3
                  style={{
                    margin: 0,
                    color: '#2c3e50'
                  }}
                >
                  Daftar Serial Number
                </h3>


                <div
                  style={{
                    marginTop: '5px',
                    color: '#3498db',
                    fontWeight: 'bold'
                  }}
                >
                  {detailModal.title}
                </div>


                <div
                  style={{
                    marginTop: '3px',
                    color: '#7f8c8d',
                    fontSize: '12px'
                  }}
                >
                  {detailModal.subtitle}
                </div>

              </div>


              <button
                type="button"
                onClick={closeDetailModal}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '22px',
                  cursor: 'pointer',
                  color: '#7f8c8d'
                }}
              >
                ✕
              </button>

            </div>


            {/* TOTAL */}

            <div
              style={{
                padding: '10px 12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '5px',
                marginBottom: '15px',
                fontSize: '13px',
                color: '#34495e'
              }}
            >

              Total Perangkat:{' '}

              <strong>
                {detailDevices.length}
              </strong>

            </div>


            {/* SEARCH SERIAL */}

            <input
              type="text"
              value={detailSearch}

              onChange={(e) => {

                setDetailSearch(
                  e.target.value
                );

                setDetailPage(1);

              }}

              placeholder="🔍 Cari Serial Number..."

              style={{
                ...inputStyle,
                width: '100%',
                boxSizing: 'border-box',
                marginBottom: '15px'
              }}
            />


            {/* LIST SERIAL */}

            <div
              style={{
                maxHeight: '360px',
                overflowY: 'auto',
                border: '1px solid #e5e7eb',
                borderRadius: '5px'
              }}
            >

              <table style={tableStyle}>

                <thead>

                  <tr>

                    <th
                      style={{
                        ...thStyle,
                        width: '60px'
                      }}
                    >
                      No
                    </th>

                    <th style={thStyle}>
                      Serial Number
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {paginatedDetailDevices.length > 0
                    ? paginatedDetailDevices.map(
                        (device, index) => (

                          <tr
                            key={
                              device.idPerangkat ||
                              device.serialNumber
                            }
                          >

                            <td style={tdStyle}>
                              {detailStart +
                                index + 1}
                            </td>

                            <td
                              style={{
                                ...tdStyle,
                                fontWeight: 'bold',
                                color: '#2c3e50'
                              }}
                            >
                              {device.serialNumber}
                            </td>

                          </tr>

                        )
                      )

                    : (

                      <tr>

                        <td
                          colSpan="2"
                          style={{
                            ...tdStyle,
                            textAlign: 'center',
                            padding: '25px',
                            color: '#7f8c8d'
                          }}
                        >
                          Serial Number tidak ditemukan.
                        </td>

                      </tr>

                    )
                  }

                </tbody>

              </table>

            </div>


            {/* PAGINATION MODAL */}

            <div
              style={{
                marginTop: '18px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '14px'
              }}
            >

              <button
                type="button"

                disabled={
                  currentDetailPage <= 1
                }

                onClick={() =>
                  setDetailPage(
                    currentDetailPage - 1
                  )
                }
              >
                ← Sebelumnya
              </button>


              <strong
                style={{
                  fontSize: '13px'
                }}
              >
                {currentDetailPage}
                {' / '}
                {detailTotalPages}
              </strong>


              <button
                type="button"

                disabled={
                  currentDetailPage >=
                  detailTotalPages
                }

                onClick={() =>
                  setDetailPage(
                    currentDetailPage + 1
                  )
                }
              >
                Berikutnya →
              </button>

            </div>

          </div>

        </div>

      )}


    </div>
  );
}



// ==============================
// CARD
// ==============================

function Card({
  title,
  value,
  color,
  onClick
}) {

  return (

    <div
      onClick={onClick}

      style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',

        borderLeft:
          `6px solid ${color}`,

        boxShadow:
          '0 4px 6px rgba(0,0,0,0.05)',

        cursor:
          onClick
            ? 'pointer'
            : 'default',

        transition: '0.2s'
      }}
    >

      <div
        style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#2c3e50'
        }}
      >
        {value}
      </div>


      <div
        style={{
          fontSize: '12px',
          marginTop: '5px',
          color: '#7f8c8d',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}
      >

        {title}

      </div>


      {onClick && (

        <div
          style={{
            marginTop: '8px',
            fontSize: '11px',
            color: '#3498db',
            fontWeight: 'bold'
          }}
        >
          🔍 Lihat Serial Number
        </div>

      )}

    </div>

  );
}



// ==============================
// STYLE
// ==============================

const panelStyle = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  boxShadow:
    '0 2px 8px rgba(0,0,0,0.04)'
};


const titleStyle = {
  margin: '0 0 15px',
  color: '#2c3e50'
};


const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse'
};


const thStyle = {
  padding: '10px',
  backgroundColor: '#f4f6f8',
  borderBottom: '2px solid #ddd',
  fontSize: '12px',
  color: '#66727d',
  textAlign: 'left'
};


const tdStyle = {
  padding: '10px',
  borderBottom:
    '1px solid #edf2f7',
  color: '#34495e',
  fontSize: '13px'
};


const inputStyle = {
  padding: '9px 11px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  backgroundColor: '#fff'
};


const buttonStyle = {
  border: 'none',
  padding: '10px 17px',
  borderRadius: '6px',
  backgroundColor: '#3498db',
  color: '#ffffff',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const detailLinkStyle = {
  background: 'none',
  border: 'none',
  padding: 0,
  color: '#2980b9',
  fontWeight: 'bold',
  cursor: 'pointer',
  textAlign: 'left',
  fontSize: '13px'
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  backgroundColor:
    'rgba(0,0,0,0.45)',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  padding: '20px',

  zIndex: 9999
};


const modalContentStyle = {
  width: '100%',
  maxWidth: '600px',

  backgroundColor: '#ffffff',

  borderRadius: '8px',

  padding: '22px',

  boxShadow:
    '0 10px 30px rgba(0,0,0,0.2)',

  maxHeight: '85vh',
  overflowY: 'auto'
};