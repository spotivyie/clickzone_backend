const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar e validar token JWT, e carregar dados atuais do usuário
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Token não fornecido ou mal formatado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decodifica o token para obter o id do usuário
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca o usuário atualizado no banco (sem senha)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ msg: 'Usuário não encontrado' });
    }

    // Adiciona dados do usuário no request
    req.user = {
      id: user._id.toString(),
      isAdmin: user.isAdmin,
      name: user.name,
      email: user.email,
      image: user.image || null,
    };

    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido ou expirado' });
  }
};

// Middleware para permitir acesso apenas a admins
const isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ msg: 'Acesso negado. Admins apenas.' });
  }
  next();
};

// Middleware para permitir acesso se for dono do recurso ou admin
const isOwnerOrAdmin = (req, res, next) => {
  const userId = req.user?.id;
  const paramId = req.params.id;
  console.log("req.user.id:", req.user?.id);
  console.log("req.params.id:", req.params.id);

  if (req.user?.isAdmin || (userId && userId === paramId)) {
    return next();
  }
  return res.status(403).json({ msg: 'Acesso negado.' });
};

module.exports = { verifyToken, isAdmin, isOwnerOrAdmin };
