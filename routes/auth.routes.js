const { Router } = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = Router();

// /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Wrong Email').isEmail(),
    check('password', 'Minimum password length 6 characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect registration data',
        });
      }

      const { email, password } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: 'User already exists with this email' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword });

      await user.save();

      res.status(201).json({ message: 'User created' });
    } catch (error) {
      res.status(500).json({ message: 'Something wrong, try again' });
    }
  }
);

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Wrong Email').normalizeEmail().isEmail(),
    check('password', 'Minimum password length 6 characters')
      .isLength({
        min: 6,
      })
      .exists(),
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect login data',
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User is not found' });
      }

      const isMatchPassword = await bcrypt.compare(password, user.password);

      if (!isMatchPassword) {
        return res.stratus(400).json({ message: 'Invalid password' });
      }

      const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
        expiresIn: '1h',
      });
      res.json({ token, userId: user.id });
    } catch (error) {
      res.status(500).json({ message: 'Something wrong, try again' });
    }
  }
);

module.exports = router;
