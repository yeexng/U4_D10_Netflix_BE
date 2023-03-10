import Express from "express";
import multer from "multer";
import { getMedias, writeMedias } from "../../lib/fs-tools.js";
import { extname } from "path";
import { mediaToPDFReadableStream } from "../../lib/pdf-tools.js";
import { pipeline } from "stream";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import createHttpError from "http-errors";

const filesRouter = Express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: { folder: "Medias/poster" },
  }),
}).single("poster");

filesRouter.post("/:id/poster", cloudinaryUploader, async (req, res, next) => {
  try {
    const mediasArray = await getMedias();
    const index = mediasArray.findIndex((m) => m.imdbID === req.params.id);
    if (index !== -1) {
      const oldMedia = mediasArray[index];
      const updatedMedia = {
        ...oldMedia,
        ...req.body,
        poster: req.file.path,
        updatedAt: new Date(),
      };
      mediasArray[index] = updatedMedia;
      await writeMedias(mediasArray);
      console.log("FILE", req.file);
      res.send({ message: "poster updated" });
    } else {
      next(
        createHttpError(404, `Media with id ${req.params.mediaID} not found!`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

filesRouter.get("/:id/pdf", async (req, res, next) => {
  try {
    const mediasArray = await getMedias();
    const foundMedia = mediasArray.find((m) => m.imdbID === req.params.id);
    if (foundMedia) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${foundMedia.id}.pdf`
      );
      const source = await mediaToPDFReadableStream(foundMedia);
      const destination = res;
      pipeline(source, destination, (err) => {
        if (err) console.log(err);
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default filesRouter;
