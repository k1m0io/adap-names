import { Node } from "./Node";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";

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
        try {
            const result: Set<Node> = new Set<Node>();
            
            // ERROR DETECTION: Check for invalid state
            const baseName = this.getBaseName();
            if (baseName === "") {
                throw new InvalidStateException("Directory has empty basename");
            }
            
            // Check if this directory matches
            if (baseName === bn) {
                result.add(this);
            }
            
            // Search all children recursively
            for (const child of this.childNodes) {
                const childMatches = child.findNodes(bn);
                childMatches.forEach(node => result.add(node));
            }
            
            return result;
        } catch (ex) {
            // At service boundary: wrap in ServiceFailureException
            if (ex instanceof InvalidStateException) {
                throw new ServiceFailureException("findNodes failed in directory", ex);
            }
            throw ex;
        }
    }
}
