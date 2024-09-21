export const setCache = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  
  export const getCache = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  };
  
  export const clearCache = () => {
    localStorage.clear();
  };