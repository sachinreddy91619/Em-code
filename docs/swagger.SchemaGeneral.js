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

