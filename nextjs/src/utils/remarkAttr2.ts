import { visit, SKIP } from 'unist-util-visit';
import { Test } from 'unist-util-is';
import { h } from 'hastscript';
import { Plugin } from 'unified';
import { Root } from 'mdast';
import { TextDirective, LeafDirective } from 'mdast-util-directive';

export function remarkAttr2(): Plugin<any[], Root> {
    return (tree) => {
        const test: Test = (node) => {
            return node.type === 'textDirective' || node.type === 'leafDirective';
        };
        visit(tree, test, (node: TextDirective | LeafDirective, index, parent) => {
            if (node.name !== 'attr') return;

            const before = parent?.children[index ? index - 1 : -1];
            const data = node.data || (node.data = {});
            const hast = h(node.name, node.attributes);
            // if the element before the :attr{} is a text, apply the attributes to parent instead
            if (before?.type === 'text') {
                data.hProperties = { ...hast.properties };
                parent.data = data;
            } else {
                data.hProperties = { ...hast.properties };
                before.data = data;
            }

            parent.children.splice(index, 1);
            return [SKIP, index];
        });
    };
}
