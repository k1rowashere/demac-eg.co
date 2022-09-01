import Link from 'next/link';
import { useMemo, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Collapse from 'react-bootstrap/Collapse';

//helper functions
function arrayEquals(a?: any[], b?: any[]) {
    if (a === undefined || b === undefined) return false;
    return a.length === b.length && a.every((val, index) => val === b[index]);
}

function isPartOfPath(thisPath?: any[], activePath?: any[]) {
    if (thisPath === undefined || activePath === undefined) return false;
    return (
        thisPath.length < activePath.length &&
        thisPath.every((el, index) => activePath[index] === el)
    );
}

type categories = {
    [x: string]: categories | {};
};

type CategoryItem = {
    prevPath: string[];
    name: string;
    level: number;
    currCategories: categories;
    activePath?: string[];
};

export default function CategoryItem({
    prevPath,
    name,
    level,
    currCategories,
    activePath,
}: CategoryItem) {
    const thisPath = useMemo(
        () => prevPath.concat([name.replaceAll(/\s/g, '-').toLowerCase()]),
        [prevPath, name]
    );
    const [expanded, setExpanded] = useState(level < 1 || isPartOfPath(thisPath, activePath));

    return useMemo(() => {
        const icons = ['bi bi-chevron-right', 'bi bi-chevron-down'];
        const hasChildren = Object.keys(currCategories).length === 0;
        const chevronHandle = () => {
            setExpanded(!expanded);
        };
        return (
            <>
                <ListGroup.Item
                    as='li'
                    className='text-truncate'
                    active={arrayEquals(activePath, thisPath)}
                    key={thisPath.toString()}
                >
                    {hasChildren ? (
                        <>
                            <i className='bi bi-dash text-muted' />
                            <Link href={thisPath.join('/')} passHref scroll={false}>
                                <a>{name}</a>
                            </Link>
                        </>
                    ) : (
                        <>
                            <i
                                role='button'
                                className={icons[Number(expanded)]}
                                onClick={chevronHandle}
                            />
                            <a href='#;' tabIndex={0} onClick={chevronHandle}>
                                {name}
                            </a>
                        </>
                    )}
                    {/* recurse over all children */}
                    <Collapse in={expanded}>
                        <div>
                            <ListGroup as='ul'>
                                {Object.entries(currCategories).map(([key, value]) => (
                                    <CategoryItem
                                        key={key}
                                        prevPath={thisPath}
                                        name={key}
                                        level={level + 1}
                                        currCategories={value}
                                        activePath={activePath}
                                    />
                                ))}
                            </ListGroup>
                        </div>
                    </Collapse>
                </ListGroup.Item>
            </>
        );
    }, [expanded, thisPath, name, level, currCategories, activePath]);
}
