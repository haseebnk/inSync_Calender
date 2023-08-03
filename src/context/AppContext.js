import React, {createContext, useContext, useMemo, useState} from 'react';

export const AppContext = createContext();

export const AppProvider = ({children}) => {
  const [eventAdded, setEventAdded] = useState(0);

  const contextValues = useMemo(
    () => ({
      eventAdded,
      setEventAdded,
    }),
    [eventAdded, setEventAdded],
  );

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
