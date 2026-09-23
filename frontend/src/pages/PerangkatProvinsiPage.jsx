import React, { useState } from 'react';
import BASE_URL from '../utils/api';


// =====================================
// DEFAULT KHUSUS PC AIO
// =====================================

const PC_DEFAULTS = {
  sistemOperasi: 'WINDOWS 11 PRO',
  antivirus: 'KASPERSKY MILIK PLN PUSAT',
  msOffice: 'WPS OFFICE'
};


// =====================================
// FORM KOSONG
// =====================================

const createEmptyForm = () => ({
  up3: '',
  unit: '',
  jenisPerangkat: '',
  merk: '',
  modelPerangkat: '',
  noPA: '',
  serialNumber: '',
  sistemOperasi: '',
  antivirus: '',
  msOffice: '',
  keterangan: ''
});


export default function PerangkatProvinsiPage() {

  // =====================================
  // SEARCH
  // =====================================

  const [keyword, setKeyword] =
    useState('');

  const [searching, setSearching] =
    useState(false);

  const [searchMessage, setSearchMessage] =
    useState('');

  const [searchResults, setSearchResults] =
    useState([]);


  // =====================================
  // FORM
  // =====================================

  const [formData, setFormData] =
    useState(createEmptyForm());

  const [saving, setSaving] =
    useState(false);

  const [formMessage, setFormMessage] =
    useState(null);


  // =====================================
  // CARI PERANGKAT
  // =====================================

  const searchDevice = async (
    customKeyword = null
  ) => {

    const searchValue =
      (
        customKeyword ??
        keyword
      ).trim();


    if (!searchValue) {

      setSearchMessage(
        'Masukkan No. PA atau Serial Number.'
      );

      setSearchResults([]);

      return;
    }


    setSearching(true);
    setSearchMessage('');


    try {

      const response =
        await fetch(
          `${BASE_URL}/api/perangkat/provinsi/cari?keyword=${encodeURIComponent(searchValue)}`
        );


      const data =
        await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
          'Pencarian gagal.'
        );
      }


      setSearchResults(
        data.results || []
      );


      if (
        !data.results ||
        data.results.length === 0
      ) {

        setSearchMessage(
          'Perangkat tidak ditemukan.'
        );

      } else {

        setSearchMessage(
          `${data.results.length} perangkat ditemukan.`
        );

      }


    } catch (error) {

      setSearchResults([]);

      setSearchMessage(
        error.message ||
        'Gagal mencari perangkat.'
      );

    } finally {

      setSearching(false);

    }

  };


  // ENTER UNTUK SEARCH

  const handleSearchKeyDown = (
    event
  ) => {

    if (event.key === 'Enter') {
      searchDevice();
    }

  };


  // =====================================
  // HANDLE INPUT FORM
  // =====================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value
    } = event.target;


    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };


  // =====================================
  // JENIS PERANGKAT
  // =====================================

  const handleJenisChange = (
    event
  ) => {

    const value =
      event.target.value;


    const normalized =
      value.trim().toUpperCase();


    setFormData(prev => {

      // PC AIO
      if (
        normalized === 'PC AIO'
      ) {

        return {
          ...prev,

          jenisPerangkat:
            value,

          sistemOperasi:
            PC_DEFAULTS.sistemOperasi,

          antivirus:
            PC_DEFAULTS.antivirus,

          msOffice:
            PC_DEFAULTS
              .msOffice
        };

      }


      // SELAIN PC AIO
      // DEFAULT KOSONG / OPSIONAL

      return {
        ...prev,

        jenisPerangkat:
          value,

        sistemOperasi: '',
        antivirus: '',
        msOffice: ''
      };

    });

  };


  // =====================================
  // SIMPAN PERANGKAT
  // =====================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    setFormMessage(null);


    // VALIDASI FRONTEND

    if (
      !formData.up3 ||
      !formData.unit ||
      !formData.jenisPerangkat ||
      !formData.merk ||
      !formData.modelPerangkat ||
      !formData.serialNumber
    ) {

      setFormMessage({
        type: 'error',

        text:
          'UP3, Unit/Lokasi, Jenis Perangkat, Merk, Model, dan Serial Number wajib diisi.'
      });

      return;
    }


    setSaving(true);


    try {

      const response =
        await fetch(
          `${BASE_URL}/api/perangkat/provinsi`,
          {

            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify(
                formData
              )

          }
        );


      const data =
        await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
          'Gagal menambahkan perangkat.'
        );

      }


      setFormMessage({

        type: 'success',

        text:
          `Perangkat berhasil ditambahkan dengan ID ${data.idPerangkat}.`

      });


      const newSerial =
        formData.serialNumber;


      // RESET FORM

      setFormData(
        createEmptyForm()
      );


      // OTOMATIS TAMPILKAN
      // PERANGKAT YANG BARU DISIMPAN

      setKeyword(
        newSerial
      );


      await searchDevice(
        newSerial
      );


    } catch (error) {

      setFormMessage({

        type: 'error',

        text:
          error.message ||
          'Terjadi kesalahan saat menyimpan perangkat.'

      });

    } finally {

      setSaving(false);

    }

  };


  return (

    <div style={pageStyle}>


      {/* =====================================
          HEADER
      ====================================== */}

      <div style={{
        marginBottom: '25px'
      }}>

        <h2 style={{
          margin: 0,
          color: '#1f2937'
        }}>

          Cari & Tambah Perangkat
          Provinsi Kalselteng

        </h2>


        <p style={{
          marginTop: '7px',
          color: '#6b7280',
          fontSize: '14px'
        }}>

          Cari perangkat
          atau tambahkan perangkat baru
          ke database.

        </p>

      </div>


      {/* =====================================
          SEARCH
      ====================================== */}

      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          marginBottom: '30px',
          borderLeft: '5px solid #2ecc71'
        }}
      >
        <h3
          style={{
            margin: '0 0 10px 0',
            color: '#27ae60'
          }}
        >
          🔍 Cari Perangkat
        </h3>

        <p
          style={{
            fontSize: '12px',
            color: '#7f8c8d',
            margin: '0 0 15px 0'
          }}
        >
          Cari data perangkat menggunakan No. PA atau Serial Number.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '10px'
          }}
        >
          <input
            type="text"
            placeholder="Masukkan No. PA atau Serial Number..."
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            onKeyDown={handleSearchKeyDown}
            disabled={searching}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px',
              backgroundColor:
                searching
                  ? '#f2f2f2'
                  : '#fff'
            }}
          />

          <button
            onClick={() => searchDevice()}
            disabled={searching}
            style={{
              backgroundColor:
                searching
                  ? '#95a5a6'
                  : '#2ecc71',

              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',

              cursor:
                searching
                  ? 'not-allowed'
                  : 'pointer',

              fontWeight: 'bold'
            }}
          >
            {searching
              ? '⏳ Mencari...'
              : 'Cari Perangkat'
            }
          </button>
        </div>

        {searchMessage && (
          <p
            style={{
              color:
                searchResults.length > 0
                  ? '#27ae60'
                  : '#e74c3c',

              fontSize: '13px',
              marginTop: '10px',
              fontWeight: 'bold'
            }}
          >
            {searchMessage}
          </p>
        )}

        {searchResults.length > 0 && (
          <div
            style={{
              marginTop: '15px',
              padding: '15px',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              border: '1px solid #e2e8f0'
            }}
          >
            {searchResults.map(device => (
              <DeviceResult
                key={device.idPerangkat}
                device={device}
              />
            ))}
          </div>
        )}
      </div>


      {/* =====================================
          FORM TAMBAH
      ====================================== */}



      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#ffffff',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}
      >
        <h2
          style={{
            margin: '0 0 20px 0',
            color: '#2c3e50',
            borderBottom: '2px solid #3498db',
            paddingBottom: '10px'
          }}
        >
          📝 Form Tambah Perangkat Provinsi Kalselteng
        </h2>

        {/* =========================
            BARIS 1 - SATU KOLOM
        ========================= */}

        <div style={singleColumnStyle}>

          <FormGroup label="UP3 *">

            <input
              name="up3"
              list="up3-list"
              value={formData.up3}
              onChange={handleChange}
              placeholder="Masukkan lokasi UP3"
              style={inputStyle}
            />

            <datalist id="up3-list">
              <option value="UP3 PALANGKA RAYA" />
              <option value="UP3 KAPUAS" />
              <option value="UP3 PANGKALAN BUN" />
            </datalist>

          </FormGroup>

        </div>


        {/* =========================
            BARIS 2 - TIGA KOLOM
        ========================= */}

        <div style={threeColumnStyle}>

          <FormGroup label="Unit / Lokasi *">

            <input
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="Contoh: ULP SAMPIT"
              style={inputStyle}
            />

          </FormGroup>


          <FormGroup label="Jenis Perangkat *">

            <input
              name="jenisPerangkat"
              list="jenis-perangkat-list"
              value={formData.jenisPerangkat}
              onChange={handleJenisChange}
              placeholder="Contoh: PC AIO"
              style={inputStyle}
            />

            <datalist id="jenis-perangkat-list">
              <option value="PC AIO" />
              <option value="PRINTER" />
              <option value="SCANNER" />
            </datalist>

          </FormGroup>


          <FormGroup label="Merk *">

            <input
              name="merk"
              list="merk-list"
              value={formData.merk}
              onChange={handleChange}
              placeholder="Contoh: Dell"
              style={inputStyle}
            />

            <datalist id="merk-list">
              <option value="Dell" />
              <option value="HP" />
              <option value="Epson" />
              <option value="Brother" />
            </datalist>

          </FormGroup>

        </div>


        {/* =========================
            BARIS 3 - TIGA KOLOM
        ========================= */}

        <div style={threeColumnStyle}>

          <FormGroup label="Model Perangkat *">

            <input
              name="modelPerangkat"
              value={formData.modelPerangkat}
              onChange={handleChange}
              placeholder="Contoh: Dell OptiPlex 3280 AIO"
              style={inputStyle}
            />

          </FormGroup>


          <FormGroup label="No. PA">

            <input
              name="noPA"
              value={formData.noPA}
              onChange={handleChange}
              placeholder="Opsional"
              style={inputStyle}
            />

          </FormGroup>


          <FormGroup label="Serial Number *">

            <input
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              placeholder="Masukkan Serial Number"
              style={inputStyle}
            />

          </FormGroup>

        </div>


        {/* =========================
            BARIS 4 - TIGA KOLOM
        ========================= */}

        <div style={threeColumnStyle}>

          <FormGroup label="Sistem Operasi">

            <input
              name="sistemOperasi"
              value={formData.sistemOperasi}
              onChange={handleChange}
              placeholder="Opsional"
              style={inputStyle}
            />

          </FormGroup>

         <FormGroup label="Keterangan">

            <textarea
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              placeholder="Keterangan tambahan (opsional)"
              rows="1"
              style={{
                ...inputStyle,
                resize: 'horizontal'
              }}
            />

          </FormGroup>
        </div>


        {/* =========================
            BARIS 5 - FULL WIDTH
        ========================= */}

        <div style={{
          marginBottom: '20px'
        }}>



        </div>
                {/* INFO PC */}

                {formData
                  .jenisPerangkat
                  .trim()
                  .toUpperCase()
                  === 'PC AIO' && (

                  <div style={infoStyle}>

                    Sistem Operasi,
                    Antivirus dan MS Office
                    otomatis terisi untuk PC AIO,
                    tetapi tetap opsional dan
                    dapat diubah atau dikosongkan.

                  </div>

                )}


                {/* MESSAGE */}

                {formMessage && (

                  <div style={{

                    marginTop: '18px',

                    padding: '12px',

                    borderRadius: '6px',

                    backgroundColor:
                      formMessage.type
                        === 'success'
                        ? '#dcfce7'
                        : '#fee2e2',

                    color:
                      formMessage.type
                        === 'success'
                        ? '#166534'
                        : '#991b1b'

                  }}>

                    {formMessage.text}

                  </div>

                )}


                {/* SAVE */}

                <div style={{
                  marginTop: '20px',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    width: '100%',

                    backgroundColor:
                      saving
                        ? '#95a5a6'
                        : '#3498db',

                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '5px',

                    cursor:
                      saving
                        ? 'not-allowed'
                        : 'pointer',

                    fontWeight: 'bold',
                    fontSize: '16px'
                  }}
                >
                  {saving
                    ? '🚀 Sedang Memasukkan Data ke Spreadsheet...'
                    : '🚀 Simpan Sebagai Perangkat Baru'
                  }
                </button>

                </div>

        </form>

    </div>

  );
}



// =====================================
// HASIL PERANGKAT
// =====================================

function DeviceResult({
  device
}) {

  return (

    <div style={resultCardStyle}>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
        flexWrap: 'wrap',
        marginBottom: '15px'
      }}>

        <div>

          <strong style={{
            fontSize: '17px',
            color: '#1f2937'
          }}>

            {device.idPerangkat}

          </strong>


          <div style={{
            marginTop: '3px',
            color: '#6b7280',
            fontSize: '13px'
          }}>

            {device.jenis}
            {' • '}
            {device.merk}
            {' • '}
            {device.model}

          </div>

        </div>


        <div style={badgeStyle}>
          {device.up3}
        </div>

      </div>


      <div style={detailGridStyle}>

        <Detail
          label="Serial Number"
          value={
            device.serialNumber
          }
        />

        <Detail
          label="No. PA"
          value={
            device.noPA
          }
        />

        <Detail
          label="Unit / Lokasi"
          value={
            device.unit
          }
        />

        <Detail
          label="Sistem Operasi"
          value={
            device.sistemOperasi
          }
        />

        <Detail
          label="Antivirus"
          value={
            device.antivirus
          }
        />

        <Detail
          label="MS Office"
          value={
            device.office
          }
        />

        <Detail
          label="Keterangan"
          value={
            device.keterangan
          }
        />

      </div>

    </div>

  );
}



// =====================================
// FORM GROUP
// =====================================

function FormGroup({
  label,
  children
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontWeight: 'bold',
          marginBottom: '3px',
          fontSize: '12px',
          color: '#34495e'
        }}
      >
        {label}
      </label>

      {children}
    </div>
  );
}



// =====================================
// DETAIL
// =====================================

function Detail({
  label,
  value
}) {

  return (

    <div>

      <div style={{
        fontSize: '11px',
        textTransform: 'uppercase',
        color: '#9ca3af',
        fontWeight: 'bold',
        marginBottom: '4px'
      }}>

        {label}

      </div>


      <div style={{
        color: '#374151',
        fontSize: '14px'
      }}>

        {value || '-'}

      </div>

    </div>

  );
}



// =====================================
// STYLE
// =====================================

const pageStyle = {
  padding: '30px',
  maxWidth: '950px',
  margin: '0 auto',
  fontFamily: 'Arial, sans-serif'
};


const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  padding: '24px',
  border: '1px solid #e5e7eb',
  boxShadow:
    '0 2px 8px rgba(0,0,0,0.04)'
};


const sectionTitleStyle = {
  marginTop: 0,
  marginBottom: '18px',
  color: '#1f2937'
};


const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '14px',
  boxSizing: 'border-box'
};


const primaryButton = {
  border: 'none',
  borderRadius: '6px',
  padding: '10px 18px',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontWeight: '600',
  cursor: 'pointer'
};


const formGridStyle = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '18px'
};


const resultCardStyle = {
  border: '1px solid #bfdbfe',
  backgroundColor: '#f8fbff',
  borderRadius: '8px',
  padding: '18px'
};


const detailGridStyle = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '15px'
};


const badgeStyle = {
  padding: '6px 10px',
  borderRadius: '20px',
  backgroundColor: '#dbeafe',
  color: '#1d4ed8',
  fontSize: '12px',
  fontWeight: 'bold',
  height: 'fit-content'
};


const infoStyle = {
  marginTop: '18px',
  padding: '11px 13px',
  borderRadius: '6px',
  backgroundColor: '#eff6ff',
  color: '#1e40af',
  fontSize: '13px'
};

const singleColumnStyle = {
  width: '49%',
  marginBottom: '15px'
};

const threeColumnStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '15px',
  marginBottom: '15px'
};