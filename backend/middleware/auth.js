const jwt = require('jsonwebtoken');

const authMiddleware = (requiredRole = null) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
            req.user = decoded;
            
            if (requiredRole && req.user.role !== requiredRole && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Forbidden: Insufficient role' });
            }
            
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
};

module.exports = authMiddleware;
