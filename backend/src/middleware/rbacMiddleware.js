import { ROLE_PERMISSIONS } from "../constants/permissions.js";
import Role from "../models/RoleModel.js";

export const requirePermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ status: "ERROR", message: "Unauthorized" });
      }

      // Check if user has direct permission
      if (
        req.user.permissions &&
        req.user.permissions.includes(requiredPermission)
      ) {
        return next();
      }

      // Check role-based permission
      const userRole = req.user.role;
      let rolePermissions = [];

      // Check if role is in DB
      const roleDoc = await Role.findOne({ name: userRole });
      if (roleDoc) {
        rolePermissions = roleDoc.permissions;
      } else {
        // Fallback to constants
        rolePermissions = ROLE_PERMISSIONS[userRole] || [];
      }

      // Super Admin and legacy isAdmin bypass
      if (
        userRole === "Admin" ||
        req.user.isAdmin ||
        rolePermissions.includes(requiredPermission)
      ) {
        return next();
      }

      return res.status(403).json({
        status: "ERROR",
        message: `Forbidden: Missing required permission: ${requiredPermission}`,
      });
    } catch (error) {
      return res.status(500).json({
        status: "ERROR",
        message: "Error checking permissions",
        error: error.message,
      });
    }
  };
};

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: "ERROR", message: "Unauthorized" });
    }

    if (
      !allowedRoles.includes(req.user.role) &&
      req.user.role !== "Admin" &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        status: "ERROR",
        message: "Forbidden: Insufficient role",
      });
    }

    next();
  };
};
