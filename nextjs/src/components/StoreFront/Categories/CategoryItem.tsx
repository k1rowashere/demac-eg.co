import Link from 'next/link';
import { useMemo, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Collapse from 'react-bootstrap/Collapse';

//helper functions
function arrayEquals(a: any[], b: any[]) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}

function isPartOfPath(thisPath: any[], activePath: any[]) {
    return thisPath.length < activePath.length && thisPath.every((el, index) => activePath[index] === el)
}

type categories = {
    [x: string]: categories | {};
}

type CategoryItem = { prevPath: string[], name: string, level: number, currCategories: categories, activePath: string[] }

export default function CategoryItem({ prevPath, name, level, currCategories, activePath }: CategoryItem) {
    const thisPath = prevPath.concat([name.replaceAll(/\s/g, '-').toLowerCase()]);
    const hasChildren = Object.keys(currCategories).length === 0;
    const [expanded, setExpanded] = useState(level < 1 || isPartOfPath(thisPath, activePath));
    
    return useMemo(() => {
        const chevronHandle = () => {setExpanded(!expanded)}
        const icons = ['bi bi-chevron-right', 'bi bi-chevron-down'];
        return <>
            <ListGroup.Item as="li" className='text-truncate' active={arrayEquals(activePath, thisPath)} key={thisPath.toString()}>
                {hasChildren
                    ? <i className='bi bi-dash text-muted' />
                    : <i role='button' className={icons[Number(expanded)]} onClick={chevronHandle} />
                }

                {!hasChildren
                    ? <a href='#;' tabIndex={0} onClick={chevronHandle}>{name}</a>
                    : <Link href={thisPath.join('/')} passHref scroll={false}><a>{name}</a></Link>
                }
                {/* recurse over all children */}
                <Collapse in={expanded}>
                    <div>
                        <ListGroup as="ul">
                            {Object.entries(currCategories)
                                .map(([key, value]) => <CategoryItem
                                    key={key}
                                    prevPath={thisPath}
                                    name={key}
                                    level={level + 1}
                                    currCategories={value}
                                    activePath={activePath}
                                />)}
                        </ListGroup>
                    </div>
                </Collapse>
            </ListGroup.Item>
        </>
    }, [expanded, activePath, currCategories, hasChildren, level, name, thisPath]);
}
