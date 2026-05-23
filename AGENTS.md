# World Spider Trait Database — Agent Guide

Tento soubor slouží jako orientační průvodce repozitářem pro AI agenty.

---

## Přehled projektu

**World Spider Trait Database** ([spidertraits.sci.muni.cz](https://spidertraits.sci.muni.cz)) je vědecký systém pro sběr, správu a poskytování přístupu k morfologickým, behaviorálním a ekologickým datům o pavoucích. Umožňuje výzkumníkům nahrávat datové sady, spravovat taxonomické informace a dotazovat se na trait data přes webové rozhraní i REST API.

---

## Tech Stack

| Část | Technologie |
|------|-------------|
| Backend | Node.js + Express 4 |
| Frontend | Vue.js 2.7 + Vuetify 2.6 + Vuex + Vue Router |
| Databáze | MySQL / MariaDB (InnoDB) |
| Autentizace | OpenID Connect (`express-openid-connect`) |
| Soubory | `express-fileupload`, `fast-csv`, `xlsx` |
| E-mail | Nodemailer |
| Grafy | Chart.js + vue-chartjs |
| Build | Vue CLI 5 |

---

## Struktura repozitáře

```
backend/        Express API server
  index.js      Vstupní bod — middleware, OIDC, routing, statické soubory
  settings.js   Konfigurace (port, DB, OIDC, mail, DataCite)
  settings.dev.js / settings.prod.js  Přepisy pro prostředí
  api/
    api.js        Definice všech API routes
    data.js       CRUD pro záznamy trait dat
    datasets.js   Správa datasetů
    traits.js     Správa traits
    methods.js    Správa metod měření
    references.js Správa referencí
    locations.js  Správa lokalit
    taxonomy.js   Správa taxonomie
    enums.js      Výčtové hodnoty (sex, life_stage, measure, …)
    countries.js  Seznam zemí
    import.js     Import CSV/XLSX souborů
    jobs.js       Správa asynchronních jobů
  util/
    auth.js             Role-based auth middleware (admin/editor/contributor)
    db-client.js        MySQL connection pool, query builder, autocomplete
    converter.js        Konverze formátů dat
    csv.js              CSV import/export
    mail.js             E-mailové notifikace
    doi.js              DataCite DOI operace
    doi-batch-creator.js Hromadné vytváření DOI
    job-manager.js      Fronta asynchronních jobů
    taxonomy-common.js  Pomocné funkce pro taxonomii
    taxonomy-updater.js Synchronizace s World Spider Catalog
    taxonomy-synchro/   Další sync utility

frontend/       Vue.js SPA
  src/
    views/        Stránkové komponenty (Data, Traits, References, …)
    components/   Znovupoužitelné komponenty (editory, tabulky, dialogy)
    store/        Vuex store
    router/       Vue Router
    mixins/       Sdílená logika komponent
    plugins/      Konfigurace Vuetify

db/
  model/schema.20260522.sql  Aktuální schéma databáze
  sql/                        Pomocné SQL skripty
  backup/                     Zálohovací scripty

docs/           Dokumentace (API, contribute, editor howto, …)
```

---

## Lokální spuštění

```bash
# Backend (port 3000)
cd backend
npm install
node index.js

# Frontend (dev server na portu 8080)
cd frontend
npm install
npm run serve

# Produkční build frontendu (výstup do frontend/dist, servírován Expressem)
cd frontend
npm run build
```

Backend servíruje statické soubory z `frontend/dist` a API na `/backend/*`. OIDC lze vypnout nastavením `settings.oidc.disable: true` pro vývoj. CORS je povolena pro `localhost:8080`.

---

## Databázové schéma (klíčové tabulky)

| Tabulka | Role |
|---------|------|
| `data` | Hlavní záznamy — trait hodnota, taxonomie, lokalita, reference, dataset |
| `taxonomy` | Taxonomická klasifikace pavouků (WSC LSID, family, genus, species) |
| `taxonomy_name` | Synonyma a alternativní názvy taxonů |
| `trait` | Definice měřených vlastností (abbrev, name, category, data_type) |
| `trait_category` | Skupiny vlastností |
| `data_type` | Typy dat (numeric, categorical, text…) |
| `dataset` | Importované datové sady (uploader, DOI, status schválení) |
| `reference` | Citace zdrojů (DOI, full citation, abbrev) |
| `location` | Lokality (WGS84 souřadnice, nadmořská výška, habitat, country) |
| `method` | Metody měření / pozorování |
| `measure` | Typ měřené veličiny (single, mean, median, min, max) |
| `sex` | Pohlaví (female, male, both, unknown) |
| `life_stage` | Životní stadium (egg, spiderling, juvenile, adult, all) |
| `country` | ISO 3166 kódy zemí |
| `habitat_global` | IUCN klasifikace habitatů |
| `import` | Staging tabulka pro import — data před validací a provázáním |

---

## API Endpointy (prefix `/backend`)

| Endpoint | Metody | Auth | Popis |
|----------|--------|------|-------|
| `/autocomplete/:endpoint` | GET | Veřejný | Autocomplete na různých polích |
| `/traits` | GET, POST | POST → editor | Výpis / vytvoření traits |
| `/traits/:id` | GET, PUT, DELETE | PUT/DELETE → editor | Detail / úprava / smazání |
| `/methods` | GET, POST | POST → editor | Metody |
| `/methods/:id` | GET, PUT, DELETE | PUT/DELETE → editor | Detail metody |
| `/references` | GET, POST | POST → editor | Reference |
| `/references/:id` | GET, PUT, DELETE | PUT/DELETE → editor | Detail reference |
| `/references-replace/:id/:replacement` | PUT | Editor | Nahrazení reference jinou |
| `/locations` | GET, POST | POST → editor | Lokality |
| `/locations/:id` | GET, PUT, DELETE | PUT/DELETE → editor | Detail lokality |
| `/taxonomy` | GET, POST | POST → editor | Taxonomie |
| `/taxonomy/valid-names/:taxon?` | GET | Veřejný | Platné taxonomické názvy |
| `/taxonomy/:id` | GET, PUT, DELETE | PUT/DELETE → editor | Detail taxonu |
| `/data` | GET, POST | POST → editor | Trait data záznamy |
| `/datasets` | GET, POST | POST → editor | Datasety |
| `/enums/*` | GET | Veřejný | Výčty (data_types, life_stages, measures, sexes, …) |
| `/jobs` | GET | Veřejný | Stav asynchronních jobů |
| `/import` | POST | Editor | Upload a import CSV/XLSX |

---

## Autentizace a role

Role jsou čteny z OIDC claims (Masarykova Univerzita IdP):

| Role | Claim | Práva |
|------|-------|-------|
| Admin | `spider-trait-db-administration` | Vše včetně správy uživatelů |
| Editor / Validator | `spider-trait-db-data-validation` | CRUD data, traits, references, locations, taxonomy |
| Contributor | `spider-trait-db-data-entry` | Nahrávání datasetů |

API klíč se generuje jako SHA256 hash `sub + secret`. Middleware: `auth.resourcesAuth()`, `auth.isAdmin()`, `auth.isEditor()`.

---

## Vzory a konvence

- **Query builder** v `db-client.js` — dynamické sestavování WHERE klauzulí, LIKE hledání, stránkování přes `limit`/`offset`.
- **Import flow**: CSV/XLSX → staging tabulka `import` → validace a provázání → přesun do `data`.
- **Async joby**: Dlouhé operace (import, taxonomy sync) běží jako background joby spravované `job-manager.js`.
- **Frontend**: Komponenty jsou rozděleny na page-level `views/` a znovupoužitelné `components/`. Store/Vuex drží stav přihlášení a sdílených dat.
- **Taxonomy sync**: `taxonomy-updater.js` synchronizuje s World Spider Catalog (WSC) přes `wsc_lsid`.

---

## Důležité soubory pro úpravy

- Přidat nový API endpoint → `backend/api/api.js` + příslušný soubor v `backend/api/`
- Změnit databázové schéma → `db/model/schema.20260522.sql` + migrační SQL do `db/sql/`
- Frontend nová stránka → `frontend/src/views/` + registrace v `frontend/src/router/`
- Konfigurace prostředí → `backend/settings.dev.js` / `backend/settings.prod.js`
