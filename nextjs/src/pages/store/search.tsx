import { GetServerSidePropsContext } from 'next';

import Fuse from 'fuse.js';
import { pathsToTree } from 'utils/constants';
import { prisma } from 'utils/prisma';

const fuseOptions = {
    minMatchCharLength: 3,
    // includeScore: true,
    // includeMatches: true,
    threshold: 0.5,
    keys: ['part_no', 'name', 'decription'],
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const { s } = ctx.query;

    // get paths from db for categories
    const paths = await prisma.products.findMany({
        select: {
            path: true,
        },
        orderBy: {
            path: 'asc',
        },
        distinct: ['path'],
    });

    // guard against empty search or less than 3 characters
    if (!s || s.toString().length < 3)
        return { props: { products: [], categories: pathsToTree(paths) } };

    // get products from db then filter with fuse
    const query = await prisma.products.findMany({ where: { price: { not: 0 } } });
    const fuse = new Fuse(query, fuseOptions);
    const _products = fuse.search(s.toString()).map((el) => el.item);

    // convert decimal to number in products to fix serialization error
    const products = _products.map((product) => ({ ...product, price: Number(product.price) }));

    return {
        props: {
            products,
            categories: pathsToTree(paths),
            url: ['search'],
        },
    };
};

Search.layoutProps = {
    navbarProps: { activePage: 'store' },
    headerProps: {
        h1: 'DEMAC Store Search',
        h2: 'Buy original Siemens parts in Egypt!',
        showSeperator: true,
    },
} as LayoutProps;

// uses the same function as the store page
import Search from 'pages/store/[...url]';
export default Search;
