import React, { useState } from "react";
import "./App.css";
import Homepage from "./Homepage";

export const ActivePageContext = React.createContext(null);

function App() {
  const [activePage, setActivePage] = useState(0);
  return (
    <div className='App'>
      <ActivePageContext.Provider value={{ activePage, setActivePage }}>
        <Homepage />
      </ActivePageContext.Provider>
    </div>
  );
}

export default App;
