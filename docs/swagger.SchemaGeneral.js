export const getallevents = {
    schema: {
        tags: ["GENERAL OPERATIONS"],
        response: {
            200: {
                description: "To get the total count of events and the list of all events from the events collection",
                type: "object",
                properties: {
                    "All Events Count In App:": {
                        type: "number",
                        example: 73
                    },
                    "Events": {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                eventname: { type: "string", example: "Tech Conference 2025" },
                                eventdate: {
                                    type: "string",
                                    example: "2025-07-15"
                                },
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
                }
            },

            500: {
                description: "Server error",
                type: "object",
                properties: {
                    error: { type: "string", example: "Server error while retrieving all events from Events Model" }
                }
            }



        }

    }

};

export const Mostbookings = {

    schema: {

        tags: ["GENERAL OPERATIONS"],
        response: {

            200: {
                description: "Most booked Events in App:",
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "60f7b2c8e9f3c20017045a2c" },
                        eventname: { type: "string", example: "Tech Conference 2025" },
                        eventdate: {
                            type: "string",
                            // format: "date",
                            example: "2025-07-15"
                        },
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
            500: {
                description: "Server error",
                type: "object",
                properties: {
                    error: { type: "string", example: "Server error while retrieving most booked events" }
                }
            }
        }
    }

}


export const demoSchema = {
    schema: {
        tags: ["GENERAL OPERATIONS"],
        querystring: {
            type: "object",
            properties: {
                eventname: {
                    type: "string",
                    description: "Comma-separated event names to filter",
                    example: "Tech Conference 2025,AI Summit"
                },
                amountrange: {
                    type: "number",
                    description: "Maximum amount range for filtering events",
                    example: 1500
                },
                eventlocation: {
                    type: "string",
                    description: "Comma-separated event locations to filter",
                    example: "Hyderabad,Bangalore"
                }
            }
        },
        response: {
            200: {
                description: "Successfully retrieved filtered events",
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        eventname: { type: "string", example: "Tech Conference 2025" },
                        eventdate: { type: "string", example: "2025-07-15" },
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
            500: {
                description: "Server error",
                type: "object",
                properties: {
                    error: { type: "string", example: "Server error for the demo" }
                }
            }
        }
    }
};

//==========================================



// export const demoSchema = {
//     schema: {
//         tags: ["GENERAL OPERATIONS"],
//         querystring: {
//             type: "object",
//             additionalProperties: {
//                 oneOf: [
//                     { type: "string" },
//                     { type: "number" }
//                 ],
//                 description: "Dynamic query parameters (e.g., eventname, amountrange, eventlocation, etc.)",
//                 example: "Tech Conference 2025"
//             }
//         },
//         response: {
//             200: {
//                 description: "Successfully retrieved filtered events",
//                 type: "array",
//                 items: {
//                     type: "object",
//                     properties: {
//                         eventname: { type: "string", example: "Tech Conference 2025" },
//                         eventdate: { type: "string", example: "2025-07-15" },
//                         eventlocation: { type: "string", example: "Hyderabad" },
//                         amountrange: { type: "number", example: 1500 },
//                         eventtime: { type: "string", example: "18:30:00" },
//                         totalseats: { type: "integer", example: 200 },
//                         availableseats: { type: "integer", example: 180 },
//                         bookedseats: { type: "integer", example: 20 },
//                         userId: { type: "string", example: "60f7b2c8e9f3c20017045a2d" },
//                         __v: { type: "number", example: 0 }
//                     }
//                 }
//             },
//             500: {
//                 description: "Server error",
//                 type: "object",
//                 properties: {
//                     error: { type: "string", example: "Server error for the demo route" }
//                 }
//             }
//         }
//     }
// };


