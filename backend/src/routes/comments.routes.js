const express = require('express');
const router = express.Router()
const pool = require('../../db/pool');


router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  const userId = req.query.userId
  const { rows } = await pool.query(`
        SELECT 
            pc.id,
            pc.post_id,
            pc.user_id,
            CONCAT(u.first_name || ' ' || u.last_name) as user_name,
            pc.content,
            pc.likes,
            pc.created_at,
            ui.avatar_url,
            EXISTS (
            SELECT 1
            FROM comment_likes cl
            WHERE cl.comment_id = pc.id AND cl.user_id = $1
          ) AS user_liked
        FROM post_comments pc
        LEFT JOIN user_info ui 
            ON pc.user_id = ui.user_id
        LEFT JOIN users u
            on u.id = ui.user_id
        WHERE pc.post_id = $2
        ORDER BY pc.created_at DESC;
        
        `, [userId, postId]);
  if (!rows.length) {
    return res.status(202).json({
      ok: true,
      postComments: []
    });
  }
  res.status(200).json({
    ok: true,
    postComments: rows.map(rows => ({
      commentId: rows.id,
      postId: rows.post_id,
      userId: rows.user_id,
      userName: rows.user_name,
      content: rows.content,
      likes: rows.likes,
      createdAt: rows.created_at,
      avatarUrl: rows.avatar_url,
      userLiked: rows.user_liked
    }))
  });


});


router.post("/like", async (req, res) => {
  const { commentId, userId } = req.body;

  try {
    const { rows: inserted } = await pool.query(`
      INSERT INTO comment_likes (comment_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING *
    `, [commentId, userId]);
    if (inserted.length === 0) {
      await pool.query(`
        DELETE FROM comment_likes
        WHERE comment_id = $1 AND user_id = $2
      `, [commentId, userId]);
    }

    const { rows: total } = await pool.query(`
      SELECT COUNT(*) as count
      FROM comment_likes
      WHERE comment_id = $1
    `, [commentId]);

    return res.json({
      totalLikes: Number(total[0].count)
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});





router.post('/', async (req, res) => {
  const { postId, userId, commentContent } = req.body;
  const { rows } = await pool.query(`
        INSERT INTO post_comments (post_id, user_id, content)
        VALUES (
        $1, $2, $3
        ) RETURNING *
        `, [postId, userId, commentContent]);
  if (!rows.length) {
    return res.status(404).json({ error: 'Could not post!' });
  }

  res.status(200).json({
    ok: true,
    postComment: rows
  })
});

router.delete('/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const result = await pool.query(`
        DELETE FROM post_comments
        WHERE id = $1
        RETURNING *
        `, [commentId]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Could not delete!' });
  }

  res.status(200).json(result.rows[0])
});



module.exports = router