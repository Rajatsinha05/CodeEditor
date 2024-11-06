import { v4 as uuidv4 } from 'uuid';

export const generateLongIdFromUUID = () => {
    const uuid = uuidv4();
    const hex = uuid.replace(/-/g, '');
    return parseInt(hex.substring(0, 15), 16);
  };

  