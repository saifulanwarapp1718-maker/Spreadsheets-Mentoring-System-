import React, { useState } from 'react';
import BASE_URL from '../utils/api';

export default function MigoBapPage() {
  // 1. STATE FORM DATA UTAMA
  const [formData, setFormData] = useState({
    noPA: '',                  
    noAR: '',                  
    nama_pengguna: '',         
    nip: '',                   
    no_hp: '',                 
    spesifikasi_perangkat: '', 
    brand: '',                 
    serial_number: '',         
    tanggalDokumen: '',        
    unitKerja: 'UIP3B KAL',    
    personalSubArea: '',       
    status: 'Closed',          
    urlDrive: ''               
  });

  // 2. STATE PENCARIAN & EDIT DATA
  const [searchNoAR, setSearchNoAR] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [editStatus, setEditStatus] = useState('Closed');
  const [editUrlDrive, setEditUrlDrive] = useState('');

  // 3. STATE LOADING (BARU)
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 // 4. FUNGSI TAMBAH DATA BARU KE SPREADSHEET (SUDAH DIPERBAIKI)
  const handleSubmitKeSheet = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Aktifkan Loading
    try {
      // Perbaikan: Target rute diubah ke /api/bap/simpan & mengirimkan formData
      const response = await fetch(`${BASE_URL}/api/bap/simpan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) // Data form dikirim ke server backend
      });
      
      const resData = await response.json();
      if (resData.success) {
        alert('🚀 Sukses! Data Berita Acara berhasil tersimpan.');
        setFormData({
          noPA: '', noAR: '', nama_pengguna: '', nip: '', no_hp: '',
          spesifikasi_perangkat: '', brand: '', serial_number: '', tanggalDokumen: '',
          unitKerja: 'UIP3B KAL', personalSubArea: '', status: 'Closed', urlDrive: ''
        });
      } else {
        alert('❌ Gagal menyimpan: ' + resData.message);
      }
    } catch (err) {
      alert('❌ Terjadi kesalahan koneksi server.');
    } finally {
      setIsSubmitting(false); // Matikan Loading
    }
  };

  // 5. FUNGSI PENCARIAN
  const handleCariAR = async () => {
    setSearchResult(null);
    setSearchError('');
    if (!searchNoAR.trim()) return setSearchError('Masukkan nomor AR terlebih dahulu.');

    setIsSearching(true); // Aktifkan Loading
    try {
      const response = await fetch(`${BASE_URL}/api/bap/cari/${searchNoAR}`);
      const resData = await response.json();

      if (resData.success) {
        setSearchResult(resData);
        setEditStatus(resData.status || 'Closed');
        setEditUrlDrive(resData.linkDrive || '');
      } else {
        setSearchError(resData.message);
      }
    } catch (err) {
      setSearchError('Gagal terhubung ke database server.');
    } finally {
      setIsSearching(false); // Matikan Loading
    }
  };

  // 6. FUNGSI UPDATE DATA (EDIT)
  const handleUpdateData = async (e) => {
    e.preventDefault();
    if (!searchResult || !searchResult.rowNumber) {
      alert("❌ Data baris tidak ditemukan. Silakan cari ulang nomor AR.");
      return;
    }

    setIsUpdating(true); // Aktifkan Loading
    try {
      const response = await fetch(`${BASE_URL}/api/bap/update-bap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rowNumber: searchResult.rowNumber,
          status: editStatus,
          urlDrive: editUrlDrive
        })
      });
      
      const data = await response.json();
      if (data.success) {
        alert("🎉 " + data.message);
        setSearchResult(null); 
        setSearchNoAR('');     
      } else {
        alert("❌ Gagal memperbarui data: " + data.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem: " + err.message);
    } finally {
      setIsUpdating(false); // Matikan Loading
    }
  };

  
  return (
    
    <div style={{ padding: '30px', maxWidth: '950px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      
      {/* 🔍 KOTAK PENCARIAN NOMOR AR */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '30px', borderLeft: '5px solid #2ecc71' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#27ae60' }}>🔍 Cari & Edit Berita Acara</h3>
        <p style={{ fontSize: '12px', color: '#7f8c8d', margin: '0 0 15px 0' }}>Sistem akan melacak data dan menyediakan form pengubahan status serta link BASTP.</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Masukkan Nomor AR... (Contoh: AR-9519449)" 
            value={searchNoAR}
            onChange={(e) => setSearchNoAR(e.target.value)}
            disabled={isSearching}
            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', backgroundColor: isSearching ? '#f2f2f2' : '#fff' }}
          />
          <button 
            onClick={handleCariAR} 
            disabled={isSearching}
            style={{ 
              backgroundColor: isSearching ? '#95a5a6' : '#2ecc71', 
              color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: isSearching ? 'not-allowed' : 'pointer', fontWeight: 'bold' 
            }}
          >
            {isSearching ? '⏳ Mencari...' : 'Cari Dokumen'}
          </button>
        </div>

        {/* BOX FORM EDIT JIKA HASIL PENCARIAN DITEMUKAN */}
        {searchResult && (
          <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50', borderBottom: '1px dashed #ccc', paddingBottom: '5px' }}>📄 Data Ditemukan (Baris ke-{searchResult.rowNumber})</h4>
            <p style={{ margin: '3px 0', fontSize: '14px' }}><strong>Pemilik / PIC:</strong> {searchResult.nama_pengguna}</p>
            <p style={{ margin: '3px 0', fontSize: '14px' }}><strong>Nomor AR:</strong> {searchResult.noAR}</p>
            
            <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #ddd' }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#e67e22' }}>🛠️ Form Pembaruan Data</h5>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={labelStyle}>Ubah Status:</label>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} disabled={isUpdating} style={inputStyle}>
                  <option value="Closed">Closed</option>
                  <option value="Open">Open</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>Link Google Drive / BASTP Baru:</label>
                <input 
                  type="text" 
                  value={editUrlDrive} 
                  onChange={(e) => setEditUrlDrive(e.target.value)} 
                  placeholder="Masukkan link Google Drive baru jika ada"
                  disabled={isUpdating}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {/* Tombol Simpan Pembaruan dengan Loading */}
                <button 
                  onClick={handleUpdateData} 
                  disabled={isUpdating}
                  style={{ 
                    backgroundColor: isUpdating ? '#bdc3c7' : '#e67e22', 
                    color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: isUpdating ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '13px' 
                  }}
                >
                  {isUpdating ? '⏳ Menyimpan Perubahan...' : '💾 Simpan Perubahan Data'}
                </button>

                {/* Tombol Download (Langsung Buka Tab Baru, Tidak Perlu Loading Karena Instan) */}
                {searchResult.linkDrive && searchResult.linkDrive !== '-' && searchResult.linkDrive.includes('http') && (
                  <button 
                    onClick={() => {
                      let url = searchResult.linkDrive;
                      let fileId = "";
                      if (url.includes('/file/d/')) fileId = url.split('/file/d/')[1].split('/')[0];
                      else if (url.includes('id=')) fileId = url.split('id=')[1].split('&')[0];

                      if (fileId) window.open(`https://drive.google.com/uc?export=download&id=${fileId}`, '_blank');
                      else window.open(url, '_blank');
                    }} 
                    style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
                  >
                    📥 Download File Saat Ini
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {searchError && <p style={{ color: '#e74c3c', fontSize: '13px', marginTop: '10px', fontWeight: 'bold' }}>{searchError}</p>}
      </div>

      {/* 📝 FORM UTAMA INPUT DATA BERITA ACARA */}
      <form onSubmit={handleSubmitKeSheet} style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>📝 Form Berita Acara Serah Terima Perangkat</h2>
        
        {/* BARIS 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={labelStyle}>NO.PA (Asset Number)</label>
            <input type="text" name="noPA" value={formData.noPA} onChange={handleInputChange} style={inputStyle} placeholder="Contoh: 101150000000" required />
          </div>
          {/* <div>
            <label style={labelStyle}>ID PERMOHONAN (Nomor AR)</label>
            <input type="text" name="noAR" value={formData.noAR} onChange={handleInputChange} style={inputStyle} placeholder="Contoh: AR-9519449" required />
          </div> */}
        </div>

        {/* BARIS 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={labelStyle}>Calon Pengguna / PIC</label>
            <input type="text" name="nama_pengguna" value={formData.nama_pengguna} onChange={handleInputChange} style={inputStyle} placeholder="Nama Lengkap Karyawan" required />
          </div>
          <div>
            <label style={labelStyle}>NIP Karyawan</label>
            <input type="text" name="nip" value={formData.nip} onChange={handleInputChange} style={inputStyle} placeholder="Masukkan NIP" required />
          </div>
          <div>
            <label style={labelStyle}>Nomor HP</label>
            <input type="text" name="no_hp" value={formData.no_hp} onChange={handleInputChange} style={inputStyle} placeholder="Masukkan Nomor HP" required />
          </div>
        </div>

        {/* BARIS 3 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={labelStyle}>Spesifikasi Perangkat</label>
            <input type="text" name="spesifikasi_perangkat" value={formData.spesifikasi_perangkat} onChange={handleInputChange} style={inputStyle} placeholder="Contoh: MS Laptop Single Spec" required />
          </div>
          <div>
            <label style={labelStyle}>Brand / Merk</label>
            <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} style={inputStyle} placeholder="Contoh: HP / Lenovo" required />
          </div>
          <div>
            <label style={labelStyle}>Serial Number (SN)</label>
            <input type="text" name="serial_number" value={formData.serial_number} onChange={handleInputChange} style={inputStyle} placeholder="Masukkan SN Perangkat" required />
          </div>
        </div>

        {/* BARIS 4 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={labelStyle}>Tanggal Disetujui GA</label>
            <input type="date" name="tanggalDokumen" value={formData.tanggalDokumen} onChange={handleInputChange} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Personal Area Name</label>
            <input type="text" name="unitKerja" value={formData.unitKerja} onChange={handleInputChange} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Personal Sub Area Name</label>
            <input type="text" name="personalSubArea" value={formData.personalSubArea} onChange={handleInputChange} style={inputStyle} placeholder="Contoh: UPT PALANGKARAYA" required />
          </div>
        </div>

        {/* BARIS 5 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle}>Status Baru</label>
            <select name="status" value={formData.status} onChange={handleInputChange} style={inputStyle}>
              <option value="Closed">Closed</option>
              <option value="Open">Open</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>BASTP (Link Google Drive Awal)</label>
            <input type="text" name="urlDrive" value={formData.urlDrive} onChange={handleInputChange} style={inputStyle} placeholder="https://drive.google.com/file/d/..." />
          </div>
        </div>

        {/* TOMBOL SUBMIT TAMBAH DATA DENGAN LOADING */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            width: '100%', 
            backgroundColor: isSubmitting ? '#95a5a6' : '#3498db', 
            color: 'white', border: 'none', padding: '12px', borderRadius: '5px', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px' 
          }}
        >
          {isSubmitting ? '🚀 Sedang Memasukkan Data ke Spreadsheet...' : '🚀 Simpan Sebagai Data Berita Acara Baru'}
        </button>
      </form>
    </div>
  );
}

const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '3px', fontSize: '12px', color: '#34495e' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' };