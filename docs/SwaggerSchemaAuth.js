

export const registerSwagger = {
    schema: {
        
    
                tags: ["FOR REGISTRATION/LOGIN/LOGOUT"],
                //security: [{ BearerAuth: [] }], // Only this route has authentication
                body: {
                    type: "object",
                    properties: {
                        username: {
                            type: "string",
                            example: "john_doe",
                            description: "Unique username of the user",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "johndoe@example.com",
                            description: "User's email address",
                        },
                        password: {
                            type: "string",
                            format: "password",
                            example: "StrongP@ss123",
                            description: "User's password (must include uppercase, lowercase, number)",
                        },
                        role: {
                            type: "string",
                            enum: ["user", "admin"],
                            example: "user",
                            description: "Role of the user",
                        },
                    },
                    //required: ["username", "email", "password", "role"], // Required fields
                },
                response: {
                    201: {
                        description: "User created successfully",


                        type: "object",  // This explicitly tells Swagger it's an object
                        properties: {
                            message: { type: "string", example: "User created successfully" },
                        },


                    },

                    400: {
                        description: "Bad request missing fields errors)",

                        type: "object",
                        properties: {
                            error: { type: "string", example: "Bad Request" },
                            
                           
                                
                                message: { type: "string", example: "Missing required fields in the body"}
                        },
                    },
                    401: {
                        description: "Bad request body  validation errors)",

                        type: "object",
                        properties: {
                            error: { type: "string", example: "Bad Request" },
                            
                           
                                
                                message: { type: "string", example: "Validation failed body requirement not matching has per the requirements"}
                        },
                    },
                    403: {
                        description: "Bad request user already exists",

                        type: "object",
                        properties: {
                            error: { type: "string", example: "Bad Request" },
                            
                           
                                
                                message: { type: "string", example: "Username already exists. Try with another username"}
                        },
                    },

                //     400 _validation_error :{
                //         description: "Bad request (either missing fields or validation errors)",
                //         type: "object",
                //         properties: {
                //             error: { type: "string", example: "Bad Request" },
                //             message: { type: "string", example: "Validation failed: body requirement not matching@" }
                //     }
                // },


                    500: {
                        description: "Server error",

                        type: "object",
                        properties: {
                            error: { type: "string", example: "error creating the user" },
                        },
                    },



                },
            },
        };
    
    


export const loginSwagger = {
    schema: {
        description: "User login endpoint",
        tags: ["FOR REGISTRATION/LOGIN/LOGOUT"],
        body: {
            type: "object",

            properties: {
                username: {
                    type: "string",
                    example: "john_doe",
                    description: "Unique username of the user",
                },
                password: {
                    type: "string",
                    format: "password",
                    example: "StrongP@ss123",
                    description: "User's password (must include uppercase, lowercase, number)",
                },
            }
        },
        response: {
            200: {
                description: "Successful login",
                type: "object",
                properties: {
                    token: { type: "string", example: "JWT authentication token" }
                }
            },
            400: {
                description: " Missing fields in the body)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "Missing required fields in the body"}
                        ////
                       //  OR Validation failed body requirement not matching OR user not found OR invalid credentials" }
                }
            },

            401: {
                description: " Missing fields in the body)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "Validation failed body requirement not matching"}
                        ////
                       //  OR Validation failed body requirement not matching OR user not found OR invalid credentials" }
                }
            },
            403: {
                description: " invalid credentials while logging in)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "invalid credentials"}
                        ////
                       //  OR Validation failed body requirement not matching OR user not found OR invalid credentials" }
                }
            },
            404: {
                description: " when user not found",
                type: "object",
                properties: {
                    error: { type: "string", example: "user not found" },
                    // message: { type: "string", example: "Validation failed body requirement not matching"}
                        ////
                       //  OR Validation failed body requirement not matching OR user not found OR invalid credentials" }
                }
            },
            500: {
                description: "Internal server error",
                type: "object",
                properties: {
                    error: { type: "string", example: "Error while logging in the user" }
                }
            }
        }
    }
};

export const logoutSwagger = {
    schema: {
        description: "User logout endpoint",
        tags: ["FOR REGISTRATION/LOGIN/LOGOUT"],
        security: [{ BearerAuth: [] }],  // Requires Bearer token authentication
        headers: {
            type: "object",
            properties: {
                Authorization: {
                    type: "string",
                    description: "Bearer token for authentication",
                    example: "Bearer your_jwt_token_here"
                }
            },
            required: ["Authorization"]
        },
        response: {
            200: {
                description: "Successful logout",
                type: "object",
                properties: {
                    message: { type: "string", example: "User logged out successfully" }
                }
            },
            400: {
                description: "Bad request (validation errors or missing token)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "Validation failed in the header requirement not matching" }
                }
            },
            401: {
                description: "Unauthorized request (missing or invalid token)",
                type: "object",
                properties: {
                    error: { type: "string", example: "token required for the logging" }
                }
            },
            403: {
                description: "Unauthorized request (missing or invalid token)",
                type: "object",
                properties: {
                    message: { type: "string", example: "No active session found for this token" }
                }
            },
            500: {
                description: "Internal server error",
                type: "object",
                properties: {
                    error: { type: "string", example: "error while logout of the current-user" }
                }
            }
        }
    }
};
