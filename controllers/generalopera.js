
import '../instrument.js';
import * as Sentry from "@sentry/node";
import Event from '../models/Events.js';



/**
 * // This is the controller for getting all the events
 * 
 * @param {*} request - here in the request we do not send any fields in the request body.
 * @param {*} reply - here we get the reply object which contains the count of all events and an array of all events from the Events model.
 * 
 * If there is an error while retrieving all events from the Events Model then we get a error message "Server error while retrieving all events from Events Model"
 */
export const getAllEvents = async (request, reply) => {

    try {

        const allEvents = await Event.aggregate([
            { $match: {} },
            { $group: { _id: null, count: { $sum: 1 }, events: { $push: "$$ROOT" } } }
        ]);


        let Response = {
            "All Events Count In App:": allEvents[0].count,
            "Events": allEvents[0].events
        };

        reply.send(Response);

    } catch (err) {
        Sentry.captureException(err);


        reply.status(500).send({ error: "Server error while retrieving all events from Events Model" });
    }
};




export const demo = async (request, reply) => {


    // Extracting query parameters from the request
    //working  let { eventname, eventlocation } = request.query;

    //working let {amountrange}=request.query;



    /* 
    iam getting ha response

    Empty <[Object: null prototype] {}> {
eventlocation: 'amc',
rollno: '12'
}
    */


   
    // for (let i in query) {

    //       if (i === 'amountrange') {
    //         const max=Number(query[i]);
    //         queryObject[i] = { $gte: 0, $lte:max};
    //         console.log(queryObject) // all the fields in the queryobject from the PARAMS off the postman
    //         console.log(query[i]) //max
    //       } else {
    //         queryObject[i] = query[i];
    //       }

    //   }

    let query = request.query;
    console.log(query)

    let queryObject = {};


    for (let i in query) {

        if (i === 'eventname') {

            const eventNames = query[i].split(',');
            console.log(eventNames)
            queryObject[i] = { $in: eventNames };

        } else if (i === 'amountrange') {

            const maxAmount = Number(query[i]);
            queryObject[i] = { $gte: 0, $lte: maxAmount };



        }

        else if (i === 'eventlocation') {
            const eventLocations = query[i].split(',');
            queryObject[i] = { $in: eventLocations };

        }



        else {
            queryObject[i] = query[i];
        }

    }


    try {

        console.log(queryObject, "updated before going to the database")
        const result = await Event.find(queryObject);
        // const result = await Event.find(query);

        // const result = await Event.find({ 
        //     eventname: eventname,
        //     eventlocation: eventlocation
        //   });

        // const result = await Event.find({
        //     amountrange:amountrange

        // })

        reply.status(200).send(result);


    }
    catch (err) {
        return reply.status(500).send({ error: "Server error for the demo" });
    }

}



/**
 * This controller retrieves events with the most bookings, defined as events where the
 * number of booked seats exceeds 80% of the total seats available.
 * 
 * @param {*} request - here in the request we do not send any fields in the request object and no fields required in the request body.
 * @param {*} reply - The reply object which will contain an array of events that have
 *                    the most bookings.
 * 
 * Logs the events with the most bookings to the console. In case of an error, sends a 500 status with an error message "Server error while retrieving most booked events"
 */

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