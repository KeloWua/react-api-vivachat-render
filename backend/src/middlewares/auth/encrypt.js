const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const hash = await bcrypt.hash(password, 10)
    return hash
}

async function comparePassword(password, hashedPassword) {
    const isValid = await bcrypt.compare(password, hashedPassword)
    return isValid
}

module.exports = {
    hashPassword,
    comparePassword
};