import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "utils/constants";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "utils/types";

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
    if (req.session.user) {
        res.json({
            isLoggedIn: true,
        });
    } else {
        res.json({
            isLoggedIn: false,
        });
    }
}