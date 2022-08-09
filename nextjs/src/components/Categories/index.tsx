import ListGroup from 'react-bootstrap/ListGroup';
import CategoryItem from './CategoryItem';

type categories = {
    [x: string]: categories | {};
}

export default function Categories({ categories, activePath }: { categories: categories, activePath: string[] }) {
    return (
        <ListGroup as='ul'>
            {Object.entries(categories)
                .map(([key, value]) => <CategoryItem
                    key={key}
                    prevPath={[]}
                    name={key}
                    level={0}
                    currCategories={value}
                    activePath={activePath}
                />)}
        </ListGroup>
    )

}