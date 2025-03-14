import "./App.css";
import CasesSection from "./components/CasesSection";
import DrawerComp from "./components/DrawerComp";
import Header from "./components/Header";
import SearchSection from "./components/SearchSection";
import SearchResultComponent from "./components/SearchResultComponent";
import Sidebar from "./components/SideBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchBarComponent from "./components/SearchBarComponent";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <SearchBarComponent />

        <Routes>
          {/* <Route index element={<SearchSection />} /> */}
          <Route path="/search" element={<SearchResultComponent />} />
        </Routes>

        <CasesSection />
        <Sidebar />
        <DrawerComp />
      </div>
    </Router>
  );
}

export default App;
