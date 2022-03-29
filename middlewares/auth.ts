import { check } from "express-validator";
import { validateBody } from "./body";


export const googleSigninMiddlewares = [
  check('idToken', 'The id_token is required').not().isEmpty(),
  validateBody
];

export const appleSigninMiddlewares = [
];

