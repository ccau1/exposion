import { ElementType } from "../typings";

const requireFiles = require.context(".", true, /index\.(ts|js)$/);

let elementTypes = requireFiles
  .keys()
  .reduce<{ [key: string]: ElementType }>((elementType, filePath: string) => {
    // get the content of the file
    const elementTypeFile = requireFiles(filePath);
    // get the content
    const content = elementTypeFile["default"] || elementTypeFile;
    // skip any files that does not have field `key`
    if (!content["key"] || !content["name"]) return elementType;
    // add content of the file to theme object
    elementType[content.key] = content;
    // return theme object
    return elementType;
  }, {});

// handle inheritance
elementTypes = Object.keys(elementTypes).reduce((acc, elementTypeKey) => {
  acc[elementTypeKey] = {
    ...(elementTypes[elementTypeKey].inherits
      ? elementTypes[elementTypes[elementTypeKey].inherits]
      : {}),
    ...elementTypes[elementTypeKey],
  };
  return acc;
}, {});

export default elementTypes;
