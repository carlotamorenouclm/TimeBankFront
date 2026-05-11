// Map legacy backend image_key values to local frontend image assets.
import bikeImg from '../assets/bike.jpg';
import cleanImg from '../assets/clean.jpg';
import dogImg from '../assets/dog.jpg';
import computerImg from '../assets/computer.avif';
import inglesImg from '../assets/ingles.jpg';
import matesImg from '../assets/mates.jpg';

const serviceImages = {
  bike: bikeImg,
  clean: cleanImg,
  dog: dogImg,
  computer: computerImg,
  ingles: inglesImg,
  mates: matesImg,
};

export const getServiceImage = (imageKey) => {
  if (!imageKey) return null;
  if (imageKey.startsWith('data:image/')) return imageKey;
  return serviceImages[imageKey] || null;
};
