import React, { useState } from 'react';
import Image from 'next/future/image';

type Props = {
    src: string;
    fallbackSrc: string;
    layout?: 'fixed' | 'fill' | 'intrinsic' | 'responsive';
    alt?: string;
    width?: number | string;
    height?: number | string;
    [x: string]: any;
};

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#eee" offset="20%" />
      <stop stop-color="#ddd" offset="50%" />
      <stop stop-color="#eee" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#eee" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
    typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

const ImageWithFallback = ({ src, fallbackSrc, width, height, alt = '', ...rest }: Props) => {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            src={imgSrc}
            width={width ?? 100}
            height={height ?? 100}
            sizes='100vw'
            alt={alt}
            onError={() => setImgSrc(fallbackSrc)}
            placeholder='blur'
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
            {...rest}
        />
    );
};

export default ImageWithFallback;
