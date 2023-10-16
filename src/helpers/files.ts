import * as fs from 'fs';

export function readFile(filename: string) {
  return fs.readFileSync(filename, {encoding: 'utf8'});
}

export function writeToFile(filename: string, data: string) {
  fs.writeFileSync(filename, data, {encoding: 'utf8', flag: 'w'});
}

export function pathExists(path: string) {
  return fs.existsSync(path);
}

export function createPathIfNotExists(path: string) {
  if (!pathExists(path)) {
    fs.mkdirSync(path, {recursive: true});
  }
}

export function pathToFiles(directory: string, recursive: boolean) {
  return fs
    .readdirSync(directory, {recursive})
    .map(file => `${directory}/${file}`);
}
