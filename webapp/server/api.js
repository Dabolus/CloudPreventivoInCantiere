const express = require('express');
const multer = require('multer');
const db = require('./db');
const queue = require('./queue');
const azureStorage = require('./storage');
const email = require('./email');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get('/cantieri', async (req, res) => {
  try {
    const pool = await db;
    const { recordset } = await pool.query`
      SELECT c.*, f.UrlFoto
      FROM Cantieri AS c, FotoCantieriInterventi AS f
      WHERE f.IdCantiere = c.Id
    `;
    res.status(200).send({
      status: 200,
      data: recordset || [],
    });
  } catch (e) {
    res.status(500).send({
      status: 500,
      data: e.message,
    });
  }
});

router.post('/cantieri', upload.array('Foto'), async (req, res) => {
  try {
    // TODO: inserire controlli dei campi inviati dall'utente
    // Carico tutte le foto nello storage
    const Foto =
      await Promise.all((req.files || []).map(file => azureStorage.uploadImage(file.originalname, file.buffer)));
    // Inserisco nella coda i dati da inserire nel DB, compresi gli URL delle foto appena caricate sullo storage
    await queue.sendMessage({
      ...req.body,
      Tipo: 1, // 1 = Cantiere, 2 = Intervento
      Foto,
    });
    res.status(200).send({
      status: 200,
      data: 'OK',
    });
  } catch (e) {
    res.status(500).send({
      status: 500,
      data: e.message,
    });
  }
});

router.get('/interventi', async (req, res) => {
  try {
    const pool = await db;
    const { recordset } = await pool.query`
      SELECT i.*, f.UrlFoto
      FROM Interventi AS i, FotoCantieriInterventi AS f
      WHERE f.IdIntervento = i.Id
    `;
    res.status(200).send({
      status: 200,
      data: recordset || [],
    });
  } catch (e) {
    res.status(500).send({
      status: 500,
      data: e.message,
    });
  }
});

router.post('/interventi', upload.array('Foto'), async (req, res) => {
  try {
    // TODO: inserire controlli dei campi inviati dall'utente
    // Carico tutte le foto nello storage
    const Foto =
      await Promise.all((req.files || []).map(file => azureStorage.uploadImage(file.originalname, file.buffer)));
    // Inserisco nella coda i dati da inserire nel DB, compresi gli URL delle foto appena caricate sullo storage
    await queue.sendMessage({
      ...req.body,
      Tipo: 2, // 1 = Cantiere, 2 = Intervento
      Foto,
    });
    res.status(200).send({
      status: 200,
      data: 'OK',
    });
  } catch (e) {
    res.status(500).send({
      status: 500,
      data: e.message,
    });
  }
});

router.post('/preventivo/:id', async (req, res) => {
  try {
    const pool = await db;
    const { recordset } = await pool.query`
      SELECT i.*, c.NomeCliente, c.EmailCliente
      FROM Interventi AS i, Cantieri AS c
      WHERE i.IdCantiere = c.Id
    `;
    await email(
      `"${recordset[0].NomeCliente}" <${recordset[0].EmailCliente}>`,
      `<h2>${recordset[0].NomeCliente}, il tuo preventivo è pronto.</h2>
        <h4>Lista interventi:</h4>        
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Note</th>
              <th>Stima costo</th>
            </tr>
          </thead>
          <tbody>
            ${recordset.reduce((intervento) => `
              <tr>
                <td>${intervento.TipoIntervento}</td>
                <td>${intervento.Note}</td>
                <td>${intervento.StimaCosto}€</td>
              </tr>
            `)}
          </tbody>
        </table>`,
    );
    res.status(200).send({
      status: 200,
      data: 'OK',
    });
  } catch (e) {
    res.status(500).send({
      status: 500,
      data: e.message,
    });
  }
  console.log(req.params.id);
});

module.exports = router;
