/**
 * Configuration des images de la galerie
 * Ajoutez vos images dans public/img/lieu/ et public/img/couple/
 * Formats acceptés: .jpg, .jpeg, .png, .webp
 */

// Images du lieu (lieu de la cérémonie)
export const lieuImages = [
  'lieu-1.jpg',
  'lieu-2.jpg',
  'lieu-3.jpg',
  'lieu-4.jpg',
  'lieu-5.jpg',
];

// Images du couple
export const coupleImages = [
  // Fichiers "canon" présents dans public/img/couple
  'couple-1.jpg',
  'couple-2.JPG',
  'couple-3.JPG',
  'couple-4.JPG',
  'couple-5.JPG',
];

// Chemins complets pour les composants (compatibles GitHub Pages)
const base = process.env.PUBLIC_URL || '';
export const getLieuImagePath = (filename) => `${base}/img/lieu/${filename}`;
export const getCoupleImagePath = (filename) => `${base}/img/couple/${filename}`;
