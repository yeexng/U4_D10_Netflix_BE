import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const mediaSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Please fill in a title",
    },
  },
  year: {
    in: ["body"],
    //   //changes needed to check if it is checking number
    isInt: {
      errorMessage: "Please fill in the Year",
    },
  },
};

export const checkMediaSchema = checkSchema(mediaSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (errors.isEmpty()) {
    next();
  } else {
    next(
      createHttpError(400, "Please make sure you fill in all the Inputs", {
        errorsList: errors.array(),
      })
    );
  }
};
