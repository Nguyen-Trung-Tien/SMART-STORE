import AddressService from "../services/AddressService.js";

const createAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const response = await AddressService.createAddress(userId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;
    if (!addressId) {
      return res.status(400).json({
        status: "ERR",
        message: "The addressId is required",
      });
    }
    const response = await AddressService.updateAddress(userId, addressId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getUserAddresses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const response = await AddressService.getUserAddresses(userId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;
    if (!addressId) {
      return res.status(400).json({
        status: "ERR",
        message: "The addressId is required",
      });
    }
    const response = await AddressService.deleteAddress(userId, addressId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

export default {
  createAddress,
  updateAddress,
  getUserAddresses,
  deleteAddress,
};
