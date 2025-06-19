// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
    updateUserProfile,
    getUserById,
    getAllUsers,
    deleteUser
} = require('../controllers/userController');
const { verifyToken, isAdmin, isOwnerOrAdmin } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/users');
    },
    filename: (req, file, cb) => {
        cb(null, 'user-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Usuário pode atualizar seu próprio perfil
router.put('/:id', verifyToken, isOwnerOrAdmin, upload.single('image'), updateUserProfile);
// Usuário pode ver seu próprio perfil
router.get('/:id', verifyToken, isOwnerOrAdmin, getUserById);
// Admin pode listar todos os usuários
router.get('/', verifyToken, isAdmin, getAllUsers);
// Admin pode deletar qualquer usuário
router.delete('/:id', verifyToken, isAdmin, deleteUser);

module.exports = router;
