import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from 'utils/constants';
import type { User } from 'utils/types';

export default withIronSessionApiRoute(logoutRoute, sessionOptions);

function logoutRoute(req: NextApiRequest, res: NextApiResponse<User | {}>) {
    // guard against non-POST requests
    if (req.method !== 'POST') return res.status(404).json({});

    req.session.destroy();
    res.json({ isLoggedIn: false });
}
