import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { SwitchTransition, Transition } from 'react-transition-group';
import { getCart, appendCart } from 'utils/cart';

export default function AddToCart({ id }: { id: string }) {
    const nodeRef = useRef<HTMLButtonElement>(null);
    const [productAdded, setProductAdded] = useState(false);

    useEffect(() => {
        setProductAdded(Boolean(getCart()[id]));
    }, [id]);

    const handleAddToCart = () => {
        appendCart(id, +!productAdded);
        setProductAdded(!productAdded);
    };

    const timeout = 100;
    const defaultStyle = {
        transition: `opacity ${timeout}ms ease-in-out, transform ${timeout}ms ease-in-out`,
        opacity: 0.5,
        transform: 'scale(0.8)',
    };

    const transitionStyles = {
        entering: { opacity: 1, transform: 'scale(1.2)' },
        entered: { opacity: 1, transform: 'scale(1)' },
        exiting: { opacity: 0.5, transform: 'scale(0.8)' },
        exited: { opacity: 0.5, transform: 'scale(0.8)' },
        unmounted: { opacity: 0.5, transform: 'scale(0.8)' },
    };

    return (
        <SwitchTransition mode='out-in'>
            <Transition
                nodeRef={nodeRef}
                key={id + (productAdded ? 'added' : 'not_added')}
                timeout={timeout}
                unmountOnExit
            >
                {(state) => (
                    <Button
                        ref={nodeRef}
                        style={{ ...defaultStyle, ...transitionStyles[state] }}
                        variant='outline-dark'
                        onClick={handleAddToCart}
                        active={productAdded}
                    >
                        {productAdded ? (
                            <>
                                <i className='bi bi-cart-check me-1' /> Item Added
                            </>
                        ) : (
                            <>
                                <i className='bi bi-cart-fill me-1' /> Add to Cart
                            </>
                        )}
                    </Button>
                )}
            </Transition>
        </SwitchTransition>
    );
}
