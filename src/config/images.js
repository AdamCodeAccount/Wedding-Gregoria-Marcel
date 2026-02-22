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
  'couple-1.jpg',
  'couple-2.jpg',
  'couple-3.jpg',
  'couple-4.jpg',
  'couple-5.JPG',
];

// Chemins complets pour les composants
export const getLieuImagePath = (filename) => `/img/lieu/${filename}`;
export const getCoupleImagePath = (filename) => `/img/couple/${filename}`;
