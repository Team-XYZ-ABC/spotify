const authRole = (roles = []) => {

    return (req, res, next) => {
        try {
            console.log(req.user)
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized - User not logged in"
                });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden - You don't have permission"
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });
        }
    };
};

export default authRole;