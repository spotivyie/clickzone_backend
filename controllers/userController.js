// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Atualizar perfil do usuário (por ID)
exports.updateUserProfile = async (req, res) => {
  try {
    // Prepara dados para atualizar
    const updateData = { ...req.body };

    // Se a senha foi enviada, faz hash
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    // Se arquivo de imagem foi enviado pelo multer, atualiza o caminho da imagem
    if (req.file) {
      // Corrige barras para padrão URL
      updateData.image = req.file.path.replace(/\\/g, '/');
    }

    // Atualiza usuário no banco (retorna novo documento)
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Buscar usuário por ID (exibe perfil)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todos usuários (só admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deletar usuário (só admin)
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ msg: 'Usuário não encontrado' });
    res.json({ msg: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
