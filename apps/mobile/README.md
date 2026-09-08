# Application mobile VORA

Application React Native commune aux parcours passager et chauffeur.

- `app/` : routes et layouts.
- `src/components/` : composants de présentation.
- `src/features/` : fonctionnalités regroupées par domaine.
- `src/navigation/` : guards, deep links et contrats de routes.
- `src/services/` : client API, websocket, stockage et télémétrie.
- `src/state/` : état local éphémère et préférences.
- `src/design/` : thème dérivé des tokens partagés.
- `src/utils/` : fonctions sans dépendance UI.
- `tests/` : tests unitaires et de composants.

## Lancer l'application

Prérequis : Node.js 20+ et un backend VORA démarré sur le réseau accessible à
l'appareil. Depuis `frontend/` :

```bash
npm install
cp apps/mobile/.env.example apps/mobile/.env
npm --workspace @vora/mobile run start
```

Ensuite, scanner le QR code avec Expo Go, lancer un émulateur Android avec
`npm --workspace @vora/mobile run android`, ou vérifier le bundle avec
`npm --workspace @vora/mobile run web`.

`EXPO_PUBLIC_BACKEND_URL` est obligatoire pour les actions réelles. Sur Android
émulateur, utiliser `http://10.0.2.2:8000`; sur un téléphone physique, utiliser
l'adresse IP LAN du poste de développement. Ne jamais placer le jeton
inter-service IA dans cette application : la voix et le copilot passent par les
routes authentifiées du Core (`/v1/voice/*` et `/v1/ai/*`).

Le premier parcours disponible est la vague 01 : splash, onboarding, profil,
création de compte, validation OTP, connexion, accueil, destination, devis,
recherche chauffeur et course en cours. Les actions d'authentification appellent
le backend réel et affichent les erreurs renvoyées par celui-ci.
