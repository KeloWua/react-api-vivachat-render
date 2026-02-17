import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from '../services/auth' 


export default function Register() {
    const navigate = useNavigate()
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { firstName, lastName, email, password, confirmPassword } = e.target

        if (password.value !== confirmPassword.value) {
            setErrorPassword("Password must match")
            return
        }
        setErrorPassword("")
        setErrorEmail("")
        try {
            await register(firstName.value, lastName.value, email.value, password.value)
            {/* Redirect to login if succesful register */}
            navigate('/login')
        } catch (error) {
            setErrorEmail(error.message)
        }
    }

    return (
            <>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img src="/public/logito-pink.svg" alt="Your Company" className="mx-auto h-15 w-auto" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Create your account</h2>
    </div>

    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form  onSubmit={handleSubmit}  className="space-y-6">
        <div>
            <label for="firstName" className="block text-sm/6 font-medium text-gray-100">First name</label>
            <div className="mt-2">
            <input id="firstName" type="text" name="firstName" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
            </div>
        </div>

                <div>
            <label for="lastName" className="block text-sm/6 font-medium text-gray-100">Last name</label>
            <div className="mt-2">
            <input id="lastName" type="text" name="lastName" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
            </div>
        </div>

        <div>
            <label for="email" className="block text-sm/6 font-medium text-gray-100">Email address</label>
            {errorEmail && (
            <p className="text-red-400 text-sm">{errorEmail}</p>)}
            <div className="mt-2">
            <input onChange={() => setErrorEmail("")} id="email" type="email" name="email" required autocomplete="email" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
            </div>
        </div>

        <div>
            <label for="password" className="block text-sm/6 font-medium text-gray-100">Password</label>
            {errorPassword && (
            <p className="text-red-400 text-sm">{errorPassword}</p>
            )}
            <div className="mt-2">
            <input onChange={() => setErrorPassword("")} id="password" type="password" name="password" required autocomplete="current-password" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
            
            </div>
        </div>

        
        <div>
            <label for="confirmPassword" className="block text-sm/6 font-small text-gray-100">Confirm password</label>
            <div className="mt-2">
            <input onChange={() => setErrorPassword("")} id="confirmPassword" type="password" name="confirmPassword" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
            </div>
        </div>

        <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign up</button>
        </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-400">
        Having issues?
        {/* CONTACT US SUPPOT MUST BE FINISHED */}
        <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300"> Contact us!</a>
        </p>
    </div>
    </div>
        </>
    )
}