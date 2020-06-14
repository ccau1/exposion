import { SFC } from "react";

const requireFiles = require.context(".", true, /[\w\-]+\.tsx$/);

const screens = requireFiles
  .keys()
  .reduce<{ [key: string]: SFC }>((screenObj, filePath: string) => {
    // get name of filePath
    const name = filePath
      .split("/")
      .pop()
      ?.replace(/\.(tsx)$/, "");
    // skip index file
    if (!name || name === "index") return screenObj;
    // get the content of the file
    const screenFile = requireFiles(filePath);
    // add content of the file to theme object
    screenObj[name] = screenFile["default"] || screenFile;
    // return theme object
    return screenObj;
  }, {});

export default screens;
