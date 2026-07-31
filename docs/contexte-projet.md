# Contexte du Projet - AI or Not

## Objectif

**AI or Not** est un jeu educatif qui sensibilise a la detection d'images
generees par IA. Le joueur voit 5 images et doit deviner, pour chacune, si
elle est reelle ou generee par IA.

## Regles

- 5 images par partie, choix "IA" ou "Reelle" pour chacune
- 1 partie par mode et par jour (2 modes = 2 parties max par jour)
- Reset chaque jour a minuit (heure de Paris)
- Historique des 7 derniers jours rejouable a volonte
- Pas de compte requis, statistiques en localStorage

## Modes

1. **Realiste** : photos du quotidien (personnes, objets, scenes)
2. **Peinture** : oeuvres d'art et tableaux classiques

## Sensibilisation

Le guide integre (modale "Guide") explique les indices classiques pour
reperer une image IA : coherence des ombres, mains/details, repetitions,
proportions, texte illisible, rendu trop lisse. Un avertissement rappelle que
ces indices ne sont pas infaillibles face a l'evolution rapide des modeles.

## Sources des images

- **Peinture reelle** : dataset de tableaux classiques (domaine public :
  Monet, Renoir, Modigliani, Frida Kahlo...)
- **Peinture IA** : generations par diffusion (Stable Diffusion)
- **Realiste reel** : photos Unsplash (via l'API Picsum)
- **Realiste IA** : visages et scenes generes par des modeles GAN

## Architecture technique

100% statique : pas de base de donnees, pas de backend a maintenir. Voir la
section Architecture du `README.md` pour le detail.

- **Frontend** : Next.js 15 (App Router) + React + TypeScript
- **Styling** : Tailwind CSS, theme sombre
- **Selection des images** : deterministe par date (meme partie pour tous les
  joueurs un jour donne), pas de tirage aleatoire cote client
- **Hebergement** : n'importe quel hebergeur Node.js, aucune variable
  d'environnement requise

## Evolutions possibles

- Brancher l'API Unsplash officielle (cle developpeur) pour un pool de
  photos reelles illimite et plus varie, plutot que le dataset statique
  actuel
- Elargir le pool d'images IA (le pool actuel est fixe et fini, environ 24
  parties avant repetition par mode)
- Niveaux de difficulte, statistiques avancees, partage social enrichi
