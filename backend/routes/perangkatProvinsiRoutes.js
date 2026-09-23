import express from 'express';

const router =
  express.Router();


// ===================================
// CARI PA / SERIAL NUMBER
// ===================================

router.get(
  '/cari',
  async (req, res) => {

    try {

      const {
        keyword
      } = req.query;


      if (!keyword) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              'No. PA atau Serial Number wajib diisi.'

          });

      }


      const appsScriptUrl =
        process.env
          .PROVINSI_SCRIPT_URL;


      const url =
        `${appsScriptUrl}` +
        `?action=cari` +
        `&keyword=${encodeURIComponent(keyword)}`;


      const response =
        await fetch(url);


      const data =
        await response.json();


      return res.json(data);


    } catch (error) {

      console.error(
        'Cari perangkat error:',
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            'Gagal mencari perangkat.',

          error:
            error.message

        });

    }

  }
);


// ===================================
// TAMBAH PERANGKAT
// ===================================

router.post(
  '/',
  async (req, res) => {

    try {

      const appsScriptUrl =
        process.env
          .PROVINSI_SCRIPT_URL;


      const response =
        await fetch(
          appsScriptUrl,
          {

            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify({

                action:
                  'tambah',

                ...req.body

              })

          }
        );


      const data =
        await response.json();


      if (!data.success) {

        return res
          .status(400)
          .json(data);

      }


      return res
        .status(201)
        .json(data);


    } catch (error) {

      console.error(
        'Tambah perangkat error:',
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            'Gagal menambahkan perangkat.',

          error:
            error.message

        });

    }

  }
);


export default router;