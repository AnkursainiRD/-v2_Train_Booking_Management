import {body,validationResult} from 'express-validator'
import ApiError from '../utils/errorResponse.js'

const validateValues=()=>[
    body("userName").notEmpty().withMessage("Username is required!"),
    body("password").notEmpty().withMessage("Password is required!"),
    body("email").isEmail().withMessage("Email is required!"),
    body("role").notEmpty().withMessage("Role is required!"),   
]

const validateTrainValues=()=>[
    //trainName,trainNumber,route,arivalTime,departmentTime  avalibleSeats,date,totalSeats
    // body("trainNumber").notEmpty().withMessage("Train Number is required!"),
    // body("trainName").notEmpty().withMessage("Train Name is required!"),
    // body("route").notEmpty().withMessage("Route is required!"),
    // body("schedule.arivalTime").notEmpty().withMessage("Arival Time is required!"),
    // body("schedule.departureTime").notEmpty().withMessage("Departure Time is required!"),
    // body("seatAvailiblity.avalibleSeats").notEmpty().withMessage("Mention The Availble Seat is required!"),
    // body("seatAvailiblity.date").notEmpty().withMessage("Date is required!"),
    // body("seatAvailiblity.totalSeats").notEmpty().withMessage("Mention The Total Seat is required!")
    // const { body, checkSchema } = require('express-validator');

// Validation rules
   
    // trainNumber - required, must be a string
    body('trainNumber').isString().withMessage('Train number must be a string')
                       .notEmpty().withMessage('Train number is required'),
    
    // trainName - required, must be a string
    body('trainName').isString().withMessage('Train name must be a string')
                     .notEmpty().withMessage('Train name is required'),
    
    // route - required, must be an array of strings
    body('route').isArray().withMessage('Route must be an array of strings')
                 .notEmpty().withMessage('Route is required')
                 .custom(route => route.every(station => typeof station === 'string'))
                 .withMessage('Each station in the route must be a string'),
    
    // schedule - object with required time fields
    body('schedule').isObject().withMessage('Schedule must be an object'),
    body('schedule.departureTime').isString().withMessage('Departure time must be a string in HH:mm format')
                                  .notEmpty().withMessage('Departure time is required'),
    body('schedule.arivalTime').isString().withMessage('Arrival time must be a string in HH:mm format')
                               .notEmpty().withMessage('Arrival time is required'),
    
    // seatAvailiblity - array of objects with specific fields
    body('seatAvailiblity').isArray().withMessage('Seat availability must be an array'),
    body('seatAvailiblity.*.date').isISO8601().withMessage('Date must be in ISO format')
                                  .notEmpty().withMessage('Date is required'),
    body('seatAvailiblity.*.avalibleSeats').isInt({ min: 0 }).withMessage('Available seats must be a non-negative integer')
                                          .notEmpty().withMessage('Available seats are required'),
    body('seatAvailiblity.*.totalSeats').isInt({ min: 1 }).withMessage('Total seats must be an integer greater than 0')
                                        .notEmpty().withMessage('Total seats are required'),
    // body('seatAvailiblity.*.reservedSeats').isArray().withMessage('Reserved seats must be an array of strings')
    //                                        .custom(seats => seats.every(seat => typeof seat === 'string'))
    //                                        .withMessage('Each reserved seat must be a string'),
];



const validateScheduleValues=()=>[
    //trainId,station,arivalTime,departureTime
    body("trainId").notEmpty().withMessage("Train Id is required!"),
    body("routes.*.station").notEmpty().withMessage("Station is required!"),
    body("routes.*.arivalTime").notEmpty().withMessage("Arival Time is required!"),
    body("routes.*.departureTime").notEmpty().withMessage("Departure Time is required!"),
]

const valueValidateService=async(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.send(new ApiError(400,{errors:errors.array()}))
    }
    next()
}

export {validateValues,validateTrainValues,validateScheduleValues,valueValidateService}