declare module 'g2a-foliate-js/ui/menu.js' {

    /**
     * Represents the configuration for a single menu section.
     * @template T The type of the value associated with each menu item.
     */
    type MenuItemConfig<T = any> = {
        /** An optional name to identify and access the menu group later. */
        name?: string;
        /** The accessible label for the menu group. */
        label: string;
        /** The type of menu group. Currently, only 'radio' is supported. */
        type: 'radio';
        /** An array of tuples, where each tuple is `[label: string, value: T]`. */
        items: [string, T][];
        /** A callback function executed when an item is clicked. */
        onclick: (value: T) => void;
    };

    /**
     * Represents a radio button group widget within the menu.
     * @template T The type of the value associated with each radio item.
     */
    type MenuRadioGroup<T = any> = {
        /** The root `<ul>` element of the radio group. */
        element: HTMLUListElement;
        /** Programmatically selects a radio item by its value. */
        select: (value: T) => void;
    };

    /**
     * The object returned by `createMenu`.
     */
    type Menu = {
        /** The root `<ul>` element of the entire menu. */
        element: HTMLUListElement;
        /** A map of named menu groups for easy access to their widgets. */
        groups: Record<string, MenuRadioGroup<any> | null>;
    };

    /**
     * Creates a menu element from a configuration array.
     * @param arr An array of menu item configurations.
     * @returns An object containing the menu's root element and a map of its named groups.
     */
    export function createMenu(arr: MenuItemConfig<any>[]): Menu;
}


declare module 'g2a-foliate-js/ui/tree.js' {

    /**
     * Represents a single item in the table of contents.
     * This is a recursive type, as `subitems` contains an array of `TOCItem`s.
     */
    export interface TOCItem {
        /** The text label displayed for the item. */
        label: string;
        /** The URL or fragment identifier this item links to. If omitted, the item is treated as a non-clickable container. */
        href?: string;
        /** An array of nested `TOCItem` objects, representing children of this item. */
        subitems?: TOCItem[];
    }

    /**
     * Represents the interactive Table of Contents view object.
     */
    export interface TOCView {
        /** The root `<ol>` element of the tree view. */
        element: HTMLOListElement;
        /** * A function to programmatically highlight the current item in the tree.
         * It expands parent nodes, scrolls the item into view, and sets ARIA attributes.
         * @param href The href of the item to set as current.
         */
        setCurrentHref: (href: string) => void;
    }

    /**
     * Creates a WAI-ARIA compliant tree view for a table of contents.
     * @param toc An array of `TOCItem` objects representing the root level of the TOC.
     * @param onclick A callback function that is executed when a clickable item in the tree is activated. It receives the item's `href`.
     * @returns A `TOCView` object containing the tree's DOM element and a method to update its state.
     */
    export function createTOCView(toc: TOCItem[], onclick: (href: string) => void): TOCView;
}


declare module 'g2a-foliate-js/vendor/fflate.js' {

    /**
     * Options for the `unzlibSync` decompression function.
     */
    export interface UnzlibOptions {
        /**
         * An optional pre-allocated buffer to write the decompressed data into.
         * If not provided, a new buffer will be created.
         */
        out?: Uint8Array;
        /**
         * An optional custom dictionary for decompression.
         */
        dictionary?: Uint8Array;
    }

    /**
     * Decompresses zlib-compressed data synchronously.
     * @param data The compressed data buffer.
     * @param options An optional object for configuring decompression.
     * @returns The decompressed data.
     */
    export function unzlibSync(data: Uint8Array, options?: UnzlibOptions): Uint8Array;
}


declare module 'g2a-foliate-js/vendor/zip.js' {

    // --- Common Interfaces ---

    /** Represents a generic reader with a readable stream. */
    export interface Reader {
        readable: ReadableStream<Uint8Array>;
        size: number;
        init(): Promise<void>;
    }

    /** Represents a generic writer with a writable stream. */
    export interface Writer {
        writable: WritableStream<Uint8Array>;
        init(): Promise<void>;
        getData?(): any;
    }

    /** Options for getting entries from a ZipReader. */
    export interface GetEntriesOptions {
        /** A callback function that is called as entries are read. */
        onprogress?: (index: number, total: number, entry: ZipEntry) => Promise<void> | void;
        /** The character encoding to use for filenames. Default is 'cp437'. */
        filenameEncoding?: string;
        /** The character encoding to use for comments. Default is 'cp437'. */
        commentEncoding?: string;
        /** Whether to extract data prepended to the ZIP file. */
        extractPrependedData?: boolean;
        /** Whether to extract data appended to the ZIP file. */
        extractAppendedData?: boolean;
    }

    /** Options for extracting data from a ZipEntry. */
    export interface GetDataOptions {
        /** A callback function to report progress. */
        onprogress?: (progress: number, total: number) => Promise<void> | void;
        /** The password for encrypted entries. */
        password?: string;
        /** Whether to check the signature of the decompressed data. */
        checkSignature?: boolean;
        /** An AbortSignal to cancel the operation. */
        signal?: AbortSignal;
        /** Whether to use Web Workers for decompression. */
        useWebWorkers?: boolean;
        /** Prevents the writer from being closed at the end of the operation. */
        preventClose?: boolean;
        /** If true, only checks if the password is correct without decompressing. */
        checkPasswordOnly?: boolean;
    }

    /** Represents a single entry (file or directory) within a ZIP archive. */
    export interface ZipEntry {
        /** The name of the file, including its path. */
        filename: string;
        /** The comment associated with the file. */
        comment: string;
        /** True if the entry is a directory. */
        directory: boolean;
        /** The compressed size of the file in bytes. */
        compressedSize: number;
        /** The uncompressed size of the file in bytes. */
        uncompressedSize: number;
        /** The last modification date of the file. */
        lastModDate: Date;
        /** The CRC-32 signature of the uncompressed data. */
        signature: number;
        /** True if the file is encrypted. */
        encrypted: boolean;
        /** True if the file uses the traditional ZipCrypto encryption. */
        zipCrypto: boolean;

        /**
         * Decompresses the entry's data and writes it to the provided writer.
         * @param writer The writer to which the data will be written.
         * @param options Options for decompression.
         * @returns A promise that resolves with the result of the writer's `getData()` method, if it exists.
         */
        getData(writer: Writer, options?: GetDataOptions): Promise<any>;

        /**
         * Decompresses the entry's data and returns it as an ArrayBuffer.
         * @param options Options for decompression.
         */
        arrayBuffer(options?: GetDataOptions): Promise<ArrayBuffer>;
    }

    /** Configuration options for the zip.js library. */
    export interface ZipConfiguration {
        /** The base URL for locating worker scripts. */
        baseURL?: string;
        /** The size of data chunks to process. */
        chunkSize?: number;
        /** The maximum number of web workers to use. */
        maxWorkers?: number;
        /** Timeout in milliseconds before terminating an idle worker. */
        terminateWorkerTimeout?: number;
        /** Whether to use CompressionStream/DecompressionStream APIs. */
        useCompressionStream?: boolean;
        /** Whether to use Web Workers for compression/decompression. */
        useWebWorkers?: boolean;
        /** Paths to the worker scripts for deflation and inflation. */
        workerScripts?: {
            deflate?: string[];
            inflate?: string[];
        };
    }

    // --- Exported Classes and Functions ---

    /** A Reader that reads data from a Blob. */
    export class BlobReader implements Reader {
        constructor(blob: Blob);
        size: number;
        readable: ReadableStream<Uint8Array>;
        init(): Promise<void>;
    }

    /** A Writer that builds a Blob. */
    export class BlobWriter implements Writer {
        constructor(contentType?: string);
        writable: WritableStream<Uint8Array>;
        init(): Promise<void>;
        getData(): Promise<Blob>;
    }

    /** A Writer that builds a string. */
    export class TextWriter implements Writer {
        constructor(encoding?: string);
        writable: WritableStream<Uint8Array>;
        init(): Promise<void>;
        getData(): Promise<string>;
    }

    /**
     * A class for reading ZIP archives.
     */
    export class ZipReader {
        constructor(reader: Reader | Blob, options?: any);

        /**
         * Returns an array of all entries in the ZIP file.
         * @param options Options for reading entries.
         */
        getEntries(options?: GetEntriesOptions): Promise<ZipEntry[]>;

        /**
         * Returns an async generator that yields each entry in the ZIP file.
         * @param options Options for reading entries.
         */
        getEntriesGenerator(options?: GetEntriesOptions): AsyncGenerator<ZipEntry>;

        /** Closes the ZIP reader and releases resources. */
        close(): Promise<void>;

        /** Data found before the ZIP structure. */
        prependedData?: Uint8Array;
        /** Data found after the ZIP structure. */
        appendedData?: Uint8Array;
        /** The global comment of the ZIP archive. */
        comment?: Uint8Array;
    }

    /**
     * Configures global settings for the zip.js library.
     * @param options The configuration options.
     */
    export function configure(options: ZipConfiguration): void;
}


declare module 'g2a-foliate-js/comic-book.js' {

    /** A simplified representation of a file entry within an archive. */
    interface ComicBookEntry {
        filename: string;
    }

    /** The input object required by the `makeComicBook` function. */
    interface MakeComicBookInput {
        /** An array of file entries from the archive. */
        entries: ComicBookEntry[];
        /** An async function to load a file entry as a Blob. */
        loadBlob: (name: string) => Promise<Blob>;
        /** A function to get the size of a file entry in bytes. */
        getSize: (name: string) => number;
    }

    /** Represents a single section (page) in the comic book. */
    interface BookSection {
        id: string;
        load: () => Promise<string>; // Returns an object URL for an HTML page
        unload: () => void;
        size: number;
    }

    /** Represents a single item in the table of contents. */
    interface BookTOCItem {
        label: string;
        href: string;
    }

    /** The book object format returned by `makeComicBook`. */
    interface ComicBook {
        /** Asynchronously returns the cover image as a Blob. */
        getCover: () => Promise<Blob>;
        /** Book metadata. */
        metadata: {
            title: string;
        };
        /** An array of sections, where each section is an image page. */
        sections: BookSection[];
        /** The table of contents, mapping labels to page hrefs. */
        toc: BookTOCItem[];
        /** Rendition properties for the reader UI. */
        rendition: {
            layout: 'pre-paginated';
        };
        /** Resolves an href to its corresponding section index. */
        resolveHref: (href: string) => { index: number };
        /** Splits an href into a base path and a fragment identifier. */
        splitTOCHref: (href: string) => [string, string | null];
        /** Gets the relevant fragment from a loaded section's document. */
        getTOCFragment: (doc: Document) => HTMLElement;
        /** Cleans up resources, like revoking object URLs. */
        destroy: () => void;
    }

    /**
     * Creates a book object from a set of comic book entries.
     * @param input An object containing the entries and functions to access them.
     * @param file The original comic book file (e.g., .cbz, .cbr), used for metadata.
     * @returns A `ComicBook` object.
     */
    export function makeComicBook(input: MakeComicBookInput, file: File): ComicBook;
}


declare module 'g2a-foliate-js/dict.js' {

    /** An async function that decompresses a gzipped data chunk. */
    type InflateFunction = (data: Uint8Array) => Promise<Uint8Array>;

    /** The result of a successful lookup in a Dictd dictionary. */
    export interface DictdLookupResult {
        word: string;
        /** * An array where the first element is the data type ('m' for markup)
         * and the second is a promise resolving to the definition data.
         */
        data: ['m', Promise<Uint8Array>];
    }

    /** The result of a successful lookup in a StarDict dictionary. */
    export interface StarDictLookupResult {
        word: string;
        /** An array of tuples, where each tuple is [type, data] based on `sametypesequence` from the .ifo file. */
        data: [string, Uint8Array][];
    }

    /**
     * A class for reading the Dictd dictionary format.
     * Note: This class appears to be missing a public method to load the index file.
     */
    export class DictdDict {
        /**
         * Loads the compressed dictionary data file (.dz).
         * @param file The .dz file as a Blob or File.
         * @param inflate An async function to decompress gzipped data chunks.
         */
        loadDict(file: Blob, inflate: InflateFunction): Promise<void>;

        /**
         * Looks up a word in the dictionary.
         * @param query The word to look up.
         * @returns A promise that resolves to an array of matching definitions.
         */
        lookup(query: string): Promise<DictdLookupResult[]>;
    }

    /**
     * A class for reading the StarDict dictionary format.
     */
    export class StarDict {
        /** Information parsed from the .ifo file, available after `loadIfo` completes. */
        ifo: Record<string, string>;

        /**
         * Loads and parses the information file (.ifo).
         * @param file The .ifo file as a Blob or File.
         */
        loadIfo(file: Blob): Promise<void>;

        /**
         * Loads the compressed dictionary data file (.dict.dz).
         * @param file The .dict.dz file as a Blob or File.
         * @param inflate An async function to decompress gzipped data chunks.
         */
        loadDict(file: Blob, inflate: InflateFunction): Promise<void>;

        /**
         * Loads the dictionary index file (.idx).
         * @param file The .idx file as a Blob or File.
         */
        loadIdx(file: Blob): Promise<void>;

        /**
         * Loads the synonyms index file (.syn), if available.
         * @param file The optional .syn file as a Blob or File.
         */
        loadSyn(file?: Blob): Promise<void>;

        /**
         * Looks up a word in the dictionary.
         * @param query The word to look up.
         * @returns A promise that resolves to an array of matching definitions.
         */
        lookup(query: string): Promise<StarDictLookupResult[]>;

        /**
         * Finds synonyms for a word.
         * @param query The word to find synonyms for.
         * @returns A promise that resolves to an array of matching synonym definitions.
         */
        synonyms(query: string): Promise<StarDictLookupResult[]>;
    }
}


declare module 'g2a-foliate-js/epubcfi.js' {

    // --- Core CFI Types ---

    /** Represents a single step in a CFI path. */
    export interface CfiPart {
        index: number;
        id?: string;
        offset?: number;
        temporal?: number;
        spatial?: number[];
        text?: string[];
        side?: string;
    }

    /** Represents a complete CFI path, potentially with indirections (`!`). */
    export type CfiPath = CfiPart[][];

    /** Represents a CFI range, with a common parent and distinct start/end paths. */
    export interface CfiRange {
        parent: CfiPath;
        start: CfiPath;
        end: CfiPath;
    }

    /** Represents a parsed CFI, which can be either a simple path or a range. */
    export type ParsedCfi = CfiPath | CfiRange;

    // --- Exported Functions and Variables ---

    /** A RegExp to test if a string is a valid CFI. */
    export const isCFI: RegExp;

    /**
     * Joins multiple CFI strings using the indirection operator (`!`).
     * @param cfis The CFI strings to join.
     * @returns A new CFI string with indirections.
     */
    export function joinIndir(...cfis: string[]): string;

    /**
     * Parses a CFI string into its structured representation.
     * @param cfi The CFI string to parse.
     * @returns The parsed CFI object.
     */
    export function parse(cfi: string): ParsedCfi;

    /**
     * Collapses a CFI range into a single CFI path pointing to its start or end.
     * @param cfi The CFI string or parsed CFI object.
     * @param toEnd If true, collapses to the end of the range; otherwise, to the start.
     * @returns The collapsed CFI path.
     */
    export function collapse(cfi: string | ParsedCfi, toEnd?: boolean): CfiPath;

    /**
     * Compares two CFIs to determine their order in the document.
     * @param a The first CFI.
     * @param b The second CFI.
     * @returns -1 if a < b, 0 if a == b, 1 if a > b.
     */
    export function compare(a: string | ParsedCfi, b: string | ParsedCfi): -1 | 0 | 1;

    /**
     * Generates a CFI string from a DOM Range object.
     * @param range The DOM Range.
     * @param filter An optional node filter function (similar to TreeWalker's acceptNode).
     * @returns The corresponding CFI string.
     */
    export function fromRange(range: Range, filter?: (node: Node) => number): string;

    /**
     * Creates a DOM Range object from a CFI.
     * @param doc The document to create the range in.
     * @param cfi The CFI string or parsed CFI object.
     * @param filter An optional node filter function.
     * @returns The corresponding DOM Range.
     */
    export function toRange(doc: Document, cfi: string | ParsedCfi, filter?: (node: Node) => number): Range;

    /**
     * Quickly generates CFIs for a sorted array of elements that share the same parent.
     * @param elements A sorted array of sibling elements.
     * @returns An array of CFI strings corresponding to each element.
     */
    export function fromElements(elements: Element[]): string[];

    /**
     * Resolves a CFI to its corresponding DOM Element.
     * @param doc The document to search in.
     * @param cfi The CFI string or parsed CFI object.
     * @returns The resolved DOM Node, or null if not found.
     */
    export function toElement(doc: Document, cfi: string | ParsedCfi): Node | null;

    /** Utility functions for creating and parsing "fake" CFIs for simple chapter indices. */
    export const fake: {
        /** Creates a CFI-like string from a zero-based chapter index. */
        fromIndex: (index: number) => string;
        /** Extracts a zero-based chapter index from a parsed CFI path. */
        toIndex: (cfiPath: CfiPath) => number;
    };

    /**
     * Converts a Calibre position string into a standard EPUB CFI.
     * @param pos The Calibre position string.
     */
    export function fromCalibrePos(pos: string): string;

    /**
     * Converts a Calibre highlight object into a standard EPUB CFI range.
     * @param highlight The Calibre highlight object.
     */
    export function fromCalibreHighlight(highlight: { spine_index: number; start_cfi: string; end_cfi: string; }): string;
}


declare module 'g2a-foliate-js/epub.js' {
    import type * as CFI from 'g2a-foliate-js/epubcfi.js';

    // --- Helper Types ---

    /**
     * Represents an item in the EPUB manifest.
     */
    export interface ManifestItem {
        href: string;
        id: string;
        mediaType: string;
        properties?: string[];
        mediaOverlay?: string;
    }

    /**
     * Represents an item in the EPUB spine.
     */
    export interface SpineItem {
        idref: string;
        id: string | null;
        linear: string | null;
        properties?: string[];
    }

    /**
     * Represents a recursive item in a navigation list (TOC, Page List, etc.).
     */
    export interface NavItem {
        label: string;
        href: string | null;
        subitems: NavItem[] | null;
    }

    /**
     * Represents an item in the landmarks navigation list.
     */
    export interface LandmarkItem extends NavItem {
        type?: string[];
    }

    /**
     * Represents a contributor to the publication (author, editor, etc.).
     */
    export interface Contributor {
        name: string | Record<string, string>;
        sortAs?: string | Record<string, string>;
        role?: string[];
        identifier?: string;
    }

    /**
     * Represents a collection or series the publication belongs to.
     */
    export interface Collection {
        name: string | Record<string, string>;
        position?: number;
    }

    /**
     * Represents the parsed metadata of the EPUB file, aligned with the Web Publication Manifest.
     */
    export interface Metadata {
        title?: string | Record<string, string>;
        identifier?: string;
        language?: string[];
        subtitle?: string;
        sortAs?: string;
        author?: Contributor[];
        translator?: Contributor[];
        editor?: Contributor[];
        artist?: Contributor[];
        illustrator?: Contributor[];
        colorist?: Contributor[];
        narrator?: Contributor[];
        contributor?: Contributor[];
        publisher?: Contributor;
        published?: string;
        modified?: string;
        description?: string;
        belongsTo?: {
            collection?: Collection[];
            series?: Collection[];
        };
        rights?: string;
        source?: string;
    }

    /**
     * Represents the EPUB 3 rendition properties.
     */
    export interface Rendition {
        layout?: 'reflowable' | 'pre-paginated';
        spread?: 'none' | 'landscape' | 'portrait' | 'both' | 'auto';
        orientation?: 'auto' | 'landscape' | 'portrait';
        flow?: 'auto' | 'paginated' | 'scrolled-continuous' | 'scrolled-doc';
    }

    /**
     * Represents a single section (chapter) of the book.
     */
    export interface Section {
        /** The unique identifier for the section, typically its href. */
        id: string;
        /** Asynchronously loads the section's content and returns an object URL. */
        load: () => Promise<string | null>;
        /** Unloads the section and revokes its object URL to free up memory. */
        unload: () => void;
        /** Asynchronously loads and parses the section's source into a DOM Document. */
        createDocument: () => Promise<Document>;
        /** The size of the section's content in bytes. */
        size: number;
        /** The base CFI for this section. */
        cfi: string;
        /** The value of the `linear` attribute from the spine. */
        linear: string | null;
        /** The calculated page-spread property for this section. */
        pageSpread?: 'left' | 'right' | 'center';
        /** A function to resolve a relative href against this section's base URL. */
        resolveHref: (href: string) => string;
        /** The manifest item for the associated media overlay, if any. */
        mediaOverlay: ManifestItem | null;
    }

    /** A custom event dispatched during media overlay playback. */
    export interface MediaOverlayHighlightEvent extends CustomEvent {
        detail: {
            text: string;
            begin: number;
            end: number;
        };
    }

    /**
     * Controls playback of EPUB Media Overlays (SMIL).
     */
    export interface MediaOverlay extends EventTarget {
        /** Starts playback from a specific section. */
        start(sectionIndex: number, filter?: (item: any, index: number, allItems: any[]) => boolean): Promise<void>;
        /** Pauses playback. */
        pause(): void;
        /** Resumes playback. */
        resume(): void;
        /** Stops playback and releases audio resources. */
        stop(): void;
        /** Skips to the previous phrase. */
        prev(): void;
        /** Skips to the next phrase. */
        next(): void;
        /** Sets the audio volume. */
        setVolume(volume: number): void;
        /** Sets the playback rate. */
        setRate(rate: number): void;
        addEventListener(type: 'highlight' | 'unhighlight', listener: (event: MediaOverlayHighlightEvent) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: 'error', listener: (event: CustomEvent<Error>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    }

    /**
     * Input options for the EPUB constructor.
     */
    export interface EpubConstructorOptions {
        /** An async function to load a file from the archive as text. */
        loadText: (path: string) => Promise<string | null>;
        /** An async function to load a file from the archive as a Blob. */
        loadBlob: (path: string) => Promise<Blob | null>;
        /** A function to get the size of a file in the archive. */
        getSize: (path: string) => number;
        /** An optional async function to compute a SHA-1 hash for deobfuscation. */
        sha1?: (str: string) => Promise<Uint8Array>;
    }

    // --- EPUB Class ---

    export class EPUB {
        constructor(options: EpubConstructorOptions);

        /** Metadata of the EPUB file. Available after `init()` resolves. */
        metadata: Metadata;
        /** Rendition properties of the EPUB file. Available after `init()` resolves. */
        rendition: Rendition;
        /** Media overlay properties. Available after `init()` resolves. */
        media: { duration?: number };
        /** An array of sections representing the book's content in spine order. Available after `init()` resolves. */
        sections: Section[];
        /** The table of contents. Available after `init()` resolves. */
        toc: NavItem[];
        /** The page list, if available. Available after `init()` resolves. */
        pageList: NavItem[];
        /** The list of landmarks, if available. Available after `init()` resolves. */
        landmarks: LandmarkItem[];
        /** The page progression direction ('ltr', 'rtl', or null). Available after `init()` resolves. */
        dir: string | null;
        /** An EventTarget for intercepting and transforming loaded resources. */
        transformTarget: EventTarget;

        /**
         * Parses the EPUB container and package documents to initialize the book object.
         * @returns A promise that resolves to the initialized EPUB instance.
         */
        init(): Promise<this>;

        /**
         * Loads the source of a manifest item as a DOM Document.
         * @param item A manifest item.
         */
        loadDocument(item: ManifestItem): Promise<Document>;

        /**
         * Creates a `MediaOverlay` controller for synchronized audio playback.
         */
        getMediaOverlay(): MediaOverlay;

        /**
         * Resolves a CFI string to a location in the book.
         * @param cfi The EPUB CFI string.
         * @returns An object with the section index and an anchor function to get the DOM Range.
         */
        resolveCFI(cfi: string): { index: number; anchor: (doc: Document) => Range; };

        /**
         * Resolves an href to a location in the book.
         * @param href The href, which may include a fragment identifier.
         * @returns An object with the section index and an anchor function to get the target element.
         */
        resolveHref(href: string): { index: number; anchor: (doc: Document) => Element | 0 | null; } | null;

        /**
         * Splits an href into its path and fragment identifier components.
         * @param href The href to split.
         */
        splitTOCHref(href: string): string[];

        /**
         * Finds a fragment identifier (ID) within a given document.
         * @param doc The document to search in.
         * @param id The ID to find.
         */

        getTOCFragment(doc: Document, id: string): Element | null;

        /**
         * Checks if a URI is external to the EPUB container.
         * @param uri The URI to check.
         */
        isExternal(uri: string): boolean;

        /**
         * Retrieves the cover image of the book.
         * @returns A promise that resolves to a Blob, or null if no cover is found.
         */
        getCover(): Promise<Blob | null>;

        /**
         * Retrieves and parses Calibre bookmarks, if present.
         */
        getCalibreBookmarks(): Promise<any>;

        /**
         * Destroys the EPUB instance, revoking all object URLs to free memory.
         */
        destroy(): void;
    }
}


declare module 'g2a-foliate-js/fb2.js' {

    /**
     * Represents a person (author, translator, etc.) in the FB2 metadata.
     * Can be a simple string (e.g., a nickname) or a structured object.
     */
    export type FB2Person = string | {
        name: string;
        sortAs: string | null;
    };

    /**
     * Represents the parsed metadata of the FB2 file.
     */
    export interface FB2Metadata {
        title: string;
        identifier: string;
        language: string;
        author: FB2Person[];
        translator: FB2Person[];
        contributor: (FB2Person & { role: 'bkp' })[];
        publisher: string;
        published: string | null;
        modified: string | null;
        description: string | null;
        subject: string[];
    }

    /**
     * Represents a single section of the FB2 book.
     */
    export interface FB2Section {
        /** The numeric index of the section. */
        id: number;
        /** A function that returns an object URL for the section's content. */
        load: () => string;
        /** A function that creates a DOM Document from the section's content. */
        createDocument: () => Document;
        /** The approximate size of the section's content in bytes. */
        size: number;
        /** The linear property, typically 'no' for non-primary content like notes. */
        linear?: 'no';
    }

    /**
     * Represents an item in the book's table of contents.
     */
    export interface FB2TOCItem {
        label: string;
        href: string;
        subitems: {
            label: string;
            href: string;
        }[] | null;
    }

    /**
     * The book object returned by `makeFB2`.
     */
    export interface FB2Book {
        /** The parsed metadata of the book. */
        metadata: FB2Metadata;
        /** A function that returns a promise resolving to the cover image Blob. */
        getCover: () => Promise<Blob | null>;
        /** An array of sections that make up the book's content. */
        sections: FB2Section[];
        /** The table of contents for the book. */
        toc: FB2TOCItem[];
        /**
         * Resolves an href to a location in the book.
         * @param href The href, which may include a fragment identifier.
         * @returns An object with the section index and an anchor function to find the element in a document.
         */
        resolveHref: (href: string) => {
            index: number;
            anchor: (doc: Document) => Element | null;
        };
        /**
         * Splits a TOC href into its numeric path and fragment components.
         * @param href The href to split.
         */
        splitTOCHref: (href: string) => number[];
        /**
         * Finds a TOC fragment identifier within a given section document.
         * @param doc The document to search in.
         * @param id The numeric ID to find.
         */
        getTOCFragment: (doc: Document, id: string | number) => Element | null;
        /**
         * Cleans up resources, revoking all created object URLs.
         */
        destroy: () => void;
    }

    /**
     * Parses an FB2 file and converts it into a standardized book object.
     * @param blob The FB2 file as a Blob.
     * @returns A promise that resolves to an `FB2Book` object.
     */
    export function makeFB2(blob: Blob): Promise<FB2Book>;
}


declare module 'g2a-foliate-js/fixed-layout.js' {

    // --- Supporting Types ---

    /** A minimal interface for a book section required by the FixedLayout component. */
    export interface FxlBookSection {
        pageSpread?: 'left' | 'right' | 'center';
        load?: () => Promise<string | null>;
    }

    /** A minimal interface for the book object required by the `open` method. */
    export interface FxlBook {
        rendition?: {
            spread?: 'none' | 'landscape' | 'portrait' | 'both' | 'auto';
            viewport?: string | {
                width: any;
                height: any;
            };
        };
        sections: FxlBookSection[];
        dir?: 'rtl' | 'ltr';
    }

    /** Represents a single spread, which can contain left, right, or center pages. */
    export interface Spread {
        left?: FxlBookSection;
        right?: FxlBookSection;
        center?: FxlBookSection;
    }

    /** CustomEvent dispatched when a page's iframe has loaded. */
    export interface FxlLoadEvent extends CustomEvent {
        detail: {
            doc: Document;
            index: number;
        };
    }

    /** CustomEvent dispatched when the view location changes. */
    export interface FxlRelocateEvent extends CustomEvent {
        detail: {
            reason: string;
            range: null;
            index: number;
            fraction: number;
            size: number;
        };
    }


    // --- FixedLayout Class ---

    export class FixedLayout extends HTMLElement {
        /** The book object used to render content. Set via the `open()` method. */
        book: FxlBook;
        /** The default viewport properties for pages. */
        defaultViewport: string | { width: any, height: any };
        /** The spread behavior ('none', 'both', etc.). */
        spread: string;
        /** True if the page progression is right-to-left. */
        rtl: boolean;

        /** The current zoom level. Can be a number (e.g., 1.5), 'fit-width', or 'fit-page'. */
        zoom: number | 'fit-width' | 'fit-page' | null;

        /** A getter that returns the index of the currently displayed primary section. */
        readonly index: number;

        /**
         * Initializes the component with a book object.
         * @param book The book object to display.
         */
        open(book: FxlBook): void;

        /**
         * Finds the spread information for a given section.
         * @param section A section object from the book.
         * @returns The spread's index and the section's side ('left', 'right', 'center').
         */
        getSpreadOf(section: FxlBookSection): { index: number; side: 'left' | 'right' | 'center' } | undefined;

        /**
         * Returns the array of calculated spreads for the book.
         */
        getSpreads(): Spread[];

        /**
         * Navigates to a specific spread by its index.
         * @param index The index of the spread to display.
         * @param side The preferred page to focus on ('left', 'right', 'center').
         * @param reason A string indicating the reason for navigation.
         */
        goToSpread(index: number, side?: 'left' | 'right' | 'center', reason?: string): Promise<void>;

        /**
         * Navigates to a target location (e.g., from a link or search result).
         * @param target A promise or object resolving to the target's section index.
         */
        goTo(target: Promise<{ index: number }> | { index: number }): Promise<void>;

        /**
         * Navigates to the next spread.
         */
        next(): Promise<void>;

        /**
         * Navigates to the previous spread.
         */
        prev(): Promise<void>;

        /**
         * Returns information about the currently rendered iframe(s).
         */
        getContents(): { doc: Document; index: number; }[];

        /**
         * Cleans up resources used by the component.
         */
        destroy(): void;

        // --- Event Overloads ---
        addEventListener(type: 'load', listener: (this: FixedLayout, ev: FxlLoadEvent) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: 'relocate', listener: (this: FixedLayout, ev: FxlRelocateEvent) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    }
}


declare module 'g2a-foliate-js/footnotes.js' {

    // --- Supporting Types ---

    /**
     * A placeholder interface for the `<foliate-view>` custom element.
     * Its actual implementation is not in this file.
     */
    interface FoliateView extends HTMLElement {
        open(book: any): Promise<void>;
        goTo(index: number): Promise<void>;
    }

    /**
     * A minimal interface for a book object, requiring only the `resolveHref` method.
     */
    interface BookWithHrefResolver {
        resolveHref(href: string): Promise<{
            index: number;
            anchor: (doc: Document) => Node | Range;
        }>;
    }

    /**
     * The `CustomEvent` that the `handle` method expects, typically fired on link clicks.
     */
    interface HandleEvent extends CustomEvent {
        detail: {
            a: HTMLAnchorElement;
            href: string;
        };
        preventDefault(): void;
    }

    /** The type of a referenced footnote or endnote. */
    type FootnoteType = 'biblioentry' | 'definition' | 'endnote' | 'footnote' | 'note' | null;

    /** `CustomEvent` dispatched just before a footnote view is rendered. */
    export interface BeforeRenderEvent extends CustomEvent {
        detail: {
            view: FoliateView;
        };
    }

    /** `CustomEvent` dispatched after a footnote has been rendered into its view. */
    export interface RenderEvent extends CustomEvent {
        detail: {
            view: FoliateView;
            href: string;
            type: FootnoteType;
            hidden: boolean;
            target: Node;
        };
    }

    // --- FootnoteHandler Class ---

    /**
     * Detects and handles footnote links within a book.
     */
    export class FootnoteHandler extends EventTarget {
        /**
         * If true, the handler will attempt to detect footnote links
         * heuristically even if they are not marked up with EPUB types.
         * @default true
         */
        detectFootnotes: boolean;

        /**
         * The main method to process a potential footnote link click.
         * @param book The book object.
         * @param e The click event from the view.
         * @returns A promise that resolves when the footnote has been displayed, or undefined.
         */
        handle(book: BookWithHrefResolver, e: HandleEvent): Promise<void> | undefined;

        // --- Event Overloads ---
        addEventListener(type: 'render', listener: (this: FootnoteHandler, ev: RenderEvent) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: 'before-render', listener: (this: FootnoteHandler, ev: BeforeRenderEvent) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    }
}


declare module 'g2a-foliate-js/mobi.js' {

    // --- Supporting Types ---

    /** An async function that decompresses zlib-compressed data. */
    type MobiUnzlib = (data: Uint8Array) => Promise<Uint8Array>;

    /** Input options for the MOBI class constructor. */
    export interface MobiConstructorOptions {
        unzlib: MobiUnzlib;
    }

    /** Represents the parsed metadata of the MOBI file. */
    export interface MobiMetadata {
        identifier: string;
        title: string;
        author?: string[];
        publisher?: string;
        language?: string;
        published?: string;
        description?: string;
        subject?: string[];
        rights?: string;
        contributor?: string[];
    }

    /** Represents a single section of the MOBI book. */
    export interface MobiSection {
        id: number;
        load: () => Promise<string>;
        createDocument: () => Promise<Document>;
        size: number;
        pageSpread?: 'left' | 'right' | 'center';
        linear?: 'no';
    }

    /** Represents a recursive item in the table of contents. */
    export interface MobiTOCItem {
        label: string;
        href: string;
        subitems?: MobiTOCItem[];
    }

    /** Represents an item in the book's guide or landmarks section. */
    export interface MobiLandmark {
        label: string;
        type?: string[];
        href: string;
    }

    /**
     * The book object returned by the `MOBI.open()` method.
     * This provides a common interface for both MOBI6 and KF8 formats.
     */
    export interface MobiBook {
        metadata: MobiMetadata;
        sections: MobiSection[];
        toc?: MobiTOCItem[];
        landmarks?: MobiLandmark[];
        rendition?: {
            layout: 'reflowable' | 'pre-paginated';
            viewport: Record<string, any>;
        };
        dir?: 'ltr' | 'rtl';
        /** An EventTarget for intercepting and transforming loaded resources (KF8 only). */
        transformTarget?: EventTarget;
        getCover(): Promise<Blob | undefined>;
        resolveHref(href: string): { index: number; anchor: (doc: Document) => Element | null; } | undefined;
        splitTOCHref(href: string): any[];
        getTOCFragment(doc: Document, id: any): Element | null;
        isExternal(uri: string): boolean;
        destroy(): void;
    }


    // --- Exported Functions and Classes ---

    /**
     * Checks if a file is likely a MOBI file by inspecting its magic numbers.
     * @param file The file to check.
     */
    export function isMOBI(file: Blob): Promise<boolean>;

    /**
     * A class for parsing MOBI and KF8 files.
     */
    export class MOBI {
        constructor(options: MobiConstructorOptions);

        /**
         * Opens and parses a MOBI or KF8 file.
         * @param file The file to open.
         * @returns A promise that resolves to a `MobiBook` object.
         */
        open(file: Blob): Promise<MobiBook>;
    }
}


declare module 'g2a-foliate-js/opds.js' {

    // --- Supporting Types ---

    export interface LinkPropertyPrice {
        currency: string | null;
        value: string;
    }

    export interface LinkProperties {
        price: LinkPropertyPrice | null;
        indirectAcquisition: { type: string | null }[];
        numberOfItems: string | null;
    }

    export interface Link {
        rel?: string[];
        href: string | null;
        type: string | null;
        title: string | null;
        properties: LinkProperties;
    }

    export interface Person {
        name: string;
        links: { href: string }[];
    }

    export interface Subject {
        name: string | null;
        code: string | null;
        scheme: string | null;
    }

    export interface Content {
        value: string;
        type: string;
    }

    export interface PublicationMetadata {
        title: string;
        author: Person[];
        contributor: Person[];
        publisher?: string;
        published?: string;
        language?: string;
        identifier?: string;
        subject: Subject[];
        rights: string;
        [SYMBOL.CONTENT]?: Content;
    }

    export interface Publication {
        metadata: PublicationMetadata;
        links: Link[];
        images: Link[];
    }

    export interface Navigation {
        rel?: string[];
        href: string | null;
        type: string | null;
        title?: string;
        [SYMBOL.SUMMARY]?: string;
    }

    export interface Group {
        metadata: {
            title: string | null;
            numberOfItems: string | null;
        };
        links: Link[];
        publications?: Publication[];
        navigation?: Navigation[];
    }

    export interface Facet {
        metadata: {
            title: string | null;
        };
        links: Link[];
    }

    export interface Feed {
        metadata: {
            title?: string;
            subtitle?: string;
        };
        links: Link[];
        publications?: Publication[];
        navigation?: Navigation[];
        groups: Group[];
        facets: Facet[];
    }

    export interface SearchParam {
        ns: string | null;
        name: string;
        required: boolean;
        value: string;
    }

    export interface Search {
        metadata: {
            title?: string;
            description?: string;
        };
        search: (map: Map<string | null, Map<string, string>>) => string;
        params: SearchParam[];
    }

    // --- Exported Constants ---

    /** Standard OPDS link relations. */
    export const REL: {
        ACQ: 'http://opds-spec.org/acquisition';
        FACET: 'http://opds-spec.org/facet';
        GROUP: 'http://opds-spec.org/group';
        COVER: string[];
        THUMBNAIL: string[];
    };

    /** Symbols for special properties on parsed objects. */
    export const SYMBOL: {
        SUMMARY: symbol;
        CONTENT: symbol;
    };

    // --- Exported Functions ---

    /**
     * Checks if a media type string corresponds to an OPDS catalog.
     * @param mediaType The media type string to check.
     */
    export function isOPDSCatalog(mediaType: string): boolean;

    /**
     * Parses an Atom `<entry>` element into a Publication object.
     * @param entry The `<entry>` element from an OPDS feed.
     */
    export function getPublication(entry: Element): Publication;

    /**
     * Parses an OPDS Atom feed document into a structured Feed object.
     * @param doc The XML Document of the OPDS feed.
     */
    export function getFeed(doc: Document): Feed;

    /**
     * Creates a search handler from an OpenSearch link.
     * @param link The OPDS link object with an OpenSearch type.
     */
    export function getSearch(link: Link): Promise<Search>;

    /**
     * Parses an OpenSearch Description Document into a search handler object.
     * @param doc The XML Document of the OpenSearch description.
     */
    export function getOpenSearch(doc: Document): Search;
}


declare module 'g2a-foliate-js/overlayer.js' {

    // --- Type Definitions ---

    /**
     * A function that takes a list of DOMRects and an options object,
     * and returns an SVGElement to be rendered in the overlay.
     */
    export type DrawFunction<T extends DrawOptions = DrawOptions> =
        (rects: DOMRectList, options?: T) => SVGElement;

    /**
     * Represents the target area for an overlay, which can be a static Range
     * or a function that dynamically resolves to a Range.
     */
    export type RangeProvider = Range | ((root: Node) => Range);

    /** A base interface for options passed to a DrawFunction. */
    export interface DrawOptions {
        [key: string]: any;
    }

    /** Options for the `underline`, `strikethrough`, and `squiggly` drawing functions. */
    export interface LineDrawOptions extends DrawOptions {
        color?: string;
        width?: number;
        writingMode?: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr';
    }

    /** Options for the `highlight` drawing function. */
    export interface HighlightDrawOptions extends DrawOptions {
        color?: string;
    }

    /** Options for the `outline` drawing function. */
    export interface OutlineDrawOptions extends DrawOptions {
        color?: string;
        width?: number;
        radius?: number;
    }

    /** Options for the `copyImage` drawing function. */
    export interface CopyImageDrawOptions extends DrawOptions {
        src: string;
    }


    // --- Overlayer Class ---

    /**
     * A class to manage an SVG layer for drawing annotations over content.
     */
    export class Overlayer {
        constructor();

        /** The root `<svg>` element of the overlayer. */
        public readonly element: SVGSVGElement;

        /**
         * Adds a new annotation to the overlay. If a key already exists, it is replaced.
         * @param key A unique key to identify this annotation.
         * @param range A DOM Range or a function that returns one, specifying the target area.
         * @param draw A function that generates the SVG element to be drawn.
         * @param options An options object to be passed to the `draw` function.
         */
        add(key: any, range: RangeProvider, draw: DrawFunction, options?: DrawOptions): void;

        /**
         * Removes an annotation from the overlay by its key.
         * @param key The key of the annotation to remove.
         */
        remove(key: any): void;

        /**
         * Redraws all annotations. This is useful after the underlying layout changes.
         */
        redraw(): void;

        /**
         * Checks which annotation is at a given point.
         * @param coords The client coordinates to test.
         * @returns An array containing `[key, range]` if a hit is found, otherwise an empty array.
         */
        hitTest(coords: { x: number; y: number; }): [any, Range] | [];

        /** A built-in drawing function to create underlines. */
        static underline(rects: DOMRectList, options?: LineDrawOptions): SVGGElement;

        /** A built-in drawing function to create strikethroughs. */
        static strikethrough(rects: DOMRectList, options?: LineDrawOptions): SVGGElement;

        /** A built-in drawing function to create squiggly underlines. */
        static squiggly(rects: DOMRectList, options?: LineDrawOptions): SVGGElement;

        /** A built-in drawing function to create highlights. */
        static highlight(rects: DOMRectList, options?: HighlightDrawOptions): SVGGElement;

        /** A built-in drawing function to create outlines. */
        static outline(rects: DOMRectList, options?: OutlineDrawOptions): SVGGElement;

        /** A built-in drawing function to copy an image into the overlay. */
        static copyImage(rects: DOMRectList, options?: CopyImageDrawOptions): SVGImageElement;
    }
}


declare module 'g2a-foliate-js/paginator.js' {
    import type { Overlayer } from 'g2a-foliate-js/overlayer.js';

    // --- Supporting Types ---

    /** A minimal interface for a book section required by the Paginator. */
    export interface PaginatorSection {
        load: () => Promise<string | null>;
        unload?: () => void;
        linear?: string | null;
    }

    /** A minimal interface for the book object required by the `open` method. */
    export interface PaginatorBook {
        dir?: 'rtl' | 'ltr';
        sections: PaginatorSection[];
        transformTarget?: EventTarget;
    }

    /** Represents a navigation target for the `goTo` method. */
    export interface GoToTarget {
        index: number;
        /** The anchor can be a DOM Range, an Element, or a number (0-1) representing a fraction of the content. */
        anchor?: Range | Element | number | ((doc: Document) => Range | Element | number);
        select?: boolean;
    }

    /** CustomEvent dispatched when the visible content area changes. */
    export interface PaginatorRelocateEvent extends CustomEvent {
        detail: {
            reason: string;
            range: Range;
            index: number;
            fraction?: number;
            size?: number;
        };
    }

    /** CustomEvent dispatched when a new section's document has been loaded. */
    export interface PaginatorLoadEvent extends CustomEvent {
        detail: {
            doc: Document;
            index: number;
        };
    }

    /** CustomEvent dispatched to request an Overlayer for a newly loaded section. */
    export interface PaginatorCreateOverlayerEvent extends CustomEvent {
        detail: {
            doc: Document;
            index: number;
            attach: (overlayer: Overlayer) => void;
        };
    }

    // --- Paginator Class ---

    export class Paginator extends HTMLElement {
        /** A readonly boolean indicating if the paginator is in scrolled mode. */
        public readonly scrolled: boolean;
        /** A readonly number indicating the current page index in columnar layout. */
        public readonly page: number;
        /** A readonly number indicating the total number of pages in the current section. */
        public readonly pages: number;

        /**
         * Initializes the paginator with a book object.
         * @param book The book object to display.
         */
        open(book: PaginatorBook): void;

        /** Re-calculates and applies the layout to the current view. */
        render(): void;

        /**
         * Scrolls the view by a specified amount.
         * @param dx The horizontal distance to scroll.
         * @param dy The vertical distance to scroll.
         */
        scrollBy(dx: number, dy: number): void;

        /**
         * Snaps to the nearest page based on velocity after a touch gesture.
         * @param vx The horizontal velocity.
         * @param vy The vertical velocity.
         */
        snap(vx: number, vy: number): void;

        /**
         * Scrolls the view to a specific anchor.
         * @param anchor The target to scroll to (Range, Element, or fractional number).
         * @param select If true, the anchor will be selected after scrolling.
         */
        scrollToAnchor(anchor: Range | Element | number, select?: boolean): Promise<void>;

        /**
         * Navigates to a specific target location in the book.
         * @param target A promise or object resolving to the navigation target.
         */
        goTo(target: Promise<GoToTarget> | GoToTarget): Promise<void>;

        /** Navigates to the previous page or section. */
        prev(distance?: number): Promise<void>;

        /** Navigates to the next page or section. */
        next(distance?: number): Promise<void>;

        /** Navigates to the previous section. */
        prevSection(): Promise<void>;

        /** Navigates to the next section. */
        nextSection(): Promise<void>;

        /** Navigates to the first section. */
        firstSection(): Promise<void>;

        /** Navigates to the last section. */
        lastSection(): Promise<void>;

        /**
         * Returns information about the currently rendered content view(s).
         */
        getContents(): { doc: Document; index: number; overlayer: Overlayer }[];

        /**
         * Applies CSS styles to the content view.
         * @param styles A CSS string, or a tuple of strings for prepending and appending styles.
         */
        setStyles(styles: string | [string, string]): void;

        /** Sets focus to the content view's window. */
        focusView(): void;

        /** Cleans up resources used by the component. */
        destroy(): void;

        // --- Event Overloads ---
        addEventListener(type: 'relocate', listener: (this: Paginator, ev: PaginatorRelocateEvent) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: 'load', listener: (this: Paginator, ev: PaginatorLoadEvent) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: 'create-overlayer', listener: (this: Paginator, ev: PaginatorCreateOverlayerEvent) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    }
}


declare module 'g2a-foliate-js/progress.js' {

    // --- Supporting Types ---

    /** Represents a recursive item in a Table of Contents. */
    export interface TOCItem {
        id?: number;
        href?: string;
        subitems?: TOCItem[];
        [key: string]: any;
    }

    /** Options for initializing the TOCProgress class. */
    export interface TOCProgressInitOptions {
        toc: TOCItem[];
        /** An array of section IDs (hrefs) in spine order. */
        ids: string[];
        /** An async function that splits an href into a base path and a fragment. */
        splitHref: (href?: string) => Promise<[string | undefined, string | undefined]>;
        /** A function that finds an element in a document by its fragment ID. */
        getFragment: (doc: Document | ShadowRoot, fragment?: string) => Element | null;
    }

    /** Represents a book section for progress calculation. */
    export interface ProgressSection {
        linear?: string;
        size: number;
    }

    /** The detailed progress information returned by `SectionProgress.getProgress`. */
    export interface ProgressInfo {
        /** The overall progress as a fraction (0 to 1). */
        fraction: number;
        /** Progress in terms of sections. */
        section: {
            current: number;
            total: number;
        };
        /** Progress in terms of abstract locations (e.g., for Kindle-style locations). */
        location: {
            current: number;
            next: number;
            total: number;
        };
        /** Estimated time remaining. */
        time: {
            section: number;
            total: number;
        };
    }


    // --- Exported Classes ---

    /**
     * Calculates reading progress based on the Table of Contents.
     */
    export class TOCProgress {
        /**
         * Initializes the progress calculator with book data.
         * @param options The book's TOC and helper functions.
         */
        init(options: TOCProgressInitOptions): Promise<void>;

        /**
         * Gets the current TOC item based on the visible range in a section.
         * @param index The index of the current section.
         * @param range The visible DOM Range within the section.
         * @returns The corresponding TOC item, or null.
         */
        getProgress(index: number, range?: Range): TOCItem | null;
    }

    /**
     * Calculates reading progress based on the size of each section.
     */
    export class SectionProgress {
        constructor(sections: ProgressSection[], sizePerLoc: number, sizePerTimeUnit: number);

        /**
         * Calculates detailed progress information.
         * @param index The index of the current section.
         * @param fractionInSection The progress within the current section (0 to 1).
         * @param pageFraction Optional progress within the current page.
         * @returns A `ProgressInfo` object.
         */
        getProgress(index: number, fractionInSection: number, pageFraction?: number): ProgressInfo;

        /**
         * Determines the section and progress within it from an overall progress fraction.
         * @param fraction The overall progress fraction (0 to 1).
         * @returns A tuple `[sectionIndex, fractionInSection]`.
         */
        getSection(fraction: number): [number, number];
    }
}


declare module 'g2a-foliate-js/quote-image.js' {

    /**
     * An object containing the data needed to generate a quote image.
     */
    export interface QuoteData {
        title: string;
        author: string;
        text: string;
    }

    /**
     * A custom element that renders quote data into a canvas and exports it as an image.
     */
    export class QuoteImage extends HTMLElement {
        constructor();

        /**
         * Generates an image Blob from the provided quote data.
         * @param data An object containing the title, author, and text for the quote.
         * @returns A promise that resolves to the generated image as a Blob, or null if creation fails.
         */
        getBlob(data: QuoteData): Promise<Blob | null>;
    }
}


declare module 'g2a-foliate-js/search.js' {

    // --- Supporting Types ---

    /** Options for configuring the search behavior. */
    export interface SearchOptions {
        /** The locale(s) to use for string comparison. */
        locales?: string | string[];
        /** The granularity of matching. 'grapheme' for character-by-character, 'word' for whole words. */
        granularity?: 'grapheme' | 'word';
        /** The sensitivity for string comparison. */
        sensitivity?: 'base' | 'accent' | 'case' | 'variant';
    }

    /** The range of a search result within an array of strings. */
    export interface SearchResultRange {
        startIndex: number;
        startOffset: number;
        endIndex: number;
        endOffset: number;
    }

    /** An excerpt of the text surrounding a search match. */
    export interface SearchResultExcerpt {
        /** The text preceding the match. */
        pre: string;
        /** The matched text. */
        match: string;
        /** The text following the match. */
        post: string;
    }

    /** A single search result from a simple string array search. */
    export interface SearchResult {
        range: SearchResultRange;
        excerpt: SearchResultExcerpt;
    }

    /** A search result where the range has been resolved to a DOM Range. */
    export interface MatchedSearchResult {
        range: Range;
        excerpt: SearchResultExcerpt;
    }

    /** A callback function used by the TextWalker to process search results. */
    export type TextWalkerCallback = (
        strs: string[],
        makeRange: (startIndex: number, startOffset: number, endIndex: number, endOffset: number) => Range
    ) => Generator<MatchedSearchResult, void, unknown>;

    /** A node filter function, compatible with `NodeFilter.acceptNode`. */
    export type NodeFilterCallback = (node: Node) => number;

    /** A function that walks the text nodes of a document and applies a search callback. */
    export type TextWalker = (
        doc: Document,
        callback: TextWalkerCallback,
        acceptNode?: NodeFilterCallback
    ) => Generator<MatchedSearchResult, void, unknown>;

    /** Options for configuring the `searchMatcher` function. */
    export interface SearchMatcherOptions {
        defaultLocale?: string;
        matchCase?: boolean;

        matchDiacritics?: boolean;
        matchWholeWords?: boolean;
        acceptNode?: NodeFilterCallback;
    }

    // --- Exported Functions ---

    /**
     * Searches for a query within an array of strings.
     * @param strs The array of strings to search through.
     * @param query The string to search for.
     * @param options The search configuration.
     * @returns A generator that yields each `SearchResult`.
     */
    export function search(
        strs: string[],
        query: string,
        options: SearchOptions
    ): Generator<SearchResult, void, unknown>;

    /**
     * A higher-order function that creates a search function for use with a TextWalker.
     * @param textWalker A function that iterates through the text of a document.
     * @param opts Options to configure the search behavior.
     * @returns A generator function that takes a document and a query, and yields each `MatchedSearchResult`.
     */
    export function searchMatcher(
        textWalker: TextWalker,
        opts: SearchMatcherOptions
    ): (doc: Document, query: string) => Generator<MatchedSearchResult, void, unknown>;
}


declare module 'g2a-foliate-js/text-walker.js' {

    /** A function that creates a DOM Range from text node indices and offsets. */
    export type MakeRangeFunction = (
        startIndex: number,
        startOffset: number,
        endIndex: number,
        endOffset: number
    ) => Range;

    /**
     * A generator function that receives the collected text strings and a `makeRange`
     * utility, and yields results of a generic type `T`.
     */
    export type TextWalkerCallback<T> = (
        strs: string[],
        makeRange: MakeRangeFunction
    ) => Generator<T, void, unknown>;

    /** A node filter function, compatible with `NodeFilter.acceptNode`. */
    export type NodeFilterCallback = (node: Node) => number;

    /**
     * A generator function that walks the text nodes of a Document or Range,
     * collects their string content, and applies a callback to yield results.
     *
     * @param scope The Document or Range to walk through.
     * @param func A callback generator that processes the text and yields results.
     * @param filterFunc An optional custom node filter.
     * @returns A generator that yields the results from the `func` callback.
     */
    export function textWalker<T>(
        scope: Document | Range,
        func: TextWalkerCallback<T>,
        filterFunc?: NodeFilterCallback
    ): Generator<T, void, unknown>;
}


declare module 'g2a-foliate-js/tts.js' {
    import type { TextWalker } from 'g2a-foliate-js/text-walker.js';

    /** A callback function to highlight a given DOM Range. */
    export type HighlightCallback = (range: Range) => void;

    /** The granularity for segmenting text for TTS marks. */
    export type Granularity = 'word' | 'sentence' | string;

    /**
     * A class to manage Text-to-Speech processing for a document.
     * It segments the document, generates SSML, and tracks playback position.
     */
    export class TTS {
        /** The document being processed. */
        doc: Document;
        /** The callback function used to highlight text. */
        highlight: HighlightCallback;

        constructor(
            doc: Document,
            textWalker: TextWalker,
            highlight: HighlightCallback,
            granularity: Granularity
        );

        /**
         * Starts TTS from the beginning of the document.
         * @returns The SSML string for the first block of text, or undefined if there is no content.
         */
        start(): string | undefined;

        /**
         * Resumes TTS from the last known position.
         * @returns The SSML string for the current block of text, or undefined if there is no content.
         */
        resume(): string | undefined;

        /**
         * Moves to the previous block of text.
         * @param paused If true, highlights the new block's range.
         * @returns The SSML string for the previous block, or undefined if at the beginning.
         */
        prev(paused?: boolean): string | undefined;

        /**
         * Moves to the next block of text.
         * @param paused If true, highlights the new block's range.
         * @returns The SSML string for the next block, or undefined if at the end.
         */
        next(paused?: boolean): string | undefined;

        /**
         * Starts TTS from a specific DOM Range within the document.
         * @param range The range to start from.
         * @returns The SSML string for the block containing the range, starting from the range's position.
         */
        from(range: Range): string | undefined;

        /**
         * Sets the current position based on an SSML mark name and highlights the corresponding text.
         * This is typically called in response to a `boundary` event from the speech synthesis engine.
         * @param mark The name of the mark from an SSML event.
         */
        setMark(mark: string): void;
    }
}


declare module 'g2a-foliate-js/uri-template.js' {
    /**
     * Expands a URI template string by replacing variables with their values.
     * @param template The URI template string (e.g., "/search{?query,lang}").
     * @param variables A map of variable names to their corresponding string values.
     * @returns The expanded URI string.
     */
    export function replace(template: string, variables: Map<string, string>): string;

    /**
     * Extracts all unique variable names from a URI template string.
     * @param template The URI template string.
     * @returns A `Set` containing all variable names found in the template.
     */
    export function getVariables(template: string): Set<string>;
}


declare module 'g2a-foliate-js/view.js' {
    import type { EPUB } from 'g2a-foliate-js/epub.js';
    import type { FB2Book } from 'g2a-foliate-js/fb2.js';
    import type { MobiBook } from 'g2a-foliate-js/mobi.js';
    import type { ComicBook } from 'g2a-foliate-js/comic-book.js';
    import type { Paginator } from 'g2a-foliate-js/paginator.js';
    import type { FixedLayout } from 'g2a-foliate-js/fixed-layout.js';
    import type { TTS } from 'g2a-foliate-js/tts.js';
    import type { MediaOverlay } from 'g2a-foliate-js/epub.js';

    type Book = EPUB | FB2Book | MobiBook | ComicBook;
    type AnyBook = Book | string | File | FileSystemDirectoryEntry;
    type Renderer = Paginator | FixedLayout;
    type NavigationTarget = number | string | { fraction: number };

    export class ResponseError extends Error { cause: Response }
    export class NotFoundError extends Error { }
    export class UnsupportedTypeError extends Error { }

    export function makeBook(file: AnyBook): Promise<Book>;

    export class View extends HTMLElement {
        book: Book;
        renderer: Renderer;
        tts?: TTS;
        mediaOverlay?: MediaOverlay;
        history: EventTarget & {
            pushState(state: any): void;
            replaceState(state: any): void;
            back(): void;
            forward(): void;
            readonly canGoBack: boolean;
            readonly canGoForward: boolean;
            clear(): void;
        };

        open(book: AnyBook): Promise<void>;
        close(): void;
        goTo(target: NavigationTarget): Promise<any>;
        // ... and many other methods
    }
}

// --- Global Augmentations ---
declare global {
    interface HTMLElementTagNameMap {
        'foliate-view': import('g2a-foliate-js/view.js').View;
        'foliate-paginator': import('g2a-foliate-js/paginator.js').Paginator;
        'foliate-fxl': import('g2a-foliate-js/fixed-layout.js').FixedLayout;
        'foliate-quoteimage': import('g2a-foliate-js/quote-image.js').QuoteImage;
    }
}


export {};
