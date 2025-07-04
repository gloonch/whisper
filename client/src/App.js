import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MobileContainer from "./MobileContainer";
import Navbar from "./components/Navbar";
import Us from "./pages/Us";
import Whispers from "./pages/Whispers";
import Dates from "./pages/Dates";
import Me from "./pages/Me";

function App() {
  return (
    <div className=" min-h-screen max-h-screen flex items-center justify-center">
      <Router>
        <MobileContainer>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Us />} />
                <Route path="/whispers" element={<Whispers />} />
                <Route path="/dates" element={<Dates />} />
                <Route path="/me" element={<Me />} />
              </Routes>
            </div>
            <Navbar />
          </div>
        </MobileContainer>
      </Router>
    </div>
  );
}

export default App;