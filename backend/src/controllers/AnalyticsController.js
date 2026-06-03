import AnalyticsService from "../services/AnalyticsService.js";

const getDashboardStats = async (req, res, next) => {
  try {
    const response = await AnalyticsService.getDashboardStats();
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

export default {
  getDashboardStats,
};