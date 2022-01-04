/**
 *
 * Description. (This module handles input validation globaly in the app)
 */
import DbValidator from "../../core/data/dbValidator";
const { body, validationResult } = require("express-validator");
import { sendErrorResponse } from "../../utils/sendResponses";

/**
 * @class
 * @name ValidatorMiddleWare
 */
class ValidatorMiddleWare {
  static validateSignUp = [
    body("email", "please enter a valid email")
      .exists()
      .withMessage('email parameter required')
      .trim()
      .normalizeEmail()
      .isEmail(),
    body("password")
      .exists()
      .withMessage('password parameter required')
      .trim()
      .escape()
      .isLength({ min: 8 })
      .withMessage("passwords length must be between 8 to 24"),
    body("confirmPassword")
      .exists()
      .withMessage('confirmPassword parameter required')
      .trim()
      .escape()
      .custom((value, { req }) => value === req.body.password)
      .withMessage("password fields do not match"),
  ];

  static validateProfileUpdate = [
    body("phone")
      .optional()
      .trim()
      .escape()
      .isNumeric()
      .isLength({ min: 8, max: 20 }),
    body("firstname")
      .optional()
      .trim()
      .escape()
      .isAlpha("en-US", { ignore: [/\s/g] })
      .isLength({ min: 3 })
      .toLowerCase(),
    body("lastname")
      .optional()
      .trim()
      .escape()
      .isAlpha("en-US", { ignore: [/\s/g] })
      .isLength({ min: 3 })
      .toLowerCase(),
  ];

  /**
   * @param {string} aliasedName
   * @returns Any
   */
  static handleAliases(aliasedName) {
    // ALIASED_PARAM_VALIDATIONS contains validators for parameters with a
    // different name (alias) not in KNOWN_PARAMETERS
    const ALIASED_PARAM_VALIDATIONS = {
      uuid: body(aliasedName)
        .exists()
        .withMessage(`${aliasedName} parameter required`)
        .not()
        .isEmpty()
        .custom((value) => {
          const containsAlphabetNumber = value.match(/(\w+\d+)+/g) !== null;
          return containsAlphabetNumber;
        })
        .customSanitizer((value) => value.replace(/[–]/g, "-"))
        .isLength({ min: 36, max: 36 }),
      name: body(aliasedName)
        .exists()
        .withMessage(`${aliasedName} parameter required`)
        .trim()
        .escape()
        .isAlpha("en-US", { ignore: [/\s/g] })
        .isLength({ min: 3 })
        .toLowerCase(),
      boolean: body(aliasedName)
        .exists()
        .withMessage(`${aliasedName} parameter required`)
        .isBoolean()
        .withMessage(`${aliasedName} must be a boolean`),
    };

    // Defines conditions for parameter to be an alias of name
    const isUuidAlias = aliasedName.toLowerCase() === "useruuid";

    // Defines conditions for parameter to be an alias of name
    const isNameAlias =
      aliasedName.toLowerCase() === "firstname" ||
      aliasedName.toLowerCase() === "lastname";

    const isBooleanType = aliasedName === "status";

    // Use name validation if parameter is an alias of name
    if (isUuidAlias === true) return ALIASED_PARAM_VALIDATIONS.uuid;
    // Use name validation if parameter is an alias of name
    if (isNameAlias === true) return ALIASED_PARAM_VALIDATIONS.name;
    // Use boolean validation if parameter is expected to be boolean
    if (isBooleanType === true) return ALIASED_PARAM_VALIDATIONS.boolean;

    // Else, just return validator to test existence of this aliased parameter in request
    return body(aliasedName)
      .exists()
      .withMessage(`${aliasedName} parameter required`);
  }

  /**
   * @param {Array} params
   * @returns Any
   */
  static selectValidation(...params) {
    // params is an array of arguments which specify the parameters to validate in the request
    // VALIDATION_CHAIN is the final array of validators that would be passed to express validator
    const VALIDATION_CHAIN = [];
    // KNOWN_PARAMETERS is an array of all defined parameters used in the app
    const KNOWN_PARAMETERS = [
      "userId",
      "name",
      "email",
      "password"
    ];

    // PARAMETER_VALIDATIONS contains all KNOWN_PARAMETERS and their required validations
    const PARAMETER_VALIDATIONS = {
      userId: body("userId")
        .exists()
        .withMessage("userId parameter required")
        .notEmpty()
        .custom((value) => {
          const containsAlphabetNumber = value.match(/(\w+\d+)+/g) !== null;
          return containsAlphabetNumber;
        })
        .customSanitizer((value) => value.replace(/[–]/g, "-"))
        .isLength({ min: 36, max: 36 }),
      name: body("name")
        .exists()
        .withMessage("name parameter required")
        .trim()
        .escape()
        .isAlpha("en-US", { ignore: [/\s/g] })
        .withMessage("only alphabets allowed")
        .isLength({ min: 3 })
        .toLowerCase(),
      password: body("password")
        .exists()
        .withMessage("password parameter required")
        .trim()
        .escape(),
      email: body("email")
        .exists()
        .withMessage("email parameter required")
        .normalizeEmail()
        .isEmail()
        .withMessage("please enter a valid email")
    };

    params.forEach((eachParam) => {
      // Checks if the parameter from request is in KNOWN_PARAMETERS
      // eslint-disable-next-line max-len
      const isInKnownParameters =
        KNOWN_PARAMETERS.findIndex(
          (eachKnownParam) => eachKnownParam === eachParam
        ) > -1;
      /* 
        if parameter from request is in KNOWN_PARAMETERS, add the corresponding 
        validator to VALIDATION_CHAIN.
        Else if parameter from request is not in KNOWN_PARAMETERS, check if parameter 
        is just another name for a known parameter (alias) and add returned validator 
        to VALIDATION_CHAIN.
      */
      VALIDATION_CHAIN.push(
        isInKnownParameters
          ? PARAMETER_VALIDATIONS[eachParam]
          : this.handleAliases(eachParam)
      );
    });

    return VALIDATION_CHAIN;
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Any
   */
  static validateRequest(req, res, next) {
    const errors = validationResult(req);
    return errors.isEmpty()
      ? next()
      : sendErrorResponse(res, 422, errors.array()[0]);
  }
}

export default ValidatorMiddleWare;

// export default validationResult;
