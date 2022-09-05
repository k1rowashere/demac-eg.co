import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from 'utils/constants';
import bcrypt from 'bcryptjs';

import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'utils/types';

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse<User>) {
    // guard against non-POST requests
    if (req.method !== 'POST') return res.status(404).json({ isLoggedIn: false });

    // gurard against missing env variables
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_HASH) {
        return res.status(500).json({ isLoggedIn: false });
    }

    const { username, password } = await req.body;

    console.log(process.env.ADMIN_USERNAME, process.env.ADMIN_HASH);

    const loginSuccess =
        username === process.env.ADMIN_USERNAME &&
        (await bcrypt.compare(password, process.env.ADMIN_HASH));

    if (loginSuccess) {
        req.session.user = { isLoggedIn: true };
        await req.session.save();
    }

    return res.json({ isLoggedIn: loginSuccess });
}
