const ensureRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    if (allowedRoles.length === 0) {
      return next();
    }

    const currentRole = req.user.role?.nombre || "";
    const permissions = req.user.role?.permisos || [];

    const hasRole = allowedRoles.includes(currentRole);
    const hasPermission = permissions.includes("ALL") || allowedRoles.some(role => permissions.includes(role));

    if (!hasRole && !hasPermission) {
      return res.status(403).json({
        message: "Acceso denegado"
      });
    }

    next();
  };
};

module.exports = ensureRole;
