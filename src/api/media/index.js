import Express from "express";
import createHttpError from "http-errors";
import uniqid from "uniqid";
import { getMedias, writeMedias } from "../../lib/fs-tools.js";
import { checkMediaSchema, triggerBadRequest } from "./validation.js";

const mediasRouter = Express.Router();

mediasRouter.post(
  "/",
  checkMediaSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newMedias = {
        ...req.body,
        imdbID: uniqid(),
        createdAt: new Date(),
      };
      const mediasArray = await getMedias();
      mediasArray.push(newMedias);
      await writeMedias(mediasArray);
      res.status(201).send(newMedias);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

mediasRouter.get("/", async (req, res, next) => {
  try {
    const mediasArray = await getMedias();
    if (req.query && req.query.title) {
      const filteredMedias = mediasArray.filter(
        (m) => m.title === req.query.title
      );
      res.send(filteredMedias);
    } else {
      res.send(mediasArray);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

mediasRouter.get("/:id", async (req, res, next) => {
  try {
    const mediasArray = await getMedias();
    const foundMedia = mediasArray.find((m) => m.imdbID === req.params.id);
    if (foundMedia) {
      res.send(foundMedia);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//comments
mediasRouter.post("/:id/comments", async (req, res, next) => {
  try {
    const newComment = {
      ...req.body,
      comment_id: uniqid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mediasArray = await getMedias();
    const i = mediasArray.findIndex((m) => m.imdbID === req.params.id);
    mediasArray[i].comments.push(newComment);
    await writeMedias(mediasArray);
    res.status(201).send("Comment Posted");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

mediasRouter.get("/:id/comments", async (req, res, next) => {
  try {
    const mediasArray = await getMedias();
    const index = mediasArray.findIndex((m) => m.imdbID === req.params.id);
    res.send(mediasArray[index].comments);
  } catch (error) {
    next(error);
  }
});

export default mediasRouter;
