# CloudPreventivoInCantiere

## Struttura del progetto

All'interno del progetto sono presenti tre cartelle:

- **webapp**: contiene i file relativi alla parte web del progetto `CloudPreventivoInCantiere` e alle sue API
- **worker**: contiene i file relativi al worker che si occupa di scodare gli elementi che arrivano dalla parte web di `CloudPreventivoInCantiere`
- **CloudElettricistaInCantiere**: contiene

Entrambi gli applicativi sono stati dockerizzati, in modo da rendere molto più semplice il deployment degli stessi.

Entrambi gli applicativi sono stati scritti in Node e possiedono degli script npm per avviare il progetto in sviluppo e in produzione:

- **npm start**: è il comando che viene utilizzato in produzione dall'immagine Docker. Si aspetta di trovare le stringhe di connessione come variabili d'ambiente, quindi in locale non funzionerà.
- **npm run dev**: è il comando utilizzato in fase di sviluppo. Quando un file del progetto viene modificato, lo script node verrà automaticamente riavviato. Si aspetta di trovare le stringhe di connessione nel file `.env` nella cartella del progetto.
- **npm run prod**: è un comando che può essere utilizzato per testare il progetto come fosse in produzione. A differenza di **npm start**, però, si aspetta di trovare le stringhe di connessione nel file `.env` nella cartella del progetto.

## Per testare in locale

Per il test locale dei progetti è necessario avere installata una versione di NodeJS sufficientemente recente (>=8.9). L'ultima LTS disponibile andrà benissimo.

Bisogna poi installare le dipendenze del server della web app e del worker:
```bash
$ npm i # All'interno di `webapp/server/` e all'interno di `worker/`
```

È inoltre necessario inserire le corrette variabili d'ambiente per mezzo dei file `.env`. È necessario utilizzare questi file nella cartella del server della web app `webapp/server/` e nella cartella del worker `worker/`. In ciascuna di queste cartelle è presente un file `.env.esempio`. Sarà sufficiente rinominarlo in `.env` e sostituire le variabili di ambiente contenute al suo interno.

A questo punto, sarà sufficiente avviare la parte del progetto che si vuole avviare utilizzando il comando:
```bash
$ npm run dev # All'interno di `webapp/server/` e/o di `worker/`,
              # in base alla parte del progetto che si vuole avviare.
              # Eseguirlo in ciascuna cartella per avviarli tutti.
```
