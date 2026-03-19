# Finanze - Web App per Gestione Finanze Personali

Benvenuto in **Finanze**, un'applicazione web moderna e intuitiva per gestire le tue finanze personali. Questa guida ti aiuterà a configurare il progetto sul tuo computer, passo dopo passo, anche se sei alle prime armi.

---

## 1. Prerequisiti (Cosa ti serve)

Prima di iniziare, assicurati di avere questi strumenti installati:

1.  **Node.js**: È il motore che fa girare l'app sul tuo computer.
    - Scaricalo da [nodejs.org](https://nodejs.org/) (scegli la versione "LTS").
    - Per verificare se è installato, apri il terminale e scrivi: `node -v`.
2.  **Un editor di testo**: Ti consigliamo **VS Code** o **Trae**.
3.  **Un account Supabase**: Gratuito, lo useremo per salvare i dati online. Registrati su [supabase.com](https://supabase.com/).

---

## 2. Configurazione di Supabase (Il Database)

Supabase è dove verranno salvati i tuoi dati (transazioni, categorie, utenti).

1.  **Crea un Progetto**:
    - Accedi a Supabase e clicca su **"New Project"**.
    - Scegli un nome (es. `MioFinanze`) e una password sicura per il database.
2.  **Crea le Tabelle**:
    - Nel menu a sinistra di Supabase, clicca sull'icona **"SQL Editor"**.
    - Clicca su **"New query"**.
    - Apri il file `supabase/schema.sql` che trovi in questo progetto, copia tutto il contenuto e incollalo nell'editor di Supabase.
    - Clicca sul pulsante **"Run"** in basso a destra. Questo creerà automaticamente le tabelle `transactions` e `categories` con tutte le regole di sicurezza.
3.  **Ottieni le Chiavi API**:
    - Clicca sull'icona dell'ingranaggio (**Project Settings**) in basso a sinistra.
    - Vai nella sezione **"API"**.
    - Troverai due valori fondamentali:
        - `Project URL`
        - `anon public key`
    - Tieni questa pagina aperta, ti serviranno tra poco!

---

## 3. Configurazione dell'App sul tuo Computer

1.  **Apri il progetto**: Apri la cartella del progetto nel tuo editor (es. Trae).
2.  **Installa le dipendenze**:
    - Apri il terminale integrato nell'editor.
    - Scrivi questo comando e premi Invio:
      ```bash
      npm install
      ```
      *Questo scaricherà tutti i "pezzi" necessari per far funzionare l'app (come React, Tailwind, ecc.).*
3.  **Collega l'App a Supabase**:
    - Trova il file chiamato `.env.local` nella cartella principale.
    - Sostituisci i valori con quelli che hai trovato su Supabase:
      ```env
      NEXT_PUBLIC_SUPABASE_URL=incolla_qui_il_tuo_project_url
      NEXT_PUBLIC_SUPABASE_ANON_KEY=incolla_qui_la_tua_anon_public_key
      ```

---

## 4. Avvio dell'App

Ora sei pronto per vedere l'app in funzione!

1.  Nel terminale, scrivi:
    ```bash
    npm run dev
    ```
2.  L'app si avvierà. Vedrai una scritta tipo `Ready in ...` e un link: `http://localhost:3000`.
3.  **Apri il browser** e vai all'indirizzo `http://localhost:3000`.

---

## 5. Come usare l'App

1.  **Registrazione**: Clicca su "Accedi" e poi su "Registrati" per creare il tuo utente personale.
2.  **Categorie**: Prima di inserire transazioni, vai nella sezione **Categorie** per creare le tue (es. Casa, Cibo, Stipendio).
3.  **Transazioni**: Torna nella **Dashboard** o in **Transazioni** per inserire le tue entrate e uscite.
4.  **Report**: Guarda i grafici aggiornarsi automaticamente in base a quello che inserisci!

---

## 6. Come portarla Online (Deploy)

Quando vuoi che l'app sia accessibile da smartphone ovunque tu sia:

1.  Crea un account su [Vercel](https://vercel.com/).
2.  Carica il tuo codice su GitHub.
3.  Importa il progetto GitHub su Vercel.
4.  **Importante**: Nelle impostazioni di Vercel, aggiungi le stesse variabili d'ambiente che hai messo nel file `.env.local`.

---

### Dubbi o Errori?
- Se il terminale dice `npm: command not found`, significa che Node.js non è installato correttamente.
- Se vedi errori nel browser, controlla di aver incollato correttamente le chiavi in `.env.local` e di aver eseguito lo script SQL su Supabase.
