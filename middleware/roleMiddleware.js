const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if (!roles.includes(req.user.role)) {
            console.log(`[Auth Error] Role Mismatch. User: ${req.user.role}, Needed: ${roles}`);
            return res.status(403).json({
                message: `User role '${req.user.role}' is not authorized. Required: ${roles.join(', ')}`
            });
        }
        next();
    };
};

module.exports = { authorize };
