const express = require('express');
const router = express.Router()
const pool = require('../../../db/pool');


router.post('/', async (req, res) => {
    try {
        const { chatId, userId, message } = req.body;
        const { rows } = await pool.query(
            "INSERT INTO messages (chat_id, user_id, content) VALUES ($1, $2, $3) RETURNING id, created_at",
            [chatId, userId, message]
        );
        if (!rows.length) {
            return res.status(400).json('Message not created')

        }
        return res.status(200).json({
            id: rows[0].id,
            createdAt: rows[0].created_at
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json('Server error');
    }

});

router.get('/lists', async (req, res) => {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM chats"
        );
        if (!rows.length) {
            return res.status(400).json('No chats available')
        }
        return res.status(200).json(
            rows.map(list => ({
                id: list.id,
                name: list.name,
                type: list.type,
                createdAt: list.created_at
            })
            ))

    } catch (err) {
        console.error(err)
        return res.status(500).json('Server error');
    }

});

router.get('/:chatId', async (req, res) => {
    try {
        const { chatId } = req.params;

        const { rows } = await pool.query(`
            SELECT 
                m.id,
                m.user_id,
                CONCAT(u.first_name || ' ' || u.last_name) as name,
                m.content,
                m.created_at,
                ui.avatar_url
            FROM messages m
            JOIN users u
                ON m.user_id = u.id
            LEFT JOIN user_info ui 
                ON m.user_id = ui.user_id
            WHERE m.chat_id = $1
            ORDER BY m.created_at ASC
        `, [chatId]);

        if (!rows.length) {
            return res.status(200).json([]);
        }

        return res.status(200).json(
            rows.map(message => ({
                id: message.id,
                user: message.user_id,
                name: message.name,
                message: message.content,
                createdAt: message.created_at,
                avatar: message.avatar_url
            }))
        );

    } catch (err) {
        console.error(err);
        return res.status(500).json('Server error');
    }
});



module.exports = router