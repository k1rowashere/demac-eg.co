
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from 'utils/constants';
import bcrypt from 'bcrypt';

import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'utils/types';

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse<User>) {
    //crude login checking

    const { username, password } = await req.body;

    const correct = username === 'admin' && await bcrypt.compare(password, process.env.ADMIN_HASH ?? '')

    if (correct) {
        req.session.user = {
            isLoggedIn: true,
        };
        await req.session.save();
    }

    return res.json({ isLoggedIn: correct });
}
