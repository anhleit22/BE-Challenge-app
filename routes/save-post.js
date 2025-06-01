var express = require('express');
var router = express.Router();
const { db } = require("../config/firebase/servicesFirebase");

router.post('/', async function(req, res, next) {
  try {
    const data = req.body;

    if (!data || !data.content || !data.social || !data.tone || !data.id_author) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // 🔍 Kiểm tra trùng dữ liệu
    const querySnapshot = await db.collection("generated_posts")
      .where("social", "==", data.social)
      .where("tone", "==", data.tone)
      .where("id_author", "==", data.id_author)
      .get();

    if (!querySnapshot.empty) {
      return res.status(200).json({
        message: 'Post already exists, skipping save.',
        existing: true
      });
    }

    // ✅ Nếu chưa có thì lưu mới
    const docRef = await db.collection("generated_posts").add(data);

    return res.status(200).json({
      message: 'Saved to Firebase successfully',
      id: docRef.id,
      existing: false
    });

  } catch (error) {
    console.error('Error saving to Firebase:', error);
    return res.status(500).json({ message: 'Failed to save to Firebase' });
  }
});

module.exports = router;
