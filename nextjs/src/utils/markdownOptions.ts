import { Components } from 'react-markdown';
import { PluggableList } from 'react-markdown/lib/react-markdown';
import remarkUnwrapImages from 'remark-unwrap-images';
import remarkDirective from 'remark-directive';
import { remarkAttr2 } from 'utils/remarkAttr2';
import Image from 'next/future/image';

//markdown options:
const remarkPlugins: PluggableList = [remarkDirective, remarkAttr2, remarkUnwrapImages];
// const rehypePlugins = [rehypeRaw];
const components: Components = {
    img: ({ src, alt, width, height, loading }) => {
        const priority = loading === 'eager' ? true : false;
        return Image({
            width,
            height,
            src: src || '',
            alt: alt ?? '',
            style: { width: '100%', height: 'auto' },
            priority,
        });
    },
};
export const markdownOptions = { remarkPlugins, components };
