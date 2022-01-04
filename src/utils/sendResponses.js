/**
 * @param {res} res
 * @param {code} code
 * @param {errorMessage} errorMessage description of error
 * @return response object {@link res}
 */
export const sendErrorResponse = (res, code, errorMessage) => res.status(code).send({
  status: 'error',
  responsecode: code,
  responsemessage: errorMessage,
});

/**
 * @param {res} res
 * @param {code} code
 * @param {data} data res data
 * @return response object {@link res}
 */
export const sendSuccessResponse = (res, code, data) => res.status(code).send({
  status: 'success',
  responsecode: code,
  data,
});
