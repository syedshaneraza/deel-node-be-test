const Messages = {
  NOT_FOUND: "Resource not found.",
  UNAUTHORIZED: "Unauthorized access.",
  FORBIDDEN: "You do not have permission.",
  INTERNAL_ERROR: "Something went wrong.",
  INSUFFICIENT_FUNDS: "Insufficient balance.",
  INVALID_DEPOSIT: "Cannot deposit more than 25% of total unpaid jobs.",
  ALREADY_PAID: "Job already paid",
  PAYMENT_SUCCESS: "Payment processed successfully",
  BAD_REQUEST: "Bad request",
  JOB_NOT_FOUND: "Job not found.",
  LOCK_CONFLICT: "Update conflict. Please retry.",
  DEPOSIT_LIMIT_EXCEEDED: "Deposit exceeds 25% of total unpaid jobs.",
  INVALID_AMOUNT: "Amount must be a valid positive number.",
  USER_MISMATCH: "Users can only deposit to their own balance.",
  MISSING_PROFILE_ID: "Profile ID header is missing",
  UNAUTHORIZED_PROFILE: "Unauthorized profile",
};

module.exports = Messages;
