
export const CreateESwagger = {
    schema: {
        description: "Create a new event (Admin Only)",
        tags: ["EVENT-MANAGEMENT-ADMIN"],
        security: [{ BearerAuth: [] }], // Requires authentication
        headers: {
            type: "object",
            properties: {
                Authorization: {
                    type: "string",
                    description: "Bearer token for authentication",
                    example: "Bearer your_jwt_token_here"
                }
            },
            //s required: ["Authorization"]
        },
        body: {
            type: "object",
            properties: {
                eventname: {
                    type: "string",
                    example: "Tech Conference 2025",
                    description: "Name of the event",
                },
                eventdate: {
                    type: "string",
                    format: "date",
                    example: "2025-07-15",
                    description: "Date of the event (must be in the future)",
                },
                eventlocation: {
                    type: "string",
                    example: "Hyderabad",
                    description: "Location where the event will be held",
                },
                amountrange: {
                    type: "number",
                    example: 1500,
                    description: "Cost of attending the event",
                },
                eventtime: {
                    type: "string",
                    example: "18:30:00",
                    description: "Time of the event (24-hour format)",
                },
                totalseats: {
                    type: "integer",
                    example: 200,
                    description: "Total number of seats available",
                },
                availableseats: {
                    type: "integer",
                    example: 180,
                    description: "Number of available seats for booking",
                },
                bookedseats: {
                    type: "integer",
                    example: 20,
                    description: "Number of seats already booked",
                }
            },
            // required: [
            //     "eventname",
            //     "eventdate",
            //     "eventlocation",
            //     "amountrange",
            //     "eventtime",
            //     "totalseats",
            //     "availableseats",
            //     "bookedseats"
            // ],
        },
        response: {
            200: {
                description: "Event created successfully",
                type: "object",
                properties: {
                   
                    event: {
                        type: "object",
                        properties: {
                            _id: { type: "string", example: "60f7b2c8e9f3c20017045a2c" },
                        eventname: { type: "string", example: "Tech Conference 2025" },
                        eventdate: { type: "string", format: "date", example: "2025-07-15" },
                        eventlocation: { type: "string", example: "Hyderabad" },
                        amountrange: { type: "number", example: 1500 },
                        eventtime: { type: "string", example: "18:30:00" },
                        totalseats: { type: "integer", example: 200 },
                        availableseats: { type: "integer", example: 180 },
                        bookedseats: { type: "integer", example: 20 },
                        userId: { type: "string", example: "60f7b2c8e9f3c20017045a2d" },
                        __v: { type: "number", example: 0 }
                        }
                    }
                }
            },
            400: {
                description: "Bad request (validation errors header not matching has per requirements)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "Validation failed in the header requirement not matching 123 123" }
                }
            },
            401: {
                description: "Unauthorized request (user lacks permissions)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Unauthorized" },
                    message: { type: "string", example: "User role not having the permissions to do" }
                }
            },
            403: {
                description: "Bad request missing required fields when creating the event)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "Missing required fields in the body when creating an event" }
                }
            },
            404: {
                description: "Bad request (validation errors body not matching has per requirements)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "Validation failed body requirement not matching when creating an event" }
                }
            },
            405: {
                description: "Bad request evet date must be in the future)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "Event date must be in the future." }
                }
            },

            500: {
                description: "Server error",
                type: "object",
                properties: {
                    error: { type: "string", example: "Database save failed,Error creating the Event" }
                }
            }
        }
    }
};



export const GetESwagger = {
    schema: {
        description: "Get events based on user role (Admin & Users)",
        tags: ["EVENT-MANAGEMENT-ADMIN"],
        security: [{ BearerAuth: [] }], // Requires authentication
        headers: {
            type: "object",
            properties: {
                Authorization: {
                    type: "string",
                    description: "Bearer token for authentication",
                    example: "Bearer your_jwt_token_here"
                }
            },
            //required: ["Authorization"]
        },
        response: {
            200: {
                description: "Events fetched successfully",
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "60f7b2c8e9f3c20017045a2c" },
                        eventname: { type: "string", example: "Tech Conference 2025" },
                        eventdate: { type: "string", format: "date", example: "2025-07-15" },
                        eventlocation: { type: "string", example: "Hyderabad" },
                        amountrange: { type: "number", example: 1500 },
                        eventtime: { type: "string", example: "18:30:00" },
                        totalseats: { type: "integer", example: 200 },
                        availableseats: { type: "integer", example: 180 },
                        bookedseats: { type: "integer", example: 20 },
                        userId: { type: "string", example: "60f7b2c8e9f3c20017045a2d" },
                        __v: { type: "number", example: 0 }
                    }
                }
            },
            400: {
                description: "Bad request validation error header not matching has per requirements)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "The authorization header is required, to get the events of the particular event manager OR " }
                }
            },
            401: {
                description: "Unauthorized request",
                type: "object",
                properties: {
                    error: { type: "string", example: "Unauthorized" },
                    message: { type: "string", example: "User role not having the permissions to do" }
                }
            },
            500: {
                description: "Server error",
                type: "object",
                properties: {
                    error: { type: "string", example: "Database failed while getting the events data,Error triggering the catch block" }
                }
            }
        }
    }
};



export const GetByIdESwagger = {
    schema: {
        description: "Get event details by ID (Admin Only)",
        tags: ["EVENT-MANAGEMENT-ADMIN"],
        security: [{ BearerAuth: [] }], // Requires authentication
        params: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                    pattern: "^[0-9a-fA-F]{24}$",
                    description: "Event ID (MongoDB ObjectId format)",
                    example: "65d9f5e7b2eabc1234567890"
                }
            },
            // required: ["id"]
        },
        headers: {
            type: "object",
            properties: {
                Authorization: {
                    type: "string",
                    description: "Bearer token for authentication",
                    example: "Bearer your_jwt_token_here"
                }
            },
            // required: ["Authorization"]
        },
        response: {
            200: {
                description: "Event details retrieved successfully",
                type: "object",
                properties: {
                    _id: { type: "string", example: "60f7b2c8e9f3c20017045a2c" },
                        eventname: { type: "string", example: "Tech Conference 2025" },
                        eventdate: { type: "string", format: "date", example: "2025-07-15" },
                        eventlocation: { type: "string", example: "Hyderabad" },
                        amountrange: { type: "number", example: 1500 },
                        eventtime: { type: "string", example: "18:30:00" },
                        totalseats: { type: "integer", example: 200 },
                        availableseats: { type: "integer", example: 180 },
                        bookedseats: { type: "integer", example: 20 },
                        userId: { type: "string", example: "60f7b2c8e9f3c20017045a2d" }
                }
            },
            400: {
                description: "Bad request headers not matching has per requirements)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "The authorization header is required, to get the events of the particular event manager based on the id" }
                } 
            },

            401: {
                description: "Bad request parameters not matching has per requirements)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "params.id should match pattern \"^[0-9a-fA-F]{24}$\"" }
                } 
            },

            404: {
                description: "Event not found",
                type: "object",
                properties: {
                    error: { type: "string", example: "event not found" }
                }
            },
            500: {
                description: "Server error",
                type: "object",
                properties: {
                    error: { type: "string", example: "Internal Server Error while while executing the getbyId" }
                }
            }
        }
    }
};




export const UpdateByIdESwagger = {
    schema: {
        description: "Update an event by ID (Admin Only)",
        tags: ["EVENT-MANAGEMENT-ADMIN"],
        security: [{ BearerAuth: [] }], // Requires authentication
        params: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                    pattern: "^[0-9a-fA-F]{24}$",
                    description: "Event ID (MongoDB ObjectId format)",
                    example: "65d9f5e7b2eabc1234567890"
                }
            },
            // required: ["id"]
        },
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
        body: {
            type: "object",
            properties: {
                eventname: { type: "string", example: "Tech Meetup 2025" },
                eventdate: { type: "string", format: "date", example: "2025-08-20" },
                eventlocation: { type: "string", example: "Bangalore" },
                amountrange: { type: "number", example: 2000 },
                eventtime: { type: "string", example: "14:00:00" }
            },
            // required: ["eventdate"]
        },
        response: {
            200: {
                description: "Event updated successfully",
                type: "object",
                properties: {
                    _id: { type: "string", example: "60f7b2c8e9f3c20017045a2c" },
                        eventname: { type: "string", example: "Tech Conference 2025" },
                        eventdate: { type: "string", format: "date", example: "2025-07-15" },
                        eventlocation: { type: "string", example: "Hyderabad" },
                        amountrange: { type: "number", example: 1500 },
                        eventtime: { type: "string", example: "18:30:00" },
                        totalseats: { type: "integer", example: 200 },
                        availableseats: { type: "integer", example: 180 },
                        bookedseats: { type: "integer", example: 20 },
                        userId: { type: "string", example: "60f7b2c8e9f3c20017045a2d" }
                }
            },
            400: {
                description: "Bad request  headers  not matching has per the requirements )",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "The authorization header is required, to update the events of the particular event manager" }
                }     
            },
            401: {
                description: "Unauthorized request",
                type: "object",
                properties: {
                    error: { type: "string", example: "Unauthorized" },
                    message: { type: "string", example: "User role not having the permissions to do" }
                }
            },
            403: {
                description: "Bad request  params id is not working matching has per the requirements )",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "The id is required, to update the events of the particular event manager" }
                }     
            },
            404: {
                description: "Event not found",
                type: "object",
                properties: {
                    error: { type: "string", example: "event not found" }
                }
            },
            405: {
                description: "Bad request evet date must be in the future)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "Event date must be in the future." }
                }
            },
            500: {
                description: "Server error",
                type: "object",
                properties: {
                    error: { type: "string", example: "Internal Server Error while updating the event" }
                }
            }
        }
    }
};


export const DeleteByIdESwagger = {
    schema: {
        description: "Delete an event by ID (Admin Only)",
        tags: ["EVENT-MANAGEMENT-ADMIN"],
        security: [{ BearerAuth: [] }], // Requires authentication
        params: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                    pattern: "^[0-9a-fA-F]{24}$",
                    description: "Event ID (MongoDB ObjectId format)",
                    example: "65d9f5e7b2eabc1234567890"
                }
            },
            //required: ["id"]
        },
        headers: {
            type: "object",
            properties: {
                Authorization: {
                    type: "string",
                    description: "Bearer token for authentication",
                    example: "Bearer your_jwt_token_here"
                }
            },
            //required: ["Authorization"]
        },
        response: {
            200: {
                description: "Event deleted successfully",
                type: "object",
                properties: {
                    message: { type: "string", example: "event deleted successfully" }
                }
            },
            400: {
                description: "Bad request  headers not matching has per the requirements )",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "The authorization header is required, to delete the events of the particular event manager"}
                }
            },
            405: {
                description: "Bad request  params id is not matching has per the requirements )",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "The id is required, to delete the events of the particular event manager"}
                }
            },
            404: {
                description: "Event not found",
                type: "object",
                properties: {
                    error: { type: "string", example: "event not found" }
                }
            },
            500: {
                description: "Server error",
                type: "object",
                properties: {
                    error: { type: "string", example: "Internal Server Error while deleting the event" }
                }
            }
        }
    }
};
