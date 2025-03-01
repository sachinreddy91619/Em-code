import '../instrument.js';

import * as Sentry from "@sentry/node";

import Event from '../models/Events.js';

import app from '../app.js';


//to get the all events from the database
export const getAllEvents = async (request, reply) => {

    try {

        //const allevents=await Event.find({});

        const allevents = await Event.aggregate([
            { $match: {} },
            { $group: { _id: null, count: { $sum: 1 }, events: { $push: "$$ROOT" } } }
        ]);


        console.log(allevents[0].count);

        console.log(allevents[0].events)

        const formattedResponse = {
            "All Events Count In App:": allevents[0].count,
            "Events": allevents[0].events
        };

        reply.send(formattedResponse);




    } catch (err) {
        Sentry.captureException(err);
        reply.status(500).send({ error: "Server error while retrieving all events from Events Model" });
    }
};


export const mostbookings = async (request, reply) => {

    try {

        const mostbooking = await Event.find(
            {
                $expr: {
                    $gt: ["$bookedseats", {
                        $ceil: {
                            $divide:
                                [{ $multiply: ["$totalseats", 80] }, 100]
                        }
                    }]
                }
            }
        )
        console.log("mosting booking events:", mostbooking);

        reply.status(200).send(mostbooking);

    }
    catch (err) {
        Sentry.captureException(err);
        reply.status(500).send({ error: "Server error while retrieving most booked events" });

    }
}

