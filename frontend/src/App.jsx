import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "../context/AuthContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import About from "./pages/About"
import Chat from "./pages/Chat"
import Login from "./pages/Login"
import Register from "./pages/Register"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <div className="min-h-screen bg-gray-700 flex flex-col">
         <Navbar/>
        <main className="flex-1 p-4 pt-14">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          </main>

        </div>
      </BrowserRouter>
    </AuthProvider>

  )
}
