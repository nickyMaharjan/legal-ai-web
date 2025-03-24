import "./App.css";
import CasesSection from "./components/CasesSection";
import DrawerComp from "./components/DrawerComp";

//  import SearchSection from "./components/SearchSection";
import SearchResultComponent from "./components/SearchResultComponent";
// import Sidebar from "./components/SideBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatBotComponent from "./components/ChatBotComponent";
import HeaderComponent from "./components/HeaderComponent";
import SignInOutContainer from "./components/container/SignInOutContainer";


function App() {
  return (
    <Router>
      <div>
        <HeaderComponent />

        <Routes>
          {/* <Route index element={<SearchSection />} />  */}

          <Route path="/search" element={<SearchResultComponent />} />
          <Route path="/chatbot" element={<ChatBotComponent />} />
        </Routes>

        <CasesSection />
        <ChatBotComponent />

        {/* <Sidebar /> */}
        <DrawerComp />
        <SignInOutContainer />
      
      </div>
    </Router>
  );
}

export default App;
