import { Node } from "./Node";

export class Directory extends Node {
    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        this.childNodes.delete(cn);
    }

    /**
     * Override findNodes to search recursively through children
     */
    public findNodes(bn: string): Set<Node> {
        const result: Set<Node> = new Set<Node>();
        
        // Check if this directory matches
        if (this.getBaseName() === bn) {
            result.add(this);
        }
        
        // Search all children recursively
        for (const child of this.childNodes) {
            const childMatches = child.findNodes(bn);
            childMatches.forEach(node => result.add(node));
        }
        
        return result;
    }
}
