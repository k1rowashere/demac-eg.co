import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { getCart, appendCart } from '../utils/cart';


export default function AddToCart({ id, count = 1 }: { id: string, count?: number }) {
    const [productAdded, setProductAdded] = useState(false);

    useEffect(() => {
        setProductAdded(Boolean(getCart()[id]))
    }, []);

    const handleAddToCart = () => {
        appendCart(id, +!productAdded)
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