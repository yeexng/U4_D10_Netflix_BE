import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
// medias
const mediasJSONPath = join(dataFolderPath, "medias.json");
export const getMedias = () => readJSON(mediasJSONPath);
export const writeMedias = (mediasArray) =>
  writeJSON(mediasJSONPath, mediasArray);

//poster
const postersPublicFolderPath = join(process.cwd(), "./public/img/posters");
// console.log(postersPublicFolderPath);

//Image Upload
export const savePosterImage = (fileName, fileContentAsBuffer) =>
  writeFile(join(postersPublicFolderPath, fileName), fileContentAsBuffer);
