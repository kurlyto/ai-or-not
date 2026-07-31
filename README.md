# AI or Not

Jeu quotidien pour tester votre oeil face a l'IA generative : 5 images par partie,
devinez lesquelles sont reelles et lesquelles sont generees par IA.

## Concept

- **2 modes** : Realiste (photos du quotidien) et Peinture (oeuvres d'art classiques)
- **1 partie par mode et par jour**, nouvelle partie chaque jour a minuit (heure de Paris)
- **Meme partie pour tout le monde** un jour donne (selection deterministe par date)
- Historique des 7 derniers jours rejouable a volonte
- Aucun compte requis, statistiques stockees en local (localStorage)

## Architecture

100% statique, aucune base de donnees :

```
public/images/
  realistic/{real,ai}/*.jpg + manifest.json
  painting/{real,ai}/*.jpg + manifest.json
```

`src/lib/jeu/selection-images.ts` choisit les 5 images du jour a partir d'un
generateur pseudo-aleatoire seede par `date + mode` : deterministe (memes images
pour tout le monde le meme jour), sans backend a maintenir.

```
apps/
src/
├── app/                  # Next.js App Router
│   ├── page.tsx          # Logique du jeu
│   └── api/
│       ├── jeu/                # GET les 5 images du jour
│       └── verifier-reponse/   # POST verification d'une reponse
├── components/
│   ├── header/            # Header + modals (historique, guide, options)
│   ├── jeu/                # Ecrans de jeu (demarrage, image, resultats)
│   └── ui/                 # Composants de base (bouton, modal)
├── lib/
│   ├── data/manifest.ts    # Lecture des manifests statiques
│   ├── jeu/                 # Selection deterministe, logique de partie, dates
│   └── utils/                # localStorage, partage de score
└── types/
```

## Dataset

- **Peinture** : 84 tableaux classiques (domaine public) + 90 images IA
  (diffusion), curation `scripts/build-painting-dataset.js` a partir d'un
  dataset local plus large.
- **Realiste** : 60 photos reelles (Unsplash via Picsum) + 60 images IA
  (visages/scenes generes par des modeles GAN).

## Developpement

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

Aucune variable d'environnement necessaire : tout le contenu est statique et
embarque dans le repo.

## Deploiement

Application Next.js standard (`npm run build && npm run start`), deployable
sur tout hebergeur Node.js (Vercel, VPS avec PM2, etc). Aucun service externe
requis.

## Stack

Next.js 15, React 18, TypeScript, Tailwind CSS.
