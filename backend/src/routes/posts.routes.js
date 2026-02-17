const express = require("express");
const router = express.Router();
const pool = require("../../db/pool");

router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const { rows } = await pool.query(`
        SELECT 
          p.id as post_id,
          u.id as user_id,
          concat(u.first_name ||' '|| u.last_name) AS name,
          ui.avatar_url as avatar,
          p.content,
          p.image_url,
          p.likes,
          p.comments,
          p.created_at,
          EXISTS (
            SELECT 1
            FROM post_likes pl
            WHERE pl.post_id = p.id AND pl.user_id = $1
          ) AS user_liked
        FROM users u
        JOIN posts p
          ON u.id = p.user_id
        LEFT JOIN user_info ui
          ON u.id = ui.user_id
        ORDER BY p.created_at DESC;
        `, [userId]);
  if (!rows.length) {
    return res.status(404).json({ error: "No posts" });
  }
  res.status(200).json({
    ok: true,
    posts: rows.map((row) => ({
      id: row.post_id,
      user: {
        id: row.user_id,
        name: row.name,
        avatar: row.avatar,
      },
      content: row.content,
      image: row.image_url,
      likes: row.likes,
      comments: row.comments,
      createdAt: row.created_at,
      userLiked: row.user_liked
    })),
  });
});

router.post("/", async (req, res) => {
  const { userId, contentPost, contentImg } = req.body;
  const { rows } = await pool.query(
    `
        INSERT INTO posts (user_id, content, image_url)
        VALUES (
        $1, $2, $3
        ) RETURNING *
        `,
    [userId, contentPost, contentImg],
  );
  if (!rows.length) {
    return res.status(404).json({ error: "Could not post!" });
  }

  res.status(200).json({
    ok: true,
    post: rows,
  });
});
router.post("/likes", async (req, res) => {
  const { postId, userId } = req.body;

  try {
    await pool.query(
      `
      INSERT INTO post_likes (post_id, user_id)
      VALUES ($1, $2)
      `,
      [postId, userId]
    );

    return res.status(200).json({
      ok: true,
      liked: true,
    });

  } catch (error) {

    if (error.code === "23505") {
      await pool.query(
        `
        DELETE FROM post_likes 
        WHERE post_id = $1 AND user_id = $2
        `,
        [postId, userId]
      );

      return res.status(200).json({
        ok: true,
        liked: false,
        message: "User already liked this post",
      });
    }

    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete('/', async (req, res) => {
  const { postId, userId } = req.body;

  try {
    const result = await pool.query(`
      DELETE FROM posts
      WHERE id = $1 AND user_id = $2
    `, [postId, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Post not found or not owned by user'
      });
    }

    res.status(200).json({
      deletedPost: `${postId} deleted by user: ${userId}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
