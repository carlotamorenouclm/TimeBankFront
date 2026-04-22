// Map each backend image_key to a local frontend image asset.
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

export const getServiceImage = (imageKey) => serviceImages[imageKey] || computerImg;

// Expose catalog-safe image options so forms only send supported keys.
export const serviceImageOptions = [
  { value: 'bike', label: 'Bike repair' },
  { value: 'clean', label: 'House cleaning' },
  { value: 'dog', label: 'Dog walking' },
  { value: 'computer', label: 'Computer repair' },
  { value: 'ingles', label: 'English lessons' },
  { value: 'mates', label: 'Math tutoring' },
];
