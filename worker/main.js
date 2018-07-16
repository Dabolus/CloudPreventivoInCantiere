const db = require('./db');
const queue = require('./queue');

(async () => {
  const pool = await db;
  while (true) {
    const newMessages = await queue.getMessages();
    await newMessages.map(async ({ id, content, popReceipt }) => {
      // Le graffe di ciascun case sono necessarie perché abbiamo bisogno di uno scope diverso per ciascuno di essi,
      // altrimenti le variabili danno conflitto
      console.log(content);
      switch (content.Tipo) {
        // Cantiere
        case 1: {
          // Il metodo query effettua l'escape dei parametri in automatico
          const { recordset } = await pool.query`
            INSERT INTO Cantieri (NomeCliente, EmailCliente, Luogo)
            VALUES (${content.NomeCliente}, ${content.EmailCliente}, ${content.Luogo});
            SELECT SCOPE_IDENTITY() AS Id;
          `;
          const newId = recordset[0].Id;
          await content.Foto.map(foto => pool.query`
            INSERT INTO FotoCantieriInterventi (UrlFoto, IdCantiere)
            VALUES (${foto}, ${newId});
          `);
          break;
        }
        // Intervento
        case 2: {
          // Il metodo query effettua l'escape dei parametri in automatico
          const { recordset } = await pool.query`
            INSERT INTO Interventi (IdCantiere, TipoIntervento, StimaCosto, Note)
            VALUES (${content.IdCantiere}, ${content.TipoIntervento}, ${content.StimaCosto}, ${content.Note});
            SELECT SCOPE_IDENTITY() AS Id;
          `;
          const newId = recordset[0].Id;
          await content.Foto.map(foto => pool.query`
            INSERT INTO FotoCantieriInterventi (UrlFoto, IdIntervento)
            VALUES (${foto}, ${newId});
          `);
          break;
        }
      }
      await queue.deleteMessage(id, popReceipt);
    });
    // await newMessages.map((message) =>
  }
})();
