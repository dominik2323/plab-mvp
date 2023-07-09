import React, { useState } from "react";
import "./App.css";
import Homepage from "./Homepage";

export const ActivePageContext = React.createContext(null);

function App() {
  const [activePage, setActivePage] = useState(0);
  const [shouldUsePageToggler, setShouldUsePageToggler] = useState(true);
  return (
    <div className='App'>
      <ActivePageContext.Provider
        value={{
          activePage,
          setActivePage,
          shouldUsePageToggler,
          setShouldUsePageToggler,
        }}>
        <Homepage />
      </ActivePageContext.Provider>
    </div>
  );
}

export default App;
