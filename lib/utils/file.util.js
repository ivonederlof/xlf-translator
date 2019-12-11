"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const global_1 = require("../common/global");
class FileUtil {
    /**
     * Create a path
     * @param params
     */
    static createPath(params) {
        return params.join('/');
    }
    /**
     * Create the absolute path for project from array
     * @param params
     */
    static absolutePath(params) {
        return this.createPath([global_1.Global.root, params.join('/')]);
    }
    /**
     * Create a directory for absolute path
     */
    static createDirectory(path) {
        return new Promise((resolve, reject) => fs.mkdir(this.absolutePath(path), err => {
            err && err.code !== 'EEXIST' ? reject(err) : resolve();
        }));
    }
    /**
     * Create multiple directories
     */
    static createManyDirectories(paths) {
        return Promise.all(paths.map(path => this.createDirectory([path])));
    }
    /**
     * Read file from root
     * @param path - relative path {string}
     */
    static readFile(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(FileUtil.absolutePath(path), (err, data) => {
                err ? reject(err) : resolve(data);
            });
        });
    }
    /**
     * Check if has file
     * @param path - relative path {string}
     */
    static hasFile(path) {
        return new Promise((resolve, reject) => {
            fs.stat(FileUtil.absolutePath(path), (err, data) => {
                err ? reject(err) : resolve(!!data);
            });
        });
    }
    /**
     * Copy a file to a destination
     * @param source {string[]}
     * @param destination {string[]}
     */
    static copyFile(source, destination) {
        return new Promise((resolve, reject) => {
            fs.copyFile(this.createPath(source), this.createPath(destination), err => {
                if (err && err.code !== 'ENOENT') {
                    console.log(err);
                    reject(err);
                }
                return FileUtil.readFile(destination).then(fileBuffer => resolve(fileBuffer));
            });
        });
    }
}
exports.FileUtil = FileUtil;
