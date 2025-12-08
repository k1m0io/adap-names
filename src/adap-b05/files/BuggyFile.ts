import { File } from "./File";
import { Directory } from "./Directory";

export class BuggyFile extends File {
    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    /**
     * FIXED: Fault injection removed
     * @returns base name correctly
     */
    protected doGetBaseName(): string {
        return this.baseName;  // FIXED: Don't set to ""
    }
}
