import { Routes, Route, Navigate } from "react-router-dom";
import SendOtp from "./components/authentication/sendOtp";
import VerifyOtp from "./components/authentication/verifyOtp";
import SignIn from "./components/authentication/signIn";
import Dashboard from "./components/Dashboard/Home";
import Whiteboard from "./components/WhiteBoard/whiteBoard";
import ProtectedRoute from "./components/protectedRoute";
function App(){
  return (
    <div className="App">
      <Routes>
        <Route path="/send-otp" element={<SendOtp/>}/>
        <Route path="/" element={<Navigate to="/send-otp" />} />
        <Route path="/register" element={<VerifyOtp/>}/>
        <Route path="/login" element={<SignIn/>}/>
        <Route path="/home" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }/>
        <Route path="/whiteboard/:id" element={<Whiteboard/>}/>

      </Routes>
    </div>
  )
}

export default App;
