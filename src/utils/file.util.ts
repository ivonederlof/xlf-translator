import * as fs from 'fs';
import { Global } from '../common/global';

export class FileUtil {
  /**
   * Create a path
   * @param params
   */
  public static createPath(params: string[]): string {
    return params.join('/');
  }

  /**
   * Create the absolute path for project from array
   * @param params
   */
  public static absolutePath(params: string[]): string {
    return this.createPath([Global.root, params.join('/')]);
  }

  /**
   * Create a directory for absolute path
   */
  public static createDirectory(path: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) =>
      fs.mkdir(this.absolutePath(path), err => {
        err && err.code !== 'EEXIST' ? reject(err) : resolve();
      }),
    );
  }

  /**
   * Create multiple directories
   */
  public static createManyDirectories(paths: string[]): Promise<void[]> {
    return Promise.all(paths.map(path => this.createDirectory([path])));
  }

  /**
   * Read file from root
   * @param path - relative path {string}
   */
  public static readFile<T>(path: string[]): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      fs.readFile(FileUtil.absolutePath(path), (err, data) => {
        err ? reject(err) : resolve(data);
      });
    });
  }

  /**
   * Write file based on relative path from root
   * @param path {string[]}
   * @param data {any[]}
   * @param flag {string}
   */
  public static writeFile(path: string[], data: any, flag = 'w'): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(FileUtil.absolutePath(path), data,{ encoding: 'utf8', flag }, err => {
        err ? reject(err) : resolve();
      });
    });
  }

  /**
   * Check if has file
   * @param path - relative path {string}
   */
  public static hasFile(path: string[]): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
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
  public static copyFile(source: string[], destination: string[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      fs.copyFile(this.createPath(source), this.createPath(destination), err => {
        if (err && err.code !== 'ENOENT') {
          reject(err);
        }

        return FileUtil.readFile(destination).then(fileBuffer => resolve(fileBuffer));
      });
    });
  }
}
