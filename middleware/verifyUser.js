import axios from 'axios';

export const verifyUser = async (req, res, next) => {
    const token = req.headers.authToken || req.headers['authtoken'] || req.headers['authorization'];

    if (!token) {
        return res.status(401).json({
            message: "User Not Found",
        });
    }

    try {
        const authApi = process.env.VERIFY_USER_API;
        const apiUrl = `${authApi}/api/auth/verifyUser`;

        const response = await axios.post(apiUrl, {}, {
            headers: {
                'Content-Type': 'application/json',
                'authToken': token,
            }
        });

        if (response.data.status !== 'success') {
            return res.status(401).json({
                status: 401,
                message: "User Not Found",
            });
        }

        req.user = response.data.data;
        next();
    } catch (error) {
        console.error('Auth verification error:', error.message);

        const status = error.response?.status || 500;
        const message = error.response?.data?.message || "Authentication Failed";

        return res.status(status).json({ message });
    }
};
