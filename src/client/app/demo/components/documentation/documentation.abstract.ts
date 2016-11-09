/**
 * Documentation Abstract class.
 * Extend this class when you need a new top level component (i.e. Getting Started).
 */
export abstract class DocumentationAbstract {
    public secondaryNavLinks: Array<Object>;

    constructor(secondaryNavLinks: Array<Object>) {
        this.secondaryNavLinks = secondaryNavLinks;
    }
}
