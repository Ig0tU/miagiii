export const frontendSideFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};
