import Link from 'next/link';
import { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Collapse from 'react-bootstrap/Collapse';

//helper functions
function arrayEquals(a: any[], b: any[]) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}

function isPartOfPath(thisPath: any[], activePath: any[]) {
    return thisPath.length < activePath.length && thisPath.every((el, index) => activePath[index] === el)
}

interface categories {
    [x: string]: categories | {};
}

export default function Categories({ categories, activePath }: { categories: categories, activePath: string[] }) {
    function CategoryItem(thisPath: string[], level: number, key: string, children: categories) {
        const hasChildren = Object.keys(children).length === 0;
        const icons = ['bi bi-chevron-right', 'bi bi-chevron-down'];
        const [expanded, setExpanded] = useState(level < 1 || isPartOfPath(thisPath, activePath));
        const chevronHandle = () => {
            setExpanded(!expanded);
        };

        return (
            <ListGroup.Item as="li" className='text-truncate' active={arrayEquals(activePath, thisPath)} key={thisPath.toString()}>
                {hasChildren ? <i className='bi bi-dash text-muted' /> : <i role='button' className={icons[Number(expanded)]} onClick={chevronHandle} style={{ transition: 'all .3s ease' }} />}

                {!hasChildren ? <a href='#;' tabIndex={0} onClick={chevronHandle}>{key}</a> : <Link href={thisPath.join('/')} passHref scroll={false}><a>{key}</a></Link>}
                {/* recurse over all children */}
                <Collapse in={expanded}>
                    <div>{jsxGen(children, thisPath, level + 1)}</div>
                </Collapse>
            </ListGroup.Item>
        );
    }

    // json tree to jsx tree
    function jsxGen(categories: categories, path: string[] = [], level = 0) {

        if (Object.keys(categories).length === 0) return <></>;

        let listItems = [];
        for (let [key, value] of Object.entries(categories)) {
            //get new path from old path + current item name
            let thisPath = path.concat([key.replaceAll(/\s/g, '-').toLowerCase()]);

            listItems.push(
                CategoryItem(thisPath, level, key, value)
            );
        }

        return (
            <ListGroup as="ul">
                {listItems}
            </ListGroup>
        );
    }

    return jsxGen(categories);
}