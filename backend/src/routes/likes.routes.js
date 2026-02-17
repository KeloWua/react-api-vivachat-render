const express = require("express");
const router = express.Router();
const pool = require("../../db/pool");

router.post("/", async (req, res) => {
  const { postId, userId } = req.body;

  try {
    const { rows: inserted } = await pool.query(`
      INSERT INTO post_likes (post_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING *
    `, [postId, userId]);
    if (inserted.length === 0) {
      await pool.query(`
        DELETE FROM post_likes
        WHERE post_id = $1 AND user_id = $2
      `, [postId, userId]);
    }

    const { rows: total } = await pool.query(`
      SELECT COUNT(*) as count
      FROM post_likes
      WHERE post_id = $1
    `, [postId]);

    return res.json({
      totalLikes: Number(total[0].count)
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
