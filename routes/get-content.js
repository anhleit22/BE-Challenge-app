var express = require('express');
var router = express.Router();
var response = require('../config/respon/index');
const { generateOTP } = require('../ultils');
const { db } = require("../config/firebase/servicesFirebase");

let docId; // biến toàn cục, nhưng không cần thiết nếu bạn chỉ dùng trong request


router.post('/', async function(req, res, next) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        ...response,
        message: 'Phone is required'
      });
    }

    const usersRef = db.collection("users");
    const querySnapshot = await usersRef.where('phone', '==', phone).get();

    if (!querySnapshot.empty) {
      // Nếu có tồn tại user với số điện thoại này
      const userDoc = querySnapshot.docs[0];
      docId = userDoc.id; // Gán docId
    } else {
      return res.status(500).json({
      ...response,
      message: 'Not found user'
    });
    }

    const postsSnapshot = await db.collection("generated_posts").where("id_author", "==", docId).get();
    const posts = postsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
    }));
    const topicsSnapshot = await db
    .collection("generated_topic")
    .where("id_author", "==", docId)
    .get();

    const topics = topicsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));


    return res.status(200).json({
      ...response,
      data: {
        userId: docId,
        posts: posts, 
        topics: topics,
        message: 'OTP sent successfully'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      ...response,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
