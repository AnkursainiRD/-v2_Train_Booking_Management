class ApiResponse {
    constructor(data = null,statusCode = 200,message, success = true, ) {
      this.data = data;
      this.success = success;
      this.message=message
      this.statusCode = statusCode;
    }
}

export default ApiResponse;