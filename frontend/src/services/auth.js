import { registerFormValidator, loginFormValidator } from './userFormValidator' 




export async function register (firstName,lastName,email,password) {
    
    await registerFormValidator(firstName, lastName, email, password)
    const res = await fetch('http://localhost:3000/users/register', {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        })
    });
    if (res.status === 409 ) throw new Error('Email already exists!')
    if (!res.ok) throw new Error(res.statusText);


}



export async function login (email,password) {
    
    await loginFormValidator(email, password)
    const res = await fetch('http://localhost:3000/users/login', {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    localStorage.setItem(
        'user',
        JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        avatar: data.user.avatar
        })
    );
    return data.user
}