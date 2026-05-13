const ANALYSIS_STORAGE_KEY = 'leaseLensAnalysisData';

export const slugifyClauseTitle = (title = '') =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const saveAnalysisData = (data) => {
  if (!data) return;

  try {
    localStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Unable to cache analysis data:', error);
  }
};

export const loadAnalysisData = () => {
  try {
    const raw = localStorage.getItem(ANALYSIS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Unable to read cached analysis data:', error);
    return null;
  }
};

export const clearAnalysisData = () => {
  try {
    localStorage.removeItem(ANALYSIS_STORAGE_KEY);
  } catch (error) {
    console.warn('Unable to clear cached analysis data:', error);
  }
};
