import React, { useState } from "react";
import "./App.css";
import Homepage from "./Homepage";
import {
  ActivePage,
  PageTogglerContext,
} from "./components/PageToggler/pageTogglerContext";

function App() {
  const [activePage, setActivePage] = useState<ActivePage>(0);
  const [shouldUsePageToggler, setShouldUsePageToggler] = useState(true);

  return (
    <div className='App'>
      <PageTogglerContext.Provider
        value={{
          activePage,
          setActivePage,
          shouldUsePageToggler,
          setShouldUsePageToggler,
        }}>
        <Homepage />
      </PageTogglerContext.Provider>
    </div>
  );
}

export default App;
