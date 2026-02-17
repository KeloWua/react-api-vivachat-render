const express = require('express');
const router = express.Router()
const pool = require('../../db/pool');




router.get('/', (req, res) => {
    res.json({ ok: true, message: 'API test Funca!!!'})
});


module.exports = router