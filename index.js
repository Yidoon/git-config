const { exec } = require("child_process");
const fs = require("fs");
const yargs = require("yargs").argv;

// node index.js -r folderPath --name=xxx --email=xxx

const configSpecRepo = (repoPath) => {
  const cmdStr = `git config user.name ${yargs.name} && git config user.email ${yargs.email}`;
  return new Promise((resolve, reject) => {
    exec(cmdStr, { cwd: repoPath }, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      console.log(`set config success: ${repoPath}`);
      resolve(stdout);
    });
  });
};
const recursiveConfigFoldersRepo = (folderPath) => {
  const paths = getFolderUnderPath(folderPath);
  const taskList = [];
  for (let i = 0, l = paths.length; i < l; i++) {
    const path = paths[i];
    taskList.push(configSpecRepo(path));
  }
  Promise.all(taskList);
};

const getFolderUnderPath = (folderPath) => {
  const directoriesInDIrectory = fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => {
      return `${folderPath}/${item.name}`;
    });
  return directoriesInDIrectory;
};
const init = async () => {
  const args = process.argv.slice(2);
  console.log(args);
  const folderPath = args[1];
  let recursive = false;
  if (args.includes("-r")) {
    recursive = true;
  }
  if (recursive) {
    recursiveConfigFoldersRepo(folderPath);
  } else {
    configSpecRepo(folderPath);
  }
};

init();
