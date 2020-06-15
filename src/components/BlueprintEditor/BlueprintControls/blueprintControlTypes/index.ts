import { BlueprintControlType } from "../../typings";

const requireFiles = require.context(".", true, /\.(ts|js|tsx)$/);

const blueprintControlTypes = requireFiles
  .keys()
  .reduce<{ [key: string]: BlueprintControlType }>(
    (blueprintControlType, filePath: string) => {
      // get the content of the file
      const blueprintControlTypeFile = requireFiles(filePath);
      // get the content
      const content =
        blueprintControlTypeFile["default"] || blueprintControlTypeFile;
      // skip any files that does not have field `key`
      if (!content["key"] || !content["name"]) return blueprintControlType;
      // add content of the file to theme object
      blueprintControlType[content.key] = content;
      // return theme object
      return blueprintControlType;
    },
    {}
  );

export default blueprintControlTypes;
