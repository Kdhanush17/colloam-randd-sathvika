module.exports = {
    userType: ["ADMIN"],
    status: {
      PENDING: "PENDING",
      ACTIVE: "ACTIVE",
      DELETED: "DELETED",
      DEACTIVE: "DEACTIVE",
    },
  
    // URL's that don't require authentication
    noAuthUrls: [
      "/auth/deleteUser",
      "/auth/forgotverificationemail",
      "/auth/gmailRegister",
      "/auth/login",
      "/auth/loginMobile",
      "/auth/register",
      "/auth/registerVerifyCode",
      "/auth/resendOTP",
      "/auth/resetpassword",
      "/auth/forgotPasswordVerifyCode",
      "/deleteUser",
      "/forgotPasswordVerifyCode",
      "/forgotverificationemail",
      "/gmailRegister",
      "/login",
      "/loginMobile",
      "/register",
      "/registerVerifyCode",
      "/resendOTP",
      "/resetpassword",
      "/loginWithMobileNum",
      "/getAccountDetailsbyMobileNum",
  
    ],
  
    // // URL's works for with and without authentication
    // noAuthAndAuthUrls: [
    //   "/getAllCategory",
    //   "/searchCourse",
    //   "/appSearchCourse",
    //   "/suggestCourseByName",
    //   "/getAllLiveCourse",
    //   "/getSubCategorybyCategoryCode",
    //   "/getCourseByCourseCode",
    //   "/getInstructorById",
    //   "/getCourseByInstructorId",
    //   "\/api\/v1\/course\/(.*)\/rating",
    //   "\/api\/v1\/order\/(.*)\/downloadInvoice",
    //   "/getAllFaq",
    //   "/searchIndependentAssessment",
    //   "/peerjs",
    //   "/ticket",
    //   "/api-docs",
    //   "/swagger.json",
  
    // ],
  
  
    httpStatus: {
      SUCCESS: 200,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      UNPROCESSABLE_ENTITY: 422,
      INTERNAL_SERVER_ERROR: 500,
      SERVICE_UNAVAILABLE: 503,
      GATEWAY_TIMEOUT: 504,
    },
  };
  