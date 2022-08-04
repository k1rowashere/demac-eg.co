import React, { useState } from 'react';

interface Props {
    src: string; 
    fallbackSrc: string; 
    alt?: string; 
    [x: string]: any;
}

const ImageWithFallback = ({ src, fallbackSrc, alt,...rest}: Props) => {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <picture>
            <source srcSet={imgSrc} type='image/jpeg' />
            <img src={imgSrc} onError={() => { setImgSrc(fallbackSrc) }} alt={alt} {...rest} />
        </picture>
    );
};

export default ImageWithFallback;