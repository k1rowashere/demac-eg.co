import React, { useState } from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';

export default function ProjectDisplay({ renderedProjects }: { renderedProjects: string[] }) {
    return (
        <Row xs={1} xl={2} className='py-5'>
            <_Col
                renderedProjects={renderedProjects}
                marginLocation='marginBottom'
                itemRange={[0, ~~(renderedProjects.length / 2)]}
            />
            <div
                className='vr p-0 d-none d-xl-block'
                style={{ flex: 'none', marginLeft: '-1px', marginBlock: '25vh' }}
            />
            <_Col
                renderedProjects={renderedProjects}
                marginLocation='marginTop'
                itemRange={[~~(renderedProjects.length / 2)]}
            />
        </Row>
    );
}

function Project({ projectHTML }: { projectHTML: string }) {
    const [readmore, setReadmore] = useState(false);

    const handleReadMore = () => {
        setReadmore((curr) => !curr);
    };

    return (
        <Container as='article' className={'container my-4'}>
            {/* <Card className='bg-glass'>
                <Card.Body> */}
            <Collapse className='read-more' in={readmore}>
                <div dangerouslySetInnerHTML={{ __html: projectHTML }} />
            </Collapse>
            <Button
                // href={(md.match(/\{(#.*)\}/) || [])[1]}
                type='button'
                variant='outline-light'
                className='me-auto'
                onClick={handleReadMore}
            >
                {readmore ? 'Read less' : 'Read more...'}
            </Button>
            {/* </Card.Body>
            </Card> */}
            {/* {svg} */}
            <hr />
        </Container>
    );
}

type _Col = {
    renderedProjects: string[];
    marginLocation: 'marginBottom' | 'marginTop';
    itemRange: [start: number, end?: number];
};

function _Col({ renderedProjects, marginLocation, itemRange }: _Col) {
    return (
        <Col style={{ [marginLocation]: '35vh' }}>
            <Card className='bg-glass'>
                <Card.Body>
                    {renderedProjects.slice(...itemRange).map((project) => (
                        <Project key={project.slice(30, 40)} projectHTML={project} />
                    ))}
                </Card.Body>
            </Card>
        </Col>
    );
}
