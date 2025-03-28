


import '../instrument.js';

import * as Sentry from "@sentry/node";
import fastify from 'fastify';
import Event from '../models/Events.js';
import EventLoc from '../models/EventLoc.js';
import User from '../models/Users.js';
import EMB from '../models/EMB.js';
import app from '../app.js';
// const app = fastify({
//     logger: true
// });



// The is the  main route for posting the data in to the data-base

//  logic for creating an event
export const createEvent = async (request, reply) => {

    console.log("this is the starting of the create route");
    console.log(request.body)

    let { eventname, eventdate, eventlocation, amountrange, eventtime, totalseats, availableseats, bookedseats } = request.body;


    const eventDate = new Date(eventdate);
    const currentDate = new Date();

    if (eventDate <= currentDate) {
        return reply.status(405).send({
            error: 'Bad Request',
            message: 'Event date must be in the future.',
        });
    }

    try {
        eventlocation = eventlocation.toLowerCase();
        const event = new Event({
            eventname,
            eventdate,
            eventlocation,
            amountrange,
            eventtime,
            totalseats,
            availableseats,
            bookedseats,
            userId: request.user.id,
        });

        // console.log(event)
        // await event.save();
        // console.log("data saved to the database first time for this entry");
        // reply.send(event);
        const savedEvent = await event.save();
        console.log("data saved to the database first time for this entry");
        return reply.status(200).send({ event: savedEvent });


    } catch (err) {
        Sentry.captureException(err);
        reply.status(500).send({ error: 'Database save failed,Error creating the Event' })
    }

};


// This is the route for getting the events
export const getevent = async (request, reply) => {
    try {


        const isAdmin = request.user.role === 'admin';

        // const admins = await User.find({ role: 'admin' });
        if (isAdmin) {
            const event = await Event.find({ userId: request.user.id });
            reply.send(event);



        }
        // else {

        //     const userlocation = await EventLoc.findOne({
        //         userId: request.user.id
        //     })
        //         .sort({ createdAt: -1 }) // Sort by
        //         .limit(1);


        //     console.log(userlocation, "sachin sachin sachin sachin sachin")

        //     if (!userlocation) {
        //         return reply.status(404).send({ message: "Please provide your location first." })
        //     }

        //     const loc = userlocation.eventneedlocation.toLowerCase();

        //     // Find events based on the user's location
        //     const event1 = await Event.find({ eventlocation: loc });

        //     if (!event1 || event1.length === 0) {
        //         return reply.status(404).send({ message: "No events found for this location" });
        //     }

        //     reply.send(event1);
        // }
        //[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
        //     const loc = await EventLoc.find({});
        //     console.log(request.user.id)
        //     console.log(loc)


        //     let t = loc[loc.length - 1].eventneedlocation;
        //     console.log(t)

        //     const loc1 = t.toLowerCase();
        //     const event1 = await Event.find({ eventlocation: loc1 })

        //     if (!event1) {
        //         return reply.status(404).send({ message: "location not matched" })
        //     }
        //     reply.send(event1);
        // }


    } catch (error) {
        Sentry.captureException(error);
        reply.status(500).send({ error: 'Database failed while getting the events data,Error triggering the catch block' });
    }
};



// This is the route for getting all the events 
export const getbyid = async (request, reply) => {

    try {
        const event = await Event.findById(request.params.id);

        if (!event || event.userId.toString() !== request.user.id) {
            return reply.status(404).send({ error: "event not found" })
        }

        reply.send(event);

    } catch (err) {
        Sentry.captureException(err);
        reply.status(500).send({ error: 'Internal Server Error while while executing the getbyId' })
    }
}


// This is the route for updating an event
export const updateevent = async (request, reply) => {


    const { eventname, eventdate, eventlocation, amountrange, eventtime } = request.body;


    const eventDate = new Date(eventdate);
    const currentDate = new Date();

    if (eventDate <= currentDate) {
        return reply.status(405).send({
            error: 'Bad Request',
            message: 'Event date must be in the future.',
        });
    }


    try {
        const event = await Event.findById(request.params.id);
        console.log(event, "result come ")

        if (!event || event.userId.toString() !== request.user.id) {
            return reply.status(404).send({ error: 'event not found' })
        }


        const updateData = {};

        if (eventname) updateData.eventname = eventname;
        if (eventdate) updateData.eventdate = eventdate;
        if (eventlocation) updateData.eventlocation = eventlocation;
        if (amountrange) updateData.amountrange = amountrange;
        if (eventtime) updateData.eventtime = eventtime;
        // if (eventname) event.eventname = eventname;
        // if (eventdate) event.eventdate = eventdate;
        // if (eventlocation) event.eventlocation = eventlocation;
        // if (amountrange) event.amountrange = amountrange;
        // if (eventtime) event.eventtime = eventtime;

        // await event.save();
        // reply.send(event);
        const updatedEvent = await Event.findByIdAndUpdate(request.params.id,
            { $set: updateData }, { new: true, runValidators: true });

        if (!updatedEvent) {
            return reply.status(400).send({ error: 'Event updating failed !This is what i found' })
        }

        reply.status(200).send(updatedEvent);

    } catch (err) {
        Sentry.captureException(err);
        reply.status(500).send({ error: "Internal Server Error while updating the event" });

    }
};


// This is the route for deleting an event

export const deleteevent = async (request, reply) => {
    try {

        // const event = await Event.findById(request.params.id);
        // if (!event || event.userId.toString() !== request.user.id) {
        //     return reply.status(400).send({ error: 'event not found' })
        // }

        // await event.deleteOne();
        // reply.status(200).send({ message: 'event deleted successfully' });


        // const event1 =await Event.findByIdAndDelete(request.params.id);
        // if(event1){
        // reply.status(200).send({ message: 'event deleted successfully' });
        // }

        const event = await Event.findByIdAndDelete(request.params.id);
        if (!event || event.userId.toString() !== request.user.id) {
            return reply.status(404).send({ error: 'event not found' })
        }



        reply.status(200).send({ message: 'event deleted successfully' });



    } catch (err) {
        Sentry.captureException(err);
        reply.status(500).send({ error: 'Internal Server Error while deleting the event' });

    }
};







// ==================================================================================================================================



// This is the  route for using the location 
export const loc = async (request, reply) => {
    const { eventneedlocation } = request.body;
    try {

        // const existinglocation = await EventLoc.findOne({
        //     userId: request.user.id
        // })

        // if (existinglocation) {
        //     return reply.status(400).send({ message: "location already exist" })

        // }
        const event = new EventLoc({
            eventneedlocation,
            userId: request.user.id
        });
        console.log(request.user.id)

        // await EventLoc.createIndex({"createdAt":1},{
        //     expireAfterSeconds:240

        //     })

        await event.save();

        reply.status(200).send({ message: "location saved for this user" });

    } catch (err) {
        Sentry.captureException(err);
        reply.status(500).send({ message: "getting the error while giving the event location" })
    }
}



// This is the route for getting events based on the location
export const locationevent = async (request, reply) => {
    try {


        const userlocation = await EventLoc.findOne({
            userId: request.user.id
        })
            .sort({ createdAt: -1 }) // Sort by
            .limit(1);


        console.log(userlocation)

        if (!userlocation) {
            return reply.status(404).send({ message: "Please provide your location first." })
        }

        const loc = userlocation.eventneedlocation.toLowerCase();

        // Find events based on the user's location
        const event1 = await Event.find({ eventlocation: loc });

        const x = await Event.aggregate([{ $match: { eventlocation: loc } }, { $group: { _id: null, count: { $sum: 1 } } }]);

        console.log("To know the cout of the  given location:", x)

        if (!event1 || event1.length === 0) {
            return reply.status(405).send({ message: "No events found for this location" });
        }

        console.log(event1)
        //reply.send(event1);
        // reply.send({ "No Of Event Found  for this location": x[0].count, event1 });
        reply.send({
            "No Of Event Found  for this location": x.length > 0 ? x[0].count : 0,
            "Events": event1 // Explicitly defining the key as "Events"
        });


    }
    catch (err) {
        Sentry.captureException(err);
        reply.status(500).send({ error: "Server error while retrieving events." })
    }
}




// This is the route for event booking 
export const eventbook = async (request, reply) => {

    const { NoOfSeatsBooking } = request.body;





    try {



        //const event=await Event.find({ _id: request.params.id }); 
        const event = await Event.findById(request.params.id);

        if (event.availableseats === 0) {
            return reply.status(408).send({ message: "event is fully booked" })
        }


        if (NoOfSeatsBooking > event.availableseats) {
            return reply.status(410).send({ message: `maximum number of seats can be booked :${event.availableseats}, so please reduce the number of seats` })

        }



        console.log(event)

        // reply.send(event);

        const e = event.userId;
        console.log(e)

        const user = await User.findById(e);
        console.log(user)
        const eventid = event._id;
        console.log(eventid)

        const eventname = event.eventname;
        const eventdate = event.eventdate;
        const eventlocation = event.eventlocation;
        const amountrange = event.amountrange;
        const eventtime = event.eventtime;
        const eventManager = user.username;
        const eventManagerEmail = user.email;
        console.log(request.user.id)


        const n = await User.findById(request.user.id);
        console.log(n)
        const eventBookedBy = n.username;
        const email = n.email;
        const AmountNeedPay = event.amountrange * NoOfSeatsBooking

        console.log({ eventManager, eventManagerEmail, eventname, eventdate, eventlocation, amountrange, eventtime, eventBookedBy, email })

        const com = new EMB({
            eventid,
            eventManager,
            eventManagerEmail,
            eventname,
            eventdate,
            eventlocation,
            amountrange,
            eventtime,

            NoOfSeatsBooking,
            eventBookedBy,
            email,
            AmountNeedPay,
            userId: request.user.id
        })

        await com.save();
        console.log(com)
        reply.status(200).send(com);
        //const event1=await User.findById(request.user.id);


        const event1 = await Event.findById(request.params.id);


        event1.bookedseats = event1.bookedseats + com.NoOfSeatsBooking,

            event1.availableseats = event1.totalseats - event1.bookedseats

        await event1.save();

    } catch (err) {
        Sentry.captureException(err);
        reply.status(500).send({ error: "Server error while booking the event." })
    }

}


// This is the route to get all the bookings
export const getallbookings = async (request, reply) => {

    try {
        console.log(request.user.id, "sachin")
        const event = await EMB.find({ userId: request.user.id });
        // const event = await EMB.find({});
        reply.status(200).send(event);

    }
    catch (err) {
        Sentry.captureException(err);
        reply.status(500).send({ error: "Server error while retrieving all bookings" });

    }
}


// This is the route to update the booking
export const booking = async (request, reply) => {

    const { NoOfSeatsBooking } = request.body;

    try {
        console.log(request.user.id, "fecthing the user id")
        const book = await EMB.findByIdAndUpdate(request.params.id);
        console.log(book, "this is booking data")

        if (!book || book.userId.toString() !== request.user.id) {
            return reply.status(410).send({ error: 'event not found for the given params id while updation' })
        }


        const event1 = await Event.findByIdAndUpdate(book.eventid);


        if (NoOfSeatsBooking > event1.availableseats) {
            return reply.status(415).send({ message: `maximum number of seats can be booked :${event1.availableseats}, so please reduce the number of seats` })
        }

        // if (NoOfSeatsBooking) {
        //     book.NoOfSeatsBooking = NoOfSeatsBooking;
        // }
        if (book.NoOfSeatsBooking === NoOfSeatsBooking) {
            return reply.status(208).send({ message: "you are given same number of seats,so no changes in your booking" })

        }

        // if (NoOfSeatsBooking === 0) {
        //     return reply.status(400).send({ message: "no of seats cannot be zero" });
        // }

        if (NoOfSeatsBooking) {

            if (book.NoOfSeatsBooking > NoOfSeatsBooking) {
                console.log(event1.availableseats, "availableseats-before")

                event1.availableseats = event1.availableseats + (book.NoOfSeatsBooking - NoOfSeatsBooking);
                console.log(event1.availableseats, "availableseats-after")
                console.log(event1.bookedseats, "bookedseats-before")
                event1.bookedseats = event1.totalseats - event1.availableseats
                console.log(event1.bookedseats, "bookedseats-after")
                book.AmountNeedPay = NoOfSeatsBooking * event1.amountrange
                console.log(book.NoOfSeatsBooking, "bookedseats-Before")
                book.NoOfSeatsBooking = NoOfSeatsBooking;
                console.log(book.AmountNeedPay, "sai")
                console.log(NoOfSeatsBooking)
                console.log(event1.amountrange)

            }

            else if (book.NoOfSeatsBooking < NoOfSeatsBooking) {
                console.log(event1.availableseats, "availableseats-before")


                event1.availableseats = event1.availableseats - (NoOfSeatsBooking - book.NoOfSeatsBooking);
                console.log(event1.availableseats, "availableseats-after")
                console.log(event1.bookedseats, "bookedseats-before")
                event1.bookedseats = event1.totalseats - event1.availableseats
                console.log(event1.bookedseats, "bookedseats-after")
                book.AmountNeedPay = NoOfSeatsBooking * event1.amountrange
                console.log(book.NoOfSeatsBooking, "bookedseats-Before")
                book.NoOfSeatsBooking = NoOfSeatsBooking;
                console.log(book.AmountNeedPay)
                console.log(NoOfSeatsBooking)
                console.log(event1.amountrange)

            }


        }
        await event1.save();
        await book.save();
        reply.status(200).send(book);

        console.log("this nkd")


    }
    catch (err) {
        Sentry.captureException(err);

        reply.status(500).send({ error: "Server error while updating the booking." });

    }
}





// this is the route for cancelling the booking
export const eventdelete = async (request, reply) => {


    try {

        // const event = await EMB.findById(request.params.id);

        // if (!event || event.userId.toString() !== request.user.id) {
        //     return reply.status(400).send({ error: 'bookings not found' });
        // }

        // const d = event.NoOfSeatsBooking;

        // const event1 = await Event.findByIdAndUpdate(event.eventid);
        // event1.bookedseats = event1.bookedseats - d;
        // event1.availableseats = event1.totalseats - event1.bookedseats;

        // await event1.save();


        // await event.deleteOne();
        // reply.status(200).send({ message: 'event booking cancelled successfully' });


        const event = await EMB.findByIdAndDelete(request.params.id);

        if (!event || event.userId.toString() !== request.user.id) {
            return reply.status(408).send({ message: "bookings not found" });
        }

        const d = event.NoOfSeatsBooking;

        const event1 = await Event.findByIdAndUpdate(event.eventid);
        event1.bookedseats = event1.bookedseats - d;
        event1.availableseats = event1.totalseats - event1.bookedseats;

        await event1.save();



        reply.status(200).send({ message: 'event booking cancelled successfully' });

    }

    catch (err) {
        Sentry.captureException(err);
        reply.status(500).send({ error: "Server error while deleting the booking." });
    }
}