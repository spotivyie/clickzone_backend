const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configuração do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/users');
    },
    filename: (req, file, cb) => {
        cb(null, 'user-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/register', upload.single('image'), register);
router.post('/login', login);

// Rota protegida
router.get('/me', verifyToken, (req, res) => {
    res.json({
        msg: 'Você está autenticado!',
        user: req.user
    });   
});

// Rota admin
router.get('/admin-area', verifyToken, isAdmin, (req, res) => {
    res.json({ msg: 'Você é admin e pode acessar esta área!' });
});

module.exports = router;
