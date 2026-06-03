import Role from "../models/RoleModel.js";
import { ROLES, ROLE_PERMISSIONS } from "../constants/permissions.js";

const buildResponse = (data, message = "SUCCESS", extra = {}) => ({
  status: "OK",
  message,
  ...extra,
  data,
});

const initializeRoles = async () => {
  try {
    for (const [key, name] of Object.entries(ROLES)) {
      const permissions = ROLE_PERMISSIONS[name] || [];
      await Role.findOneAndUpdate(
        { name },
        { name, permissions },
        { upsert: true, new: true }
      );
    }
    console.log("Roles initialized successfully.");
  } catch (error) {
    console.error("Error initializing roles:", error);
  }
};

const getAllRoles = async () => {
  const roles = await Role.find().sort({ name: 1 });
  return buildResponse(roles);
};

export default {
  initializeRoles,
  getAllRoles,
};
