// session and local storage management

// caching temporal data for immediate use
export const setCache = (state) => {
  sessionStorage.setItem("CHPRCACHE", JSON.stringify(state));
};

export const getCache = () => {
  return JSON.parse(sessionStorage.getItem("CHPRCACHE"));
};

export const clearCache = () => {
  sessionStorage.removeItem("CHPRCACHE");
};

/*
 used for persisting state with sessionStorage
 https://egghead.io/lessons/javascript-redux-persisting-the-state-to-the-local-storage
*/
export const persistState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem("CHPRSTORE", serializedState);
  } catch (err) {
    // do nothing with this error just catching for safety
  }
};

export const getPersistedState = () => {
  try {
    const serializedState = sessionStorage.getItem("CHPRSTORE");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const clearPersistedState = () => {
  sessionStorage.removeItem("CHPRSTORE");
};
