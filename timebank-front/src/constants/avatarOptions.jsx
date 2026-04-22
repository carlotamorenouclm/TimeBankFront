// Local avatar gallery used by the profile screen and private sidebars.
import avatar1 from '../assets/Avatar/Avatar1.jpeg';
import avatar2 from '../assets/Avatar/Avatar2.jpeg';
import avatar3 from '../assets/Avatar/Avatar3.jpeg';
import avatar4 from '../assets/Avatar/Avatar4.jpeg';
import avatar5 from '../assets/Avatar/Avatar5.jpeg';
import avatar6 from '../assets/Avatar/Avatar6.jpeg';
import avatar7 from '../assets/Avatar/Avatar7.jpeg';
import avatar8 from '../assets/Avatar/Avatar8.jpeg';
import avatar9 from '../assets/Avatar/Avatar9.jpeg';
import avatar10 from '../assets/Avatar/Avatar10.jpeg';
import avatar11 from '../assets/Avatar/Avatar11.jpeg';
import avatar12 from '../assets/Avatar/Avatar12.jpeg';

export const avatarOptions = [
  { key: 'avatar_1', label: 'Avatar 1', image: avatar1 },
  { key: 'avatar_2', label: 'Avatar 2', image: avatar2 },
  { key: 'avatar_3', label: 'Avatar 3', image: avatar3 },
  { key: 'avatar_4', label: 'Avatar 4', image: avatar4 },
  { key: 'avatar_5', label: 'Avatar 5', image: avatar5 },
  { key: 'avatar_6', label: 'Avatar 6', image: avatar6 },
  { key: 'avatar_7', label: 'Avatar 7', image: avatar7 },
  { key: 'avatar_8', label: 'Avatar 8', image: avatar8 },
  { key: 'avatar_9', label: 'Avatar 9', image: avatar9 },
  { key: 'avatar_10', label: 'Avatar 10', image: avatar10 },
  { key: 'avatar_11', label: 'Avatar 11', image: avatar11 },
  { key: 'avatar_12', label: 'Avatar 12', image: avatar12 },
];

export const getAvatarImage = (avatarKey) =>
  avatarOptions.find((avatar) => avatar.key === avatarKey)?.image || null;
