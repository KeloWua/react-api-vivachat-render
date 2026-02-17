const express = require('express');
const router = express.Router()
const pool = require('../../db/pool');
// Create hash
const { hashPassword, comparePassword } = require('../middlewares/auth/encrypt');
// HASH END


router.get('/', async (req, res) => {
    const { rows } = await pool.query(`
        select * from users;
        `);
    res.json(rows);
});

router.post('/register', async (req, res) => {
    const { firstName,lastName,email,password } = req.body;
    const userExists = await pool.query(`
        SELECT * FROM users WHERE email = $1
        `, [email]);
    if (userExists.rows.length > 0) {
        return res.status(409).json({error: `Email addres already in use`})}
    //Create hash
    const hashedPassword = await hashPassword(password);

    const { rows } = await pool.query(`
        INSERT INTO users (
        first_name,
        last_name,
        email,
        password
        ) VALUES
        ($1, $2, $3, $4)
        RETURNING id
        `, [firstName,lastName,email,hashedPassword]);
        res.json(rows);
    
});


router.post('/login', async (req, res) => {
    const { email,password } = req.body;
    const { rows } = await pool.query(`
        SELECT u.id,
        u.password,
        concat(u.first_name ||' '|| u.last_name) as name,
        ui.avatar_url as avatar
        FROM users u
        LEFT JOIN user_info ui
        ON ui.user_id = u.id
        where u.email = $1
        `, [email]);
    if (!rows.length) {
        return res.status(401).json({ error: 'Email or password incorrect' });
    }

    const user = rows[0];

    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
        return res.status(401).json({ error: 'Email or password incorrect' });
    }
    res.json({ 
        ok: true, 
        user: {
            id: user.id,
            name: user.name,
            avatar: user.avatar
        }});
});

module.exports = router