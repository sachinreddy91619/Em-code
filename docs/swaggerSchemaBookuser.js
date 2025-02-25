export const LocationUSwagger = {
    schema: {
        description: "Save user location (Authenticated Users Only)",
        tags: ["BOOKING-USER"],
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
        body: {
            type: "object",
            properties: {
                eventneedlocation: {
                   // type: "string",
                    example: "Hyderabad",
                    description: "Location needed for the event"
                }
            },
            // required: ["eventneedlocation"]
        },
        response: {
            200: {
                description: "Location saved successfully",
                type: "object",
                properties: {
                    message: { type: "string", example: "Location saved for this user" }
                }
            },
            400: {
                description: "Bad request (validation error in the header)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "The authorization header is required, to provide the location of the user"}
                }
            },
            405: {
                description: "Bad request (validation error in the body , here it is not matching has per the requirements)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "The body is not matching has per  requirements, to provide the location of the user"}
                }
            },
  //from the middle ware errors the responses are :
  406: {
    description: "user is logged out so need to re login. {from the middleware}.",
    type: "object",
    properties: {
        error: { type: "string", example: "User is logged out, access denied" }
    }
},
498: {
    description: "invalid token or expired token {from the middleware}.",
    type: "object",
    properties: {
        error: { type: "string", example: "Invalid or expired token" }
    }
},


            // 401: {
            //     description: "Unauthorized request (invalid token or permissions)",
            //     type: "object",
            //     properties: {
            //         error: { type: "string", example: "Unauthorized" },
            //         message: { type: "string", example: "Invalid or missing authentication token." }
            //     }
            // },
            500: {
                description: "Server error",
                type: "object",
                properties: {
                    message: { type: "string", example: "getting the error while giving the event location" }
                }
            }
        }
    }
};

export const EventsForLocationUSwagger = {
    schema: {
        description: "Get events based on the user's saved location (Authenticated Users Only)",
        tags: ["BOOKING-USER"],
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
                description: "List of events for the user's location",
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "679a61e495e3ea757f90448e" },
                        userId: { type: "string", example: "679a611595e3ea757f90448b" },
                        eventname: { type: "string", example: "Tech Meetup 2025" },
                        eventdate: { type: "string", format: "date", example: "2025-08-20" },
                        eventlocation: { type: "string", example: "Hyderabad" },
                        eventtime: { type: "string", example: "18:00:00" },
                        amountrange: { type: "number", example: 10 },
                        totalseats: { type: "number", example: 100 },
                        availableseats: { type: "number", example: 78 },
                        bookedseats: { type: "number", example: 22 }
                    },
                },
            },
            400: {
                description: "Bad request (validation errors , here error is in the header ",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "The authorization header is required, to get the events for the particular location." }
                }
            },
            404: {
                description: "user not provided the location",
                type: "object",
                properties: {
                    message: { type: "string", example: "Please provide your location first." }
                }
            },
            405: {
                description: "No events found for the user's location",
                type: "object",
                properties: {
                    message: { type: "string", example: "No events found for this location" }
                }
            },
              //from the middle ware errors the responses are :
              406: {
                description: "user is logged out so need to re login. {from the middleware}.",
                type: "object",
                properties: {
                    error: { type: "string", example: "User is logged out, access denied" }
                }
            },
            498: {
                description: "invalid token or expired token {from the middleware}.",
                type: "object",
                properties: {
                    error: { type: "string", example: "Invalid or expired token" }
                }
            },
            500: {
                description: "Server error",
                type: "object",
                properties: {
                    error: { type: "string", example: "Server error while retrieving events." }
                }
            }
        }
    }
};


export const EventitUSwagger = {
    schema: {
        description: "Book an event by specifying the number of seats (Authenticated Users Only)",
        tags: ["BOOKING-USER"],
        security: [{ BearerAuth: [] }], // Requires authentication
        params: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                   // pattern: "^[0-9a-fA-F]{24}$",
                    description: "Event ID (MongoDB ObjectId format)",
                    example: "65d9f5e7b2eabc1234567890"
                }
            },
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

        },
        body: {
            type: "object",
            properties: {
                NoOfSeatsBooking: { 
                    //type: "number", 
                    description: "Number of seats to book",
                    example: 2 }
            },

        },

        response: {
            200: {
                description: "Event booked successfully",
                type: "object",
                properties: {
                    _id: { type: "string", example: "679a61e495e3ea757f90448e" },
                    eventid: { type: "string", example: "679a61e495e3ea757f90448e" },
                    eventManager: { type: "string", example: "John Doe" },
                    eventManagerEmail: { type: "string", example: "johndoe@example.com" },
                    eventname: { type: "string", example: "Tech Meetup 2025" },
                    eventdate: { type: "string", format: "date", example: "2025-08-20" },
                    eventlocation: { type: "string", example: "Hyderabad" },
                    eventtime: { type: "string", example: "18:00:00" },
                    amountrange: { type: "number", example: 10 },
                    NoOfSeatsBooking: { type: "number", example: 2 },
                    eventBookedBy: { type: "string", example: "Alice Smith" },
                    email: { type: "string", example: "alicesmith@example.com" },
                    AmountNeedPay: { type: "number", example: 20 },
                    userId: { type: "string", example: "679a611595e3ea757f90448b" }
                }
            },
            400: {
                description: "Bad request (validation errors or missing fields)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "The authorization header is required, while booking the no of seats for the event"}
                }
            },
            405: {
                description: "Bad request here missing the fields in the body)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "The  body is missing the required format while booking the event"}
                }
            },
            408: {
                description: "Event is fully booked",
                type: "object",
                properties: {
                    message: { type: "string", example: "event is fully booked" }
                }
            },
            410: {
                description: "Event is fully booked",
                type: "object",
                properties: {
                    message: { type: "string", example: "maximum number of seats can be booked :${event.availableseats}, so please reduce the number of seats" }
                }
            },
              //from the middle ware errors the responses are :
              406: {
                description: "user is logged out so need to re login. {from the middleware}.",
                type: "object",
                properties: {
                    error: { type: "string", example: "User is logged out, access denied" }
                }
            },
            498: {
                description: "invalid token or expired token {from the middleware}.",
                type: "object",
                properties: {
                    error: { type: "string", example: "Invalid or expired token" }
                }
            },
            500: {
                description: "Server error",
                type: "object",
                properties: {
                    error: { type: "string", example: "Server error while booking the event." }
                }
            }
        }
    }
};




export const GetAllUSwagger = {
    schema: {
        description: "Retrieve all bookings for the authenticated user",
        tags: ["BOOKING-USER"],
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

        },
        response: {
            200: {
                description: "Successfully retrieved all bookings for the user",
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "679a61e495e3ea757f90448e" },
                        eventid: { type: "string", example: "679a61e495e3ea757f90448e" },
                        eventManager: { type: "string", example: "John Doe" },
                        eventManagerEmail: { type: "string", example: "johndoe@example.com" },
                        eventname: { type: "string", example: "Tech Meetup 2025" },
                        eventdate: { type: "string", format: "date", example: "2025-08-20" },
                        eventlocation: { type: "string", example: "Hyderabad" },
                        eventtime: { type: "string", example: "18:00:00" },
                        amountrange: { type: "number", example: 10 },
                        NoOfSeatsBooking: { type: "number", example: 2 },
                        eventBookedBy: { type: "string", example: "Alice Smith" },
                        email: { type: "string", example: "alicesmith@example.com" },
                        AmountNeedPay: { type: "number", example: 20 },
                        userId: { type: "string", example: "679a611595e3ea757f90448b" }
                    }
                }
            },
            400: {
                description: "Bad request ( invalid authorization header)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "The authorization header is required, to get the all of  bookings for this user" }
                }
            },
              //from the middle ware errors the responses are :
              406: {
                description: "user is logged out so need to re login. {from the middleware}.",
                type: "object",
                properties: {
                    error: { type: "string", example: "User is logged out, access denied" }
                }
            },
            498: {
                description: "invalid token or expired token {from the middleware}.",
                type: "object",
                properties: {
                    error: { type: "string", example: "Invalid or expired token" }
                }
            },
            500: {
                description: "Server error",
                type: "object",
                properties: {
                    error: { type: "string", example: "Server error while retrieving all bookings" }
                }
            }
        }
    }
};



export const BookingUSwagger = {
    schema: {
        description: "Update the number of seats in an existing booking (Authenticated Users Only)",
        tags: ["BOOKING-USER"],
        security: [{ BearerAuth: [] }], // Requires authentication
        params: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                    //pattern: "^[0-9a-fA-F]{24}$",
                    description: "Booking ID (MongoDB ObjectId format)",
                    example: "67bb5b1d2d2dcf2ff5fcf43c"
                }
            },
            //required: ["id"]
        },
        headers: {
            type: "object",
            properties: {
                Authorization: {
                  // type: "string",
                    description: "Bearer token for authentication",
                    example: "Bearer your_jwt_token_here"
                }
            },
            //required: ["Authorization"]
        },
        body: {
            type: "object",
            properties: {
                NoOfSeatsBooking: {
                    //type: "number",
                    description: "Updated number of seats to book",
                    example: 5
                }
            },
            //required: ["NoOfSeatsBooking"]
        },
        response: {
            200: {
                description: "Booking updated successfully",
                type: "object",
                properties: {
                    _id: { type: "string", example: "67bb5b1d2d2dcf2ff5fcf43c" },
                    eventid: { type: "string", example: "67bb05727378475620a68456" },
                    eventManager: { type: "string", example: "Virat" },
                    eventManagerEmail: { type: "string", example: "Virat@example.com" },
                    eventname: { type: "string", example: "Isha-event" },
                    eventdate: { type: "string", format: "date", example: "2043-02-03" },
                    eventlocation: { type: "string", example: "nkd" },
                    eventtime: { type: "string", example: "18:15:10" },
                    amountrange: { type: "number", example: 1000 },
                    NoOfSeatsBooking: { type: "number", example: 5 },
                    eventBookedBy: { type: "string", example: "Iyer" },
                    email: { type: "string", example: "Iyer@example.com" },
                    AmountNeedPay: { type: "number", example: 5000 },
                    userId: { type: "string", example: "67bb433447d1ae255518cf53" }

                }
            },
            208: {
                description: "No change in booking",
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "you are given same number of seats, so no changes in your booking"
                    }
                }
            },
            400: {
                description: "Bad request (validation errors in the header )",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "The authorization header is required, while updating the bookings of  the no of seats for the event"}
            },
            },

            405: {
                description: "Bad request (validation errors the body is not matching has per the requirements)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "The Body is not Matching has per the requirements, give correct body for updation"}
            },
            },
            408: {
                description: "Bad request (validation errors the Params  is not matching has per the requirements)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "The params is not Matching has per the requirements, give correct params id for updation"}
            },
            },
            410: {
                description: "Bad request (validation errors , event not found for the given id while updation)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "event not found for the given params id while updation"}
            },
            },

            415: {
                description: "Bad request (No of seats are not available for the booking)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "maximum number of seats can be booked :${event1.availableseats}, so please reduce the number of seats"}
            },
            },
              //from the middle ware errors the responses are :
              406: {
                description: "user is logged out so need to re login. {from the middleware}.",
                type: "object",
                properties: {
                    error: { type: "string", example: "User is logged out, access denied" }
                }
            },
            498: {
                description: "invalid token or expired token {from the middleware}.",
                type: "object",
                properties: {
                    error: { type: "string", example: "Invalid or expired token" }
                }
            },



            
            // 404: {
            //     description: "Booking not found",
            //     type: "object",
            //     properties: {
            //         message: { type: "string", example: "Booking not found or unavailable." }
            //     }
            // },
            500: {
                description: "Server error",
                type: "object",
                properties: {
                    error: { type: "string", example: "Server error while updating the booking." }
                }
            }
        }
    }
};


export const DeleteUSwagger = {
    schema: {
        description: "Cancel an event booking by providing the booking ID (Authenticated Users Only)",
        tags: ["BOOKING-USER"],
        security: [{ BearerAuth: [] }], // Requires authentication

        params: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                    //pattern: "^[0-9a-fA-F]{24}$",
                    description: "Booking ID (MongoDB ObjectId format)",
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
                description: "Event booking cancelled successfully",
                type: "object",
                properties: {
                    message: { type: "string", example: "event booking cancelled successfully" }
                }
            },
            400: {
                description: "Bad request (validation errors in the header)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "The authorization header is required, while cancelling the event booking" }
                }
            },
            405: {
                description: "Bad request (validation errors the params is not matching has per the requirements)",
                type: "object",
                properties: {
                    error: { type: "string", example: "Bad Request" },
                    message: { type: "string", example: "The params is not Matching has per the requirements, give correct params id for cancelling the event booking"}
            },
        },
        408: {
            description: "Bad request (validation errors the params is not matching has per the requirements)",
            type: "object",
            properties: {
               
                message: { type: "string", example: "bookings not found"}
        },
    },
      //from the middle ware errors the responses are :
      406: {
        description: "user is logged out so need to re login. {from the middleware}.",
        type: "object",
        properties: {
            error: { type: "string", example: "User is logged out, access denied" }
        }
    },
    498: {
        description: "invalid token or expired token {from the middleware}.",
        type: "object",
        properties: {
            error: { type: "string", example: "Invalid or expired token" }
        }
    },

            500: {
                description: "Server error",
                type: "object",
                properties: {
                    error: { type: "string", example: "Server error while deleting the booking." }
                }
            }
        }
    }
};



