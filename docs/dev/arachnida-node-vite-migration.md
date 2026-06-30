# Migrace Node.js 16 → 24 na Ubuntu serveru (PM2)

Tento dokument zachycuje postup migrace aplikace `spidertraits` z Node.js 16 na Node.js 24.
Postup byl ověřen na testovacím serveru `arachnidatraits-dev.nastojte.cz` a následně zopakován na produkci.

---

## Výchozí stav (před migrací)

Zjištěno příkazem `pm2 show spidertraits`:

| Parametr | Hodnota |
|----------|---------|
| Script path | `/opt/spider-traits/spider-trait-database/backend/index.js` |
| Exec cwd | `/opt/spider-traits/spider-trait-database` |
| Interpreter | `/home/ubuntu/.nvm/versions/node/v16.20.2/bin/node` |
| Node.js version | 16.20.2 |
| Node env | production |
| Exec mode | fork_mode |
| PM2 logs | `/home/ubuntu/.pm2/logs/` |

Node.js je spravován přes **NVM** (`/home/ubuntu/.nvm`).

---

## Postup migrace

### 1. Instalace Node.js 24 přes NVM

```bash
nvm install 24
nvm alias default 24
nvm use 24
node --version   # ověření: v24.x.x
```

### 2. Přeinstalace PM2 pod Node.js 24

PM2 je nainstalován globálně pod konkrétní verzí Node — po přechodu je nutné ho přeinstalovat:

```bash
npm install -g pm2
pm2 --version   # ověření
```

### 3. Aktualizace npm závislostí aplikace

```bash
cd /opt/spider-traits/spider-trait-database/backend
npm install
```

### 3b. Oprávnění pro privilegované porty (port 443)

Node.js nemůže bez zvláštního oprávnění naslouchat na portech < 1024. Capability musí být nastavena
na každý nový Node.js binárník:

```bash
sudo setcap 'cap_net_bind_service=+ep' /home/ubuntu/.nvm/versions/node/v24.16.0/bin/node
```

### 4. Restart aplikace s novou verzí Node

```bash
pm2 update   # aktualizace běžícího PM2 daemona na nově nainstalovanou verzi
```

> **Pozor:** Při přechodu mezi major verzemi PM2 (zde 6 → 7) `pm2 update` zahodí seznam procesů
> (dump.pm2 z v6 není kompatibilní s v7). Aplikace zmizí z `pm2 list` a je nutné ji nastartovat ručně.

```bash
cd /opt/spider-traits/spider-trait-database
NODE_ENV=production pm2 start backend/index.js --name spidertraits
pm2 save
pm2 show spidertraits   # ověření: interpreter by měl ukazovat na v24.x.x
```

### 5. Aktualizace PM2 startup skriptu

Startup skript musí být přegenerován, aby systém spouštěl PM2 pod správnou verzí Node:

```bash
pm2 unstartup
pm2 startup
# příkaz vypíše sudo příkaz — ten zkopíruj a spusť
pm2 save
```

---

## Ověření po migraci

```bash
pm2 show spidertraits          # interpreter = /home/ubuntu/.nvm/versions/node/v24.x.x/bin/node
pm2 logs spidertraits --lines 50   # žádné chyby při startu
```

---

## Poznámky k aktualizaci aplikace (World Arachnida Traits Database)

### DB migrace

Před restartem aplikace po upgradu kódu spustit migraci pro podporu řádů (issue #44 — World Arachnida Traits Database):

```bash
mysql -u root spider_traits_db < /opt/spider-traits/spider-trait-database/db/sql/order-tables.sql
```

### TLS certifikát (Let's Encrypt)

Pokud se mění doménové názvy nebo je certifikát nutné obnovit, vystavit přes certbot.
Certifikát pro obě produkční domény v jednom příkazu (vytvoří jeden certifikát s oběma doménami jako SAN,
uložený pod první doménou: `/etc/letsencrypt/live/spidertraits.sci.muni.cz/`):

```bash
pm2 stop spidertraits   # uvolnit port 80 pro certbot --standalone
sudo /snap/bin/certbot certonly --standalone -d spidertraits.sci.muni.cz -d arachnidatraits.sci.muni.cz
pm2 start spidertraits
```

Po vystavení certifikátu zkontrolovat, že cesta v konfiguraci aplikace odpovídá novým souborům:

```bash
# v backend/settings.prod.js ověřit:
# ssl.key  → /etc/letsencrypt/live/<domain>/privkey.pem
# ssl.cert → /etc/letsencrypt/live/<domain>/fullchain.pem
```

Poté restartovat aplikaci:

```bash
pm2 restart spidertraits
```

---

## Poznámky k produkci

- Postup je identický, pouze jiná hostname.
- Před migrací na produkci doporučeno udělat snapshot/zálohu.
- Na produkci je dále třeba prověřit "dirty" soubory v repozitáří, jsou to shellové skripty, kde je napevno cesta k node 16. Tyto soubory nejspíš bude stačit resetovat na verze z repozitáře, aby se spouštely s default verzí node.
