var express = require('express');
var router = express.Router();
var response = require('../config/respon/index');
const { generateOTP } = require('../ultils');
const { db } = require("../config/firebase/servicesFirebase");

let docId;    
let phone;    

router.post('/', async function(req, res, next) {
  try {
    if (!req.body.phone) {
      return res.status(400).json({
        ...response,
        message: 'Phone is required'
      });
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(req.body.phone)) {
      return res.status(400).json({
        ...response,
        message: 'Invalid phone number format'
      });
    }

    const otp = generateOTP();
    const userData = {
      phone: req.body.phone,
      otp: otp,
      createdAt: new Date().toISOString()
    };

    // Kiểm tra nếu phone đã tồn tại thì update
    const usersRef = await db.collection("users")
      .where('phone', '==', req.body.phone)
      .get();


    if (!usersRef.empty) {
      // Nếu đã có thì update OTP
      const doc = usersRef.docs[0];
      docId = doc.id;
      await db.collection("users").doc(docId).update({
        otp: otp,
        createdAt: new Date().toISOString()
      });
    } else {
      // Nếu chưa có thì thêm mới
      const docRef = await db.collection("users").add(userData);
      docId = docRef.id;
    }
    phone = req.body.phone;

    return res.status(200).json({
      ...response,
      data: {
        userId: docId,
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

router.post('/validate', async function(req, res, next) {
  try {
    if (!req.body.phone) {
      return res.status(400).json({
        ...response,
        message: 'Phone is required'
      });
    }
    if(!req.body.code){
      return res.status(400).json({
        ...response,
        message: 'Code is required'
      });
    }
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(req.body.phone)) {
      return res.status(400).json({
        ...response,
        message: 'Invalid phone number format'
      });
    }

    const usersRef = await db.collection("users")
      .where('phone', '==', req.body.phone)
      .get();

    if (usersRef.empty) {
      return res.status(404).json({
        ...response,
        message: 'User not found'
      });
    }

    let isValid = false;
    usersRef.forEach((doc) => {
      const userData = doc.data();
      if (userData.otp === req.body.code) {
        isValid = true;
      }
    });

    let data = {
      id: docId,
      phone: phone
    }
    if (isValid) {
      return res.status(200).json({
        ...response,
        data: data,
        message: 'OTP validated successfully'
      });
    } else {
      return res.status(400).json({
        ...response,
        message: 'Invalid OTP code'
      });
    }

  } catch (error) {
    console.error('Validate OTP error:', error);
    return res.status(500).json({
      ...response,
      message: 'Internal server error'
    });
  }
});




module.exports = router;
