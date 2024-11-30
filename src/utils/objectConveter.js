export const stringToObject = (str) => {
  if (!str || typeof str !== "string") return {};
  const obj = {};
  const keyValuePattern = /\b(\w+)=([^,]+)(?=,|$)/g;
  let match;

  while ((match = keyValuePattern.exec(str)) !== null) {
    const key = match[1].trim();
    let value = match[2].trim().replace(/\)$/, ""); // Remove trailing parentheses
    if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1); // Remove single quotes
    }
    if (key === "role" && value.endsWith("}")) {
      value = value.slice(0, -1); // Fix trailing "}"
    }
    obj[key] = value === "null" ? null : value; // Handle "null" explicitly
  }
  return obj;
};
