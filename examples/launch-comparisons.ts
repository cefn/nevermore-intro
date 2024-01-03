import { $, question } from "zx";
const output = await $`ls examples/http/*.ts`.quiet();
const paths = output.stdout.toString().trim().split("\n");
const pathsIterator = paths[Symbol.iterator]();
const firstResult = pathsIterator.next();
if (firstResult.done) {
  throw new Error(`No paths found`);
}
let prevPath = firstResult.value;
for (const nextPath of pathsIterator) {
  await question(`Ready to compare ${prevPath} and ${nextPath}`);
  await $`code --diff ${prevPath} ${nextPath}`;
  prevPath = nextPath;
}
