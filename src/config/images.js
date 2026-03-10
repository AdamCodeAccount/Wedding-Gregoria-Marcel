/**
 * Configuration des images de la galerie
 * Ajoutez vos images dans public/img/lieu/ et public/img/couple/
 * Formats acceptés: .jpg, .jpeg, .png, .webp
 */

// Images du lieu (lieu de la cérémonie)
export const lieuImages = [
  // Aucun fichier détecté actuellement dans public/img/lieu
];

// Images du couple
export const coupleImages = [
  'couple-1.JPG',
  'couple-1_.JPG',
  'couple-5.JPG',
  'couple-5-1.jpg',
  'couple-5-2.JPG',
];

// Chemins complets pour les composants (compatibles GitHub Pages)
const base = process.env.PUBLIC_URL || '';
export const getLieuImagePath = (filename) => `${base}/img/lieu/${filename}`;
export const getCoupleImagePath = (filename) => `${base}/img/couple/${filename}`;
