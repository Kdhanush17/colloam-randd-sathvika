const constants = require("../helpers/constant");

function appError(message, httpStatus, data = null) {
	var result = {
		status: httpStatus,
		message: message
	};

	if (data != null) {
		result.data = data
	}

	return result;
}

function successResponse(res, msg, data = null) {
	var result = {
		status: constants.httpStatus.SUCCESS,
		message: msg
	};

	if (data != null) {
		result.data = data
	}

	return toJson(res, result);
};

// TODO - Tamil - Have to remove this
// Deprecated - Use successResponse instead
function successResponseWithData(res, msg, data) {
	var result = {
		status: constants.httpStatus.SUCCESS,
		message: msg,
		data: data
	};
	return toJson(res, result);
};

function ErrorResponse(res, msg, data = null) {
	var result = {
		// TODO - Tamil - Have to change this to bad request
		status: constants.httpStatus.INTERNAL_SERVER_ERROR,
		message: msg,
	};

	if (data != null) {
		result.data = data
	}

	// TODO - Tamil - Have to return result only. Will change after service layer separation. 
	return toJson(res, result);
};

function notFoundResponse(res, msg) {
	var result = {
		status: constants.httpStatus.NOT_FOUND,
		message: msg,
	};
	return toJson(res, result);
};

function validationError(res, msg, data = null) {
	var result = {
		status: constants.httpStatus.BAD_REQUEST,
		message: msg
	};

	if (data != null) {
		result.data = data
	}

	return toJson(res, result);;
};

function unauthorizedResponse(res, msg) {
	var result = {
		status: constants.httpStatus.UNAUTHORIZED,
		message: msg,
	};
	return toJson(res, result);
};

function toJson(res, result) {
	return res.status(result.status).json(result);
};

module.exports = {
	appError,
	successResponse,
	successResponseWithData,
	ErrorResponse,
	notFoundResponse,
	validationError,
	unauthorizedResponse,
	toJson
};