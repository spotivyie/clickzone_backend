const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getStats = async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      const productCount = await Product.countDocuments();
      const orderCount = await Order.countDocuments();

      const totalRevenue = await Order.aggregate([
        { $match: { status: 'pago' } },
        { $group: { _id: null, total: { $sum: "$payment.total" } } }
      ]);

      res.json({
        users: userCount,
        products: productCount,
        orders: orderCount,
        revenue: totalRevenue[0]?.total || 0
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

exports.getOrdersByMonth = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month);

    if (!month || month < 1 || month > 12) {
      return res.status(400).json({ error: "Mês inválido" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const orders = await Order.find({
      createdAt: { $gte: startDate, $lt: endDate },
      status: "pago",
    })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMonthlySummary = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const result = await Order.aggregate([
      {
          $match: {
              createdAt: { $gte: startDate, $lt: endDate },
              status: 'pago'
          }
      },
      {
          $group: {
              _id: { month: { $month: "$createdAt" } },
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: "$payment.total" }
          }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
