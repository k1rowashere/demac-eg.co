import { NextPageContext,NextApiRequest, NextApiResponse } from 'next';
import nookies from 'nookies';
import { COOKIES_ATTRIBUTES } from './constants';


export const getCart = (ctx?: Pick<NextPageContext, 'req'> & Pick<NextPageContext, 'res'>): { [x: string]: number; } => {
    let { cart } = nookies.get(ctx);
    try {
        return JSON.parse(cart);
    } catch {
        nookies.set(ctx, 'cart', JSON.stringify({}), COOKIES_ATTRIBUTES);
        return {};
    }
};


export const appendCart = (id: string, count: number, ctx?:  Pick<NextPageContext, 'res'>) => {

    let cart = getCart(ctx);
    if (count) cart[id] = count; else delete cart[id];

    nookies.set(ctx, 'cart', JSON.stringify(cart), COOKIES_ATTRIBUTES);

    //returns new cart
    return cart;
}
