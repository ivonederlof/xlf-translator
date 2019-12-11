/// <reference types="node" />
export declare class FileUtil {
    /**
     * Create a path
     * @param params
     */
    static createPath(params: string[]): string;
    /**
     * Create the absolute path for project from array
     * @param params
     */
    static absolutePath(params: string[]): string;
    /**
     * Create a directory for absolute path
     */
    static createDirectory(path: string[]): Promise<void>;
    /**
     * Create multiple directories
     */
    static createManyDirectories(paths: string[]): Promise<void[]>;
    /**
     * Read file from root
     * @param path - relative path {string}
     */
    static readFile(path: string[]): Promise<Buffer>;
    /**
     * Check if has file
     * @param path - relative path {string}
     */
    static hasFile(path: string[]): Promise<boolean>;
    /**
     * Copy a file to a destination
     * @param source {string[]}
     * @param destination {string[]}
     */
    static copyFile(source: string[], destination: string[]): Promise<any>;
}
