var express = require('express');
var router = express.Router();
const { db } = require("../config/firebase/servicesFirebase");

router.delete('/:id', async function(req, res) {
  try {
    const docId = req.params.id;
    console.log(docId);
    const docRef = db.collection("generated_posts").doc(docId);
    const doc = await docRef.get();
    const ideaRef = db.collection("generated_topic").doc(docId);
    const idea = await ideaRef.get();

    if (!doc.exists && !idea.exists) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await docRef.delete();
    await ideaRef.delete();

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting from Firebase:', error);
    return res.status(500).json({ message: 'Failed to delete post' });
  }
});

module.exports = router;