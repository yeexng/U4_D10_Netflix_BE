import Express from "express";
import listEndpoints from "express-list-endpoints";
import filesRouter from "./api/files/index.js";
import mediasRouter from "./api/media/index.js";
import {
  badRequestHandler,
  genericErrorHandler,
  notfoundHandler,
  unauthorizedHandler,
} from "./errorsHandler.js";
import cors from "cors";
import { join } from "path";
import createHttpError from "http-errors";

const server = Express();
const port = process.env.PORT || 3005;
const publicFolderPath = join(process.cwd(), "./public");
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];
// /Users/xuanng/Desktop/Epicode/Untitled/public
console.log("Public Path:", publicFolderPath);
server.use(Express.static(publicFolderPath));
server.use(
  cors({
    origin: (currentOrigin, corsNext) => {
      if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {
        // origin is in the whitelist
        corsNext(null, true);
      } else {
        // origin is not in the whitelist
        corsNext(
          createHttpError(
            400,
            `Origin ${currentOrigin} is not in the whitelist!`
          )
        );
      }
    },
  })
);

server.use(Express.json());

server.use("/medias", mediasRouter);
server.use("/medias", filesRouter);

//Errors
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notfoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server on port ${port}`);
});
