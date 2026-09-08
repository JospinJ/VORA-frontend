# VORA — frontend Expo (déploiement web)

Un seul code : téléphone **et** site. Sur Vercel on exporte le web, puis on le sert en statique.
L’API reste sur le VPS : `https://bannerofgrace.com/vora`.

Repo : https://github.com/JospinJ/VORA-frontend

## Déployer sur Vercel

1. Importer ce repo dans [Vercel](https://vercel.com/new) (Framework Preset : **Other**).
2. Vercel lit `vercel.json` : build `expo export --platform web`, sortie `apps/mobile/dist`.
3. Variable d’environnement (Production + Preview) :

```
EXPO_PUBLIC_BACKEND_URL=https://bannerofgrace.com/vora
```

4. Le backend autorise déjà `https://*.vercel.app` via `CORS_ORIGIN_REGEX`. Relancer l’API VPS si ce n’est pas encore déployé.

## Lancer en local (navigateur)

```bash
git clone https://github.com/JospinJ/VORA-frontend.git
cd VORA-frontend
npm install
cp apps/mobile/.env.example apps/mobile/.env
npm --workspace @vora/mobile run web
```

## Contenu

- `apps/mobile` — Expo (passager, chauffeur, assistant IA) → export web
- `apps/admin` — console admin
- `packages/` — contrats, tokens, UI
