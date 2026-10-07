# Compás

Métronome de flamenco, entraîneur de main droite et lecteur de morceaux.

## Fichiers

- `index.html` : l'application
- `sons-1.js` : les sons (A Compás, et le zapateado de Compás)
- `polices-1.css` : les polices
- `notes-1.js` : le modèle d'écoute des notes (Basic Pitch et TensorFlow.js, licence Apache 2.0), lu seulement quand on transcrit un morceau
- `nunez-1.js` : les exercices de Gerardo Núñez (© Encuentro Productions). Ce fichier n'est pas couvert par la licence
  du projet ; il peut être retiré du dépôt public, l'application s'en passe, et les exercices s'importent alors
  depuis la bibliothèque avec le fichier `exercices-nunez.json`.
- `sw.js` : le fonctionnement hors connexion

Les exercices tirés de livres achetés (par exemple « The Endless Guitar Workbook » de Karim Baggili)
ne font pas partie du dépôt : ils s'importent depuis la bibliothèque avec un fichier personnel, qui ne doit pas être publié.
La collection « Combinaisons main droite » et le générateur d'arpèges sont, eux, des combinaisons systématiques
écrites pour Compás.

## Licence

Compás est distribué sous licence **GNU Affero General Public License v3** (voir `LICENSE`),
parce qu'il intègre des sons et des patrones du projet libre A Compás, publiés sous cette licence.

## Crédits

- **Sons et patrones « A Compás »** : palmas claras et sordas, pitos, nudillos, cajón, udu, clic,
  et les patrones de palmas et de cajón de 11 palos. © Olivier Ricordeau, Jérémie Sieffert et
  l'équipe A Compás — https://acompas.org — code source : https://gitlab.com/acompas/acompas
- **Jaleos** : enregistrements d'Aziz Andry (projet A Compás).
- **Mode « A Compás » du métronome** : leurs 13 rythmes flamencos, leur mixage, leurs réglages
  (improviser, humaniser, swing, réverbération, croches par instrument, décompte) et leurs fiches de palos,
  traduites en français. Le diapason des six cordes s'inspire du leur.
- Modifications apportées : échantillons convertis en mono 44,1 kHz et mis au même niveau,
  jaleos encodés en MP3, patrones recalés sur la façon de compter les pulsos de Compás.
