export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 */
export interface Name {
    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    asString(delimiter?: string): string;

    /** 
     * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     */
    asDataString(): string;

    /**
     * Returns the delimiter character used by this Name instance
     */
    getDelimiterCharacter(): string;

    /**
     * Returns true, if number of components == 0; else false
     */
    isEmpty(): boolean;

    /**
     * Returns number of components in Name instance
     */
    getNoComponents(): number;

    /**
     * Returns the i-th component of the Name (masked)
     */
    getComponent(i: number): string;

    /**
     * Sets the i-th component of the Name (expects masked component)
     */
    setComponent(i: number, c: string): void;

    /**
     * Inserts a component at position i (expects masked component)
     */
    insert(i: number, c: string): void;

    /**
     * Appends a component (expects masked component)
     */
    append(c: string): void;

    /**
     * Removes the component at position i
     */
    remove(i: number): void;

    /**
     * Concatenates another Name to this Name
     */
    concat(other: Name): void;
}
