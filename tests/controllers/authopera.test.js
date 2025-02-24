import fastify from 'fastify';
import app from '../../app.js'; 
import Users from '../../models/Users.js'; 
import Logs from '../../models/Logs.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';





// jest.mock('../../middleware/authmiddle.js', () =>
//     jest.fn(async (request, reply) => {
//         reply.send(); 
//     })
// );

//jest.mock('../../middleware/authmiddle.js', () => jest.fn(async (request, reply) => reply));

jest.mock('../../models/Users.js'); 
jest.mock('../../models/Logs.js');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');







dotenv.config();

beforeAll(async () => {
    await app.listen(3044); // Ensure the Fastify app is running on port 3044
});

afterAll(async () => {
    await app.close(); // Close the app after tests

});

afterEach(() => {
    jest.clearAllMocks();
})

/// FOR REGISTRATION 

// test-case-1:  Testing if the user already exists
describe("testing the registration of user", () => {

    test("should respond with 400 status code when user already exits", async () => {
        // Mock findOne to return a user with the username 'testname'
        Users.findOne.mockResolvedValue({ username: 'testname' });

        const response = await app.inject({
            method: 'POST',
            url: '/auth/register',
            payload: { username: 'testname', password: 'T@est1password', email: 'testemail@gmail.com', role: 'admin' }
        });

        expect(response.statusCode).toBe(403);
        expect(JSON.parse(response.body)).toEqual({ error: 'Username already exists. Try with another username' });

    });
});

// test-case -2: Testing the /register for all success cases
describe("testing the /registering the user", () => {
    test("should respond with a 201 status code", async () => {
        Users.findOne.mockResolvedValue(null);

        const mockSave = jest.fn().mockResolvedValue({});
        Users.prototype.save = mockSave;

        const response = await app.inject({
            method: 'POST',
            url: '/auth/register',
            payload: {
                username: "username",
                password: "T@1assword",
                email: "sachin@gmail.com",
                role: "admin"
            }
        });

        expect(response.statusCode).toBe(201);
        expect(JSON.parse(response.body)).toEqual({ message: 'user created successfully' });

        expect(mockSave).toHaveBeenCalledTimes(1);
    });
})

describe("testing the /registering the user", () => {

    test("should specify json in the content-type header", async () => {

        Users.findOne.mockResolvedValue(null);

        const mockSave = jest.fn().mockResolvedValue({});
        Users.prototype.save = mockSave;

        const response = await app.inject({
            method: 'POST',
            url: '/auth/register',
            payload: {
                username: "username",
                password: "pT@1assword",
                email: "email@gmail.com",
                role: "admin"
            }
        });

        expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
        expect(mockSave).toHaveBeenCalledTimes(1);
    });

})



// test-case -3 : testing the misssing any content :
describe("testing when username or password or email or role is missing", () => {
    test("should respond with a status code of 400 if any field is missing", async () => {

        const bodydata = [
            { username: "username", password: "pas@1Qsword", email: "email@gmail.com" },  // Missing role
            { username: "username", password: "pas@1Qsword", role: "admin" },     // Missing email
            { username: "username", email: "email@gmail.com", role: "admin" },            // Missing password
            { password: "pas@1Qsword", email: "email@gmail.com", role: "admin" },            // Missing username
            { username: "username", password: "pas@1Qsword" },                    // Missing email, role
            { username: "username", email: "email@gmail.com" },                          // Missing password, role
            { username: "username", role: "admin" },                            // Missing password, email
            { email: "email@gmail.com", role: "admin" },                                  // Missing username, password
            { password: "pas@1Qsword", email: "email@gmail.com" },                          // Missing username, role
            { password: "pas@1Qsword", role: "admin" },                            // Missing username, email
            { username: "username" },                                          // Missing password, email, role
            { password: "pas@1Qsword" },                                          // Missing username, email, role
            { email: "email@gmail.com" },                                                // Missing username, password, role
            { role: "admin" },                                                  // Missing username, password, email
            {}                                                                 // Missing all fields
        ];

        for (let i = 0; i < bodydata.length; i++) {
            const response = await app.inject({
                method: 'POST',
                url: '/auth/register',
                payload: bodydata[i]
            });


        
            expect(response.statusCode).toBe(400);  
            expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
            const responseBody = JSON.parse(response.body);
            expect(responseBody.error).toBe('Bad Request');
            expect(responseBody.message).toEqual('Missing required fields in the body');

        }
    });
});


// Test-case-2: Testing validation for proper format of fields
describe("testing the validation of username, password, email, or role", () => {
    test("should respond with a status code of 401 if any field is invalid", async () => {

        // Test data with invalid fields
        const bodydata = [
            { username: "us", password: "T@est1password", email: "validemail@gmail.com", role: "admin" },  // Invalid username (too short)
            { username: "validusername", password: "short", email: "validemail@gmail.com", role: "admin" },  // Invalid password (too short)
            { username: "validusername", password: "T@est1password", email: "invalidemail", role: "admin" },  // Invalid email
            { username: "validusername", password: "T@est1password", email: "validemail@gmail.com", role: "invalidrole" },  // Invalid role
        ];

        for (let i = 0; i < bodydata.length; i++) {

            const response = await app.inject({
                method: 'POST',
                url: '/auth/register',
                payload: bodydata[i]
            });

            expect(response.statusCode).toBe(401);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
            const responseBody = JSON.parse(response.body);
            expect(responseBody.error).toBe('Bad Request');
            expect(responseBody.message).toEqual('Validation failed body requirement not matching has per the requirements');

           
        }
    });
});




// Test Case 4: Internal server error  catch block
describe("testing when an error occurs during user creation catch block", () => {

    test("should respond with a status code of 500", async () => {

        const mockSave = jest.fn().mockRejectedValue(new Error('Database error'));

        Users.prototype.save = mockSave;
        const bodydata = {
            username: "username",
            password: "paH@1ssword",
            email: "email@gamil.com",
            role: "admin"
        };

        const response = await app.inject({
            method: 'POST',
            url: '/auth/register',
            payload: bodydata
        });

        expect(response.statusCode).toBe(500);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
        expect(JSON.parse(response.body)).toEqual({
            error: "error creating the user"
        })
        expect(mockSave).toHaveBeenCalledTimes(1);
    })
})



// // ++++++++++++++++++++++++++++++++++++++++++++ TEST CASES FOR THE LOGIN FUNCTIONALITY +++++++++++++++++++++++++++++++++++++++++++++++++++++++





// Test Case 1: User not found (Invalid username)
describe("testing the login functionality", () => {

    test("testing when user name not found", async () => {

        Users.findOne.mockResolvedValue(null);

        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: { username: "username", password: "pass1Q@1Aword" }
        });

        expect(response.statusCode).toBe(404);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
        expect(JSON.parse(response.body)).toEqual({
            error: "user not found"
        })
    })
})


// Test Case 2: Invalid credentials (password doesn't match)

describe("testing the login functionality", () => {
    test('should respond with a status code of 403 for invalid credentials', async () => {

        Users.findOne.mockResolvedValue({
            _id: '1',
            username: 'username',
            password: 'hashedpassword',
            role: 'user'
        })

        bcrypt.compare = jest.fn().mockResolvedValue(false);

        const bodydata = { username: "username", password: "pass1Q@1Aword" };
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: bodydata
        })

        expect(response.statusCode).toBe(403);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
        expect(JSON.parse(response.body)).toEqual({
            error: 'invalid credentials'

        })
    })
})






// Test-case-3:  Testing while login , validation for missing fields in the body
describe("testing the validation for missing fields in the body if any of username, password ", () => {
    test("should respond with a status code of 400 if any field is invalid", async () => {

        // Test data with invalid fields
        const bodydata = [
            { password: "T@est1password" },
            { username: "validusername" },
            {}
        ];

        for (let i = 0; i < bodydata.length; i++) {

            const response = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: bodydata[i]
            });

         
            expect(response.statusCode).toBe(400); 
            expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));

            const responseBody = JSON.parse(response.body);

            expect(responseBody.error).toBe('Bad Request');
            expect(responseBody.message).toEqual('Missing required fields in the body');
        }
    });
});




// Test-case-4:  Testing while login , validation for proper format of the input fields
describe("testing the validation of username, password", () => {
    test("should respond with a status code of 400 if any field is invalid", async () => {
        
        const bodydata = [
            { username: "us", password: "T@est1password" },  
            { username: "validusername", password: "short" },  

        ];

        for (let i = 0; i < bodydata.length; i++) {

            const response = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: bodydata[i]
            });

            expect(response.statusCode).toBe(401);  
            expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));

            const responseBody = JSON.parse(response.body);

            expect(responseBody.error).toBe('Bad Request');
            expect(responseBody.message).toEqual('Validation failed body requirement not matching');

        }
    });
});





// Test Case 5: Internal server error (bcrypt.compare throws error) catch block

describe("testing when an error occurs during login", () => {

    test("should respond with a status code of 500", async () => {
        Users.findOne.mockResolvedValue({
            _id: '1',
            username: 'username',
            password: 'hashedPassword',
            role: 'user',

        });

        bcrypt.compare = jest.fn().mockRejectedValue(new Error('Database error'));

        const bodydata = {
            username: "username",
            password: "pass@A1word"
        }

        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: bodydata
        });
        expect(response.statusCode).toBe(500);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
        expect(JSON.parse(response.body)).toEqual({
            error: 'Error while logging in the user'
        })
    })

})



// // Test Case 6: Successful login (correct username and password)

describe("testing the login functionality", () => {
    test('should respond with a status code of 200 for successfully logged in user', async () => {

        Users.findOne.mockResolvedValue({
            _id: '1',
            username: 'username',
            password: 'hasedpassword',
            role: 'user'
        });

        bcrypt.compare = jest.fn().mockResolvedValue(true);

        const mockToken = 'mockedToken.mockedToken.mockedToken';
        jwt.sign = jest.fn().mockReturnValue(mockToken);

        Logs.findOne = jest.fn().mockResolvedValue(null); // Simulating no existing log
       Logs.prototype.save = jest.fn().mockResolvedValue(true);


        const bodydata = { username: 'username', password: 'pass1Q@1Aword' };

        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: bodydata
        })

        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'))
        expect(JSON.parse(response.body)).toEqual({
            token: 'mockedToken.mockedToken.mockedToken'
        });

    });
});


// // ++++++++++++++++++++++++++++++++++++++++++++ TEST CASES FOR THE LOGOUT FUNCTIONALITY +++++++++++++++++++++++++++++++++++++++++++++++++++++++


// when authorization header is invalid 

describe("Testcases for the logout functionality", () => {

    let mockToken;
    let mockUserLog;

    beforeEach(() => {
        mockToken = 'mockedToken.mockedToken.mockedToken';

        jwt.verify.mockReturnValue({ id: 'mockUserId', role: 'user' });

        mockUserLog = {
            _id: 'log123',
            UserId: 'mockUserId',
            logintime: new Date(),
            logouttime: null,
            UserToken: mockToken,
            save: jest.fn().mockResolvedValue(true)
        };

      


    });


    test("should respond with the 400 status code for invalid header or token format is incorrect  in logout functionality", async () => {

       
        Logs.findOne.mockResolvedValue(mockUserLog);
        const invalidHeadersTestCases = [
            {}, // No Authorization header
            { Authorization: "" }, // Empty Authorization
            { Authorization: "Bearer" }, // Missing token
            { Authorization: "Bearer " }, // Missing token after space
            { Authorization: "Bearer.invalid.token" }, // Invalid format
            { Authorization: "RandomToken 12345" }, // Wrong prefix
            { Authorization: "Bearer12345" }, // No space after Bearer
            { Authorization: "Bearer mockedToken" }, // Only one part of JWT
        ];

        for (let i = 0; i < invalidHeadersTestCases.length; i++) {

            const response = await app.inject({
                method: 'POST',
                url: '/auth/logout',
                headers: invalidHeadersTestCases[i]

            })



            expect(response.statusCode).toBe(400);  
            expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
            const responseBody = JSON.parse(response.body);
            expect(responseBody.error).toBe('Bad Request');
            expect(responseBody.message).toEqual('Validation failed in the header requirement not matching');
                                                
        }

    }),

    

    test("should return 200 and successfully log out the user", async () => {

        // const mockUserLog1 = {
        //     _id: 'log123',
        //     UserId: 'mockUserId',
        //     logintime: new Date(),
        //     logouttime: new Date(),
        //     UserToken: null,
        //     save: jest.fn().mockResolvedValue(true)
        // };
        Logs.findOne.mockResolvedValue(mockUserLog);
       
        const response = await app.inject({
            method: 'POST',
            url: '/auth/logout',
            headers: {
                'Authorization': `Bearer ${mockToken}`,
            },
        });


        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
        const responseBody = JSON.parse(response.body);

        expect(responseBody.message).toBe('user logged out successfully');

    }),

    test("should return 500 status when Logs.findOne throws an error", async () => {

        Logs.findOne.mockRejectedValue(new Error('error while logout of the current-user'));
        
        const response = await app.inject({
            method: 'POST',
            url: '/auth/logout',
            headers: {
                Authorization: `Bearer ${mockToken}`,
            },
        });


        expect(response.statusCode).toBe(500);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));

        const responseBody = JSON.parse(response.body);

        expect(responseBody.error).toEqual('error while logout of the current-user');
    }),





    test("should return 400 if no active session is found for the user", async () => {

        
        Logs.findOne.mockResolvedValue(null);

         const response = await app.inject({
             method: 'POST',
             url: '/auth/logout',
             headers: {
                 Authorization: `Bearer ${mockToken}`  
             },
         });
 
      
         expect(response.statusCode).toBe(403);
         expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
 
         const responseBody = JSON.parse(response.body);
 
        
       
         expect(responseBody.error).toEqual('User is logged out, access denied');
     }),

     test("should return 403 if the token is invalid or expired", async () => {
        // Mock JWT verification failure

       

        jwt.verify.mockImplementation(() => {
            throw new Error("Invalid token");
        });

        const mockToken = "invalid.mocked.token";

        const response = await app.inject({
            method: 'POST',
            url: '/auth/logout', 
            headers: { Authorization: `Bearer ${mockToken}` }
        });

        // Log response for debugging
        console.log("Response Body:", response.body);

        expect(response.statusCode).toBe(403);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));

        const responseBody = JSON.parse(response.body);
        expect(responseBody.error).toEqual('Invalid or expired token');
    });
})

