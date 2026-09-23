import express from 'express';

const router = express.Router();

// Monitoring perangkat Provinsi Kalteng
router.get('/', async (req, res) => {
  try {
    const appsScriptUrl = process.env.PROVINSI_SCRIPT_URL;

    if (!appsScriptUrl) {
      return res.status(500).json({
        success: false,
        message: 'PROVINSI_SCRIPT_URL belum diatur di file .env'
      });
    }

    const response = await fetch(
      `${appsScriptUrl}?action=monitoring`
    );

    if (!response.ok) {
      throw new Error(
        `Google Apps Script merespons HTTP ${response.status}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({
        success: false,
        message: data.message || 'Gagal mengambil data monitoring provinsi.'
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Monitoring Provinsi Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Gagal terhubung ke Google Apps Script Monitoring Provinsi.',
      error: error.message
    });
  }
});

export default router;