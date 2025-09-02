import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MobileContainer from "./MobileContainer";
import Navbar from "./components/Navbar";
import Us from "./pages/Us";
import Whispers from "./pages/Whispers";
import Me from "./pages/Me";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className=" min-h-screen max-h-screen flex items-center justify-center">
      <Router>
        <ToastProvider>
          <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              <MobileContainer>
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto">
                    <Login />
                  </div>
                </div>
              </MobileContainer>
              } />

            <Route path="/signup" element={
              <MobileContainer>
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto">
                    <SignUp />
                  </div>
                </div>
              </MobileContainer>
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <MobileContainer>
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto">
                        <Us />
                      </div>
                      <Navbar />
                    </div>
                  </MobileContainer>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/whispers" 
              element={
                <ProtectedRoute>
                  <MobileContainer>
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto">
                        <Whispers />
                      </div>
                      <Navbar />
                    </div>
                  </MobileContainer>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/me" 
              element={
                <ProtectedRoute>
                  <MobileContainer>
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto">
                        <Me />
                      </div>
                      <Navbar />
                    </div>
                  </MobileContainer>
                </ProtectedRoute>
              } 
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AuthProvider>
        </ToastProvider>
      </Router>
    </div>
  );
}

export default App;