import React, { useRef, useState } from "react";
import "./App.css";
import Homepage from "./Homepage";
import {
  ActivePage,
  PageCarouselContext,
} from "./components/PageCarousel/pageCarouselContext";

function App() {
  const [activePage, setActivePage] = useState<ActivePage>(0);
  const [shouldUsePageToggler, setShouldUsePageToggler] = useState(true);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const isLayoutChanging = useRef<boolean>(false);

  return (
    <div className='App'>
      <PageCarouselContext.Provider
        value={{
          activePage,
          setActivePage,
          shouldUsePageToggler,
          setShouldUsePageToggler,
          carouselContainerRef,
          isLayoutChanging,
        }}>
        <Homepage />
      </PageCarouselContext.Provider>
    </div>
  );
}

export default App;
