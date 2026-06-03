import Address from "../models/AddressModel.js";
import User from "../models/UserModel.js";

const buildResponse = (data, message = "SUCCESS", extra = {}) => ({
  status: "OK",
  message,
  ...extra,
  data,
});

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const createAddress = async (userId, data) => {
  const { isDefault } = data;
  data.user = userId;

  if (isDefault) {
    await Address.updateMany({ user: userId }, { isDefault: false });
  }

  const newAddress = await Address.create(data);

  await User.findByIdAndUpdate(userId, {
    $push: { addresses: newAddress._id },
    ...(isDefault ? { defaultAddress: newAddress._id } : {})
  });

  return buildResponse(newAddress, "Address created successfully");
};

const updateAddress = async (userId, addressId, data) => {
  const { isDefault } = data;

  if (isDefault) {
    await Address.updateMany({ user: userId }, { isDefault: false });
  }

  const updatedAddress = await Address.findOneAndUpdate(
    { _id: addressId, user: userId },
    data,
    { new: true, runValidators: true }
  );

  if (!updatedAddress) {
    throw createHttpError(404, "Address not found");
  }

  if (isDefault) {
    await User.findByIdAndUpdate(userId, { defaultAddress: updatedAddress._id });
  }

  return buildResponse(updatedAddress, "Address updated successfully");
};

const getUserAddresses = async (userId) => {
  const addresses = await Address.find({ user: userId, isActive: true }).sort({ isDefault: -1, createdAt: -1 });
  return buildResponse(addresses);
};

const deleteAddress = async (userId, addressId) => {
  const address = await Address.findOneAndDelete({ _id: addressId, user: userId });
  if (!address) {
    throw createHttpError(404, "Address not found");
  }

  const update = { $pull: { addresses: addressId } };
  
  const user = await User.findById(userId);
  if (user && user.defaultAddress?.toString() === addressId.toString()) {
    const nextAddress = await Address.findOne({ user: userId, isActive: true });
    update.defaultAddress = nextAddress ? nextAddress._id : null;
    if (nextAddress) {
      await Address.findByIdAndUpdate(nextAddress._id, { isDefault: true });
    }
  }

  await User.findByIdAndUpdate(userId, update);

  return buildResponse(null, "Address deleted successfully");
};

export default {
  createAddress,
  updateAddress,
  getUserAddresses,
  deleteAddress,
};
