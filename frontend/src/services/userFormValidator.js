export async function registerFormValidator (firstname, lastname, email, password) {

    if(![firstname, lastname, email, password].every(v => v?.trim())) {
        throw new Error('All fields are required')
    }
}

export async function loginFormValidator (email, password) {

    if(![email, password].every(v => v?.trim())) {
        throw new Error('All fields are required')
    }
}
