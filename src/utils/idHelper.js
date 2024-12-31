import { v4 as uuidv4 } from 'uuid';

export const generateLongIdFromUUID = () => {
    const uuid = uuidv4();
    const hex = uuid.replace(/-/g, '');
    return parseInt(hex.substring(0, 15), 16);
  };

  
  import { ulid } from 'ulid';

/**
 * Generate a unique string ID using ULID
 * @returns {string} A unique string ID
 */
export const generateULID = () => {
  return ulid(); // Generate and return the ULID as a string
};


