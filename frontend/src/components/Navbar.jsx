import { NavLink } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../../context/AuthContext"


const navLink = (textColor = "text-white") => ({ isActive }) =>
  isActive
    ? "text-purple-300 font-bold"
    : `relative ${textColor} after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-purple-300 after:transition-all after:duration-300 hover:after:w-full`

const signInUpLink = ({ isActive }) =>
  isActive
    ? "bg-purple-300 text-purple-900 px-3 py-1 rounded font-semibold transition"
    : "bg-white text-purple-900 px-3 py-1 rounded transition hover:bg-gray-200 hover:scale-105"




export default function Navbar() {
  const { user, setUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
<nav className="fixed top-0 w-full z-20 bg-purple-900 border-b border-purple-800">
  <div className="max-w-7x1 mx-auto h-14 px-6 flex items-center text-white">

    {/* LOGO */}
    <NavLink to="/" className="flex items-center gap-2">
      <img src="/logito-pink.svg" className="h-8" />
      <span className="font-semibold text-lg hidden sm:block">
        ViVa Chat 
      </span>
    </NavLink>

    {/* LINKS DESKTOP */}
    <div className="hidden md:flex gap-6 ml-8">
      <NavLink to="/" className={navLink()}>Home</NavLink>
      <NavLink to="/about" className={navLink()}>About</NavLink>
      <NavLink to="/chat" className={navLink()}>Chat</NavLink>
    </div>

    <div className="flex-1" />

    {/* AUTH / AVATAR */}
    <div className="hidden md:flex gap-3 items-center">
      {user
      ? <>
        <img src={user.avatar? user.avatar : '/public/user-icon.svg'}
 className="w-8 h-8 rounded-full" />
        
        <NavLink to="/" className={signInUpLink}
        onClick={() => {
          localStorage.removeItem('user')
          setUser(null)}}
          >
          Logout</NavLink>
      </>
      : <>
        <NavLink to="/login" className={signInUpLink}>Login</NavLink>
        <NavLink to="/register" className={signInUpLink}>Register</NavLink>
      </>
      }


    </div>

    {/* HAMBURGUESA */}
    <button
      onClick={() => setMenuOpen(!menuOpen)}
      className="md:hidden ml-4"
    >
      ☰
    </button>
  </div>

  {/* MENÚ MOBILE DESPLEGABLE */}
  {menuOpen && (
    <div className="md:hidden bg-purple-800 px-6 py-4 space-y-4 text-white">
      <div className="flex flex-col space-y-4">
      <NavLink to="/" className={navLink()} onClick={() => setMenuOpen(false)}>Home</NavLink>
      <NavLink to="/about" className={navLink()} onClick={() => setMenuOpen(false)}>About</NavLink>
      <NavLink to="/chat" className={navLink()} onClick={() => setMenuOpen(false)}>Chat</NavLink>
  
      </div>
      <div className="pt-4 border-t border-purple-700 flex gap-3">
        {user
      ? <>
        <img src={user.avatar? user.avatar : '/public/user-icon.svg'}
 className="w-8 h-8 rounded-full" />
        <NavLink to="/" className={signInUpLink}
        onClick={() => {
          localStorage.removeItem('user')
          setUser(null)}}
          >
          Logout</NavLink>
      </>
      : <>
        <NavLink to="/login" className={signInUpLink} onClick={() => setMenuOpen(false)}>Login</NavLink>
        <NavLink to="/register" className={signInUpLink} onClick={() => setMenuOpen(false)}>Register</NavLink>
      </>
      }
      </div>
    </div>
  )}
</nav>

  )
}
