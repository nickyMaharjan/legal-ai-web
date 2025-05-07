import "./App.css";
import CasesSection from "./components/CasesSection";
import DrawerComp from "./components/DrawerComp";
import SearchResultComponent from "./components/SearchResultComponent";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ChatBotComponent from "./components/ChatBotComponent";
import HeaderComponent from "./components/HeaderComponent";
import ProtectedLogin from "./components/ProtectedLogin";
import UploadFiles from "./components/UploadFiles";
import LoginModalComponent from "./components/LoginModalComponent";
import SignupModalComponent from "./components/SignupModalComponent";
import ViewDocs from "./components/ViewDocs";
import NewsSection from "./components/News";

function App() {
  return (
    <Router>
      <div>
        <HeaderComponent />

        <Routes>
          <Route
            path="/search"
            element={
              <ProtectedLogin>
                <SearchResultComponent />
              </ProtectedLogin>
            }
          />

          <Route
            path="/upload_document/"
            element={
              <ProtectedLogin>
                <UploadFiles />
              </ProtectedLogin>
            }
          />

          <Route path="/chatbot/" element={<ChatBotComponent />} />

          <Route path="/login" element={<LoginModalComponent />} />

          <Route path="/signup" element={<SignupModalComponent />} />
          <Route
            path="/ViewDocs"
            element={
              <ProtectedLogin>
                <ViewDocs />
              </ProtectedLogin>
            }
          />
           <Route
            path="/news"
            element={
             
                <NewsSection />
              
            }
          />
        </Routes>

        <CasesSection />
        <ChatBotComponent />

        <DrawerComp />
      </div>
    </Router>
  );
}

export default App;
