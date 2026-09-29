import { generateChineseName } from "./chinese";

export function generateByFaker(method) {
  const methods = {
    "name.chineseName": function () {
      return generateChineseName();
    },
  };

  if (methods[method]) {
    return methods[method]();
  }

  return "";
}
