
import '../instrument.js';

import * as Sentry from "@sentry/node";

import app from '../app.js';
import fastify from 'fastify';
import bcrypt from 'bcrypt';
import User from '../models/Users.js';
import Logs from '../models/Logs.js';
import jwt from 'jsonwebtoken';
import joi from 'joi';

import speakeasy from 'speakeasy';

import nodemailer from 'nodemailer';



console.log("Starting authopera.js...");


export const otpStore = {}

// THE REGISTRATION CONTROLLER LOGIC 
export const register = async (request, reply) => {
    const { username, password, email, role } = request.body;



    try {

        const existingUser = await User.findOne({ username });
        console.log("Checking for existing user:", username, "Found:", existingUser);
        //DONE
        if (existingUser) {

            return reply.status(403).send({ error: 'Username already exists. Try with another username' });
        }

        const user = new User({ username, email, password, role });

        await user.save();
        //  reply.status(201).send({user})
        console.log("Sending success response: user created");
        console.log("The endUser registered,with the  details:", user)
        //DONE
        reply.status(201).send({ message: 'user created successfully' });
        // reply.status(201).send({user})
    }
    catch (err) {
        //  console.error('Error creating the user',err);
        //  console.error("Error during user registration:", err);
        Sentry.captureException(err);

        return reply.status(500).send({ error: 'error creating the user' });

    }
}


export const otpGeneration = async (request, reply) => {

    const { username } = request.body;

    try {

        const user = await User.findOne({ username })


        console.log("checking for the user for the password updating Before :", user)


        console.log("user email is :", user.email)

        if (!user) {
            return reply.status(404).send({
                error: 'Bad Request',
                message: 'User not found ! Please enter a valid username,if you are a new user please register first'
            })
        }

        // OTP GENERATING LOGIC USING THE SPEAKEASY MODULE



        // OTP GENERATING LOGIC USING THE SPEAKEASY MODULE
        // Generate a secret key with a length
        // of 20 characters
        const secretkey = speakeasy.generateSecret({ length: 20 });

        // Generate a TOTP code using the secret key
        const Otpcode = speakeasy.totp({

            // Use the Base32 encoding of the secret key
            secret: secretkey.base32,

            // Tell Speakeasy to use the Base32 
            // encoding format for the secret key
            encoding: 'base32',

            window: 10
        });


        otpStore[username] = { secretKey: secretkey.base32, user };

        console.log("Otpcode is with the secretkey  and the token:", Otpcode);

        // Log the secret key and TOTP code
        // to the console
        console.log('Secret: ', secretkey.base32);
        console.log('Code: ', Otpcode);




        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: 'your-mail@gmail.com',
        //         pass: 'your-app-password'
        //     }
        // });




        // const transporter = nodemailer.createTransport({
        //    // service: "gmail",
        //     host: "smtp.ethereal.email",
        //     port: 587,
        //     secure: false, // true for port 465, false for other ports
        //     auth: {
        //       user: "sachin53@ethereal.email",
        //       pass: "jn7jnAPss4f63QBp6D",
        //     },
        //   });

        // dummy email credentials for checking purpose using the ethereal email
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'tia.morissette19@ethereal.email',
                pass: 'ZhEpMPfV7Wq6f7r1cx'
            }
        })



        await transporter.sendMail({
            from: 'sachin53@ethereal.email',
            to: user.email,
            subject: 'OTP Verification',
            text: `Your OTP for verification is: ${Otpcode} and The secret key is :${secretkey.base32}`
        });



        console.log("Secret key stored in the request object:", request.secretKey);
        console.log("User info stored in the request object:", request.user);

        return reply.status(200).send('OTP sent successfully To your provided Email-id');


    } catch (err) {
        Sentry.captureException(err);
        return reply.status(500).send({ error: 'Internal Server Error while while executing the optGeneration' });

    }
}

// Password updation controller logic
export const passwordUpdation = async (request, reply) => {

    // const { username, email, password, otp, secretkey } = request.body;

    const { email, password, otp, } = request.body;

    const { secretKey, user } = request;



    console.log("======================================================================================")

    console.log(request.secretKey);
    console.log(request.user);

    try {
        //const user = await User.findOne({ username })

        console.log("checking for the user for the password updating Before :", user)


        console.log("user email is :", user.email)

        if (!user) {
            return reply.status(404).send({
                error: 'Bad Request',
                message: 'User not found ! Please enter a valid username,if you are a new user please register first'
            })
        }
        if (email) {
            user.email = email;
        }
        if (password) {
            // user.password=await bcrypt.hash(password,10);
            user.password = password;
            console.log(user.password)

        }
        console.log("the key for otp updation is:")

        if (otp) {

            const isValid = speakeasy.totp.verify({ secret: secretKey, encoding: 'base32', token: otp, window: 10 });

            console.log(isValid);


            console.log("the otp in th ebody is :", otp);

            //  console.log("the secret key in the body is :", secretkey);

            if (!isValid) {
                return reply.status(401).send({ message: 'Invalid OTP! please enter the valid OTP' })
            }

            console.log("Otp verification:", isValid);

            await user.save();

            //delete otpStore[username];

            return reply.status(200).send({ message: 'OTP Verified! Password updated successfully' })




        }




        //    //await user.save();

        //     console.log("user details after updating of the password:",user)
        //     return reply.status(200).send({message:'Password updated successfully'}) 

    }
    catch (err) {
        Sentry.captureException(err);
        return reply.status(500).send({ error: 'Error while updating the password' })

    }
}

// THE LOGIN CONTROLLER LOGIC 
export const login = async (request, reply) => {


    const { username, password } = request.body;
    // console.log("Login attempt:", { username });  // Debugging login request


    try {
        const user = await User.findOne({ username });
        console.log("User found for login:", user ? user._id : "No user found");
        //DONE
        if (!user) {
            return reply.status(404).send({ error: 'user not found' });
        }


        console.log("user details while logging in:", user);
        console.log("before comparing the password", user.password);


        const ismatch = await bcrypt.compare(password, user.password);

        console.log("Password match:", ismatch);
        //DONE
        if (!ismatch) return reply.status(403).send({ error: 'invalid credentials' });

        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, process.env.SEC);

        //  reply.status(200).send({token});
        console.log(token);
        const data = await User.findOne({ username });
        //console.log(data, "hey iam doing good hey iam doing good here ")
        // Userid=data._id;

        const existingLog = await Logs.findOne({ UserId: user._id })

        console.log(existingLog, "exisiting loger details here");
        //DONE
        if (existingLog) {
            console.log("Existing log found, updating log:", existingLog);
            existingLog.UserId = user._id,

                existingLog.logintime = Date.now(),

                existingLog.logouttime = null,

                existingLog.UserToken = token

            await existingLog.save();
            console.log("Existing log updated:", existingLog);
            // console.log("Existing log updated:", existingLog);
        }
        else {
            console.log("No existing log found, creating new log.");
            const user1 = new Logs({
                //Userid:user._id,
                UserId: user._id,

                logintime: Date.now(),

                logouttime: null,

                UserToken: token
            });

            await user1.save();
            console.log(user1, "document,done");

        }




        console.log("Sending login response with token:", token);
        // DONE
        reply.status(200).send({ token });

    }
    catch (err) {
        // Log the actual error message for debugging

        Sentry.captureException(err);

        reply.status(500).send({ error: 'Error while logging in the user' });
    }

};





// THE LOGOUT CONTROLLER LOGIC 
export const logout = async (request, reply) => {

    try {


        const authHeader = request.headers['authorization'];
        console.log("Logout attempt, received token:", authHeader);
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return reply.status(401).send({ error: 'token required for the logging' })
        };


        const decoded = jwt.verify(token, process.env.SEC);
        const userId = decoded.id;
        console.log(userId);

        const userlogs = await Logs.findOne({ UserId: userId });

        console.log("User logs for logout:", userlogs);

        if (!userlogs) {
            return reply.status(415).send({ message: 'No active session found for this token' });
        }


        console.log(userlogs, "user logs");
        userlogs.logouttime = Date.now();
        userlogs.UserToken = null;

        await userlogs.save();
        console.log("Logging out user, sending response.");
        reply.send({ message: 'user logged out successfully' });
    }

    catch (err) {
        //console.log('Error durign the logout', err);

        Sentry.captureException(err);
        reply.status(500).send({ error: 'error while logout of the current-user' });
    }

}
