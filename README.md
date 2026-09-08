# VORA — frontend Expo

Dépôt **uniquement frontend** (passager / chauffeur / admin UI).
L’API est déjà en ligne : `https://bannerofgrace.com/vora`.

Repo : https://github.com/JospinJ/VORA-frontend

## Lancer en local

Prérequis : Node.js 20+, npm, [Expo Go](https://expo.dev/go) en option.

```bash
git clone https://github.com/JospinJ/VORA-frontend.git
cd VORA-frontend
npm install
cp apps/mobile/.env.example apps/mobile/.env
npm --workspace @vora/mobile run start
```

- **`w`** : navigateur
- QR code : Expo Go
- `npm --workspace @vora/mobile run android` : émulateur

## Déployer sur le VPS (comme le backend)

Le Core reste sur `https://bannerofgrace.com/vora`. Ce dépôt sert uniquement le **web Expo**.

```bash
git clone https://github.com/JospinJ/VORA-frontend.git /opt/vora-frontend
cd /opt/vora-frontend
npm install
cp apps/mobile/.env.example apps/mobile/.env
npm --workspace @vora/mobile run export:web
```

Les fichiers statiques sont dans `apps/mobile/dist`. Nginx :

```nginx
location /app/ {
    alias /opt/vora-frontend/apps/mobile/dist/;
    try_files $uri $uri/ /app/index.html;
}
```

Puis `nginx -t && systemctl reload nginx`.
