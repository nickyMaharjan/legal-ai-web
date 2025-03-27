import "./App.css";
import CasesSection from "./components/CasesSection";
import DrawerComp from "./components/DrawerComp";

//  import SearchSection from "./components/SearchSection";
import SearchResultComponent from "./components/SearchResultComponent";
// import Sidebar from "./components/SideBar";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ChatBotComponent from "./components/ChatBotComponent";
import HeaderComponent from "./components/HeaderComponent";
import ProtectedLogin from "./components/ProtectedLogin";


function App() {
  return (
    <Router>
      <div>
        <HeaderComponent />
        

        <Routes>
          {/* <Route index element={<SearchSection />} />  */}

          <Route
            path="/search"
            element={
              <ProtectedLogin>
                <SearchResultComponent />
              </ProtectedLogin>
            }
          />
          <Route path="/chatbot/" element={<ChatBotComponent />} />

          {/* <Route path="/protected" element={<ProtectedLogin>a</ProtectedLogin>} /> */}
        </Routes>

        <CasesSection />
        <ChatBotComponent />

        {/* <Sidebar /> */}
        <DrawerComp />
      
      </div>
    </Router>
  );
}

export default App;
