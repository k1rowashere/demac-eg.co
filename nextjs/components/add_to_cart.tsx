import React, { useEffect, useState } from 'react';
import nookies from 'nookies';
import Button from 'react-bootstrap/Button';
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { COOKIES_ATTRIBUTES } from '../utils/constants';


const getCart = (): {[x: string]: number} => {
    let { cart = "{}" } = nookies.get();
    return JSON.parse(cart);
};


export default function AddToCart({ id, count = 1 }: { id: string, count?: number }) {
    const [productAdded, setProductAdded] = useState(false);

    useEffect(() => {
        setProductAdded(Boolean(getCart()[id]))
    }, [id]);

    const handleAddToCart = (): void => {
        let cart = getCart();

        if (productAdded) {
            delete cart[id];
        } else {
            cart[id] = count;
        }

        nookies.set(null, 'cart', JSON.stringify(cart), COOKIES_ATTRIBUTES);
        setProductAdded(!productAdded);
    };

    return (
        <SwitchTransition mode='out-in' >
            <CSSTransition
                key={id + (productAdded ? 'added' : 'not_added')}
                addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
                classNames='add-to-cart'
            >
                <Button variant='outline-dark' onClick={handleAddToCart} active={productAdded} >
                    {productAdded ? <>< i className='bi bi-cart-check me-1' /> Item Added </> : <><i className='bi-cart-fill me-1' /> Add to Cart </>}
                </Button>
            </CSSTransition>
        </SwitchTransition>
    );
}