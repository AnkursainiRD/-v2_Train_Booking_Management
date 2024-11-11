import {body,validationResult} from 'express-validator'
import ApiError from '../utils/errorResponse.js'

const validateValues=()=>[
    body("userName").notEmpty().withMessage("Username is required!"),
    body("password").notEmpty().withMessage("Password is required!"),
    body("email").isEmail().withMessage("Email is required!"),
    body("role").notEmpty().withMessage("Role is required!") 
]

const validateTrainValues=()=>[
    body('trainNumber').isString().withMessage('Train number must be a string')
                       .notEmpty().withMessage('Train number is required'),
    
    // trainName - required, must be a string
    body('trainName').isString().withMessage('Train name must be a string')
                     .notEmpty().withMessage('Train name is required'),
    body('seatAvailiblity').isArray().withMessage('Seat availability must be an array'),
    body('seatAvailiblity.*.date').isISO8601().withMessage('Date must be in ISO format')
                                  .notEmpty().withMessage('Date is required'),
    body('seatAvailiblity.*.avalibleSeats').isInt({ min: 0 }).withMessage('Available seats must be a non-negative integer')
                                          .notEmpty().withMessage('Available seats are required'),
    body('seatAvailiblity.*.totalSeats').isInt({ min: 1 }).withMessage('Total seats must be an integer greater than 0')
                                        .notEmpty().withMessage('Total seats are required')
];



const validateScheduleValues=()=>[
    //trainId,station,arivalTime,departureTime
    body('trainId').isMongoId().withMessage('Train ID must be a valid MongoDB ObjectId'),
    body('trainNumber').isString().withMessage('Train number must be a string').notEmpty().withMessage('Train number is required'),

    body('routeName').isString().withMessage('Route name must be a string').notEmpty().withMessage('Route name is required'),

    // routeCode must be a non-empty string
    body('routeCode').isString().withMessage('Route code must be a string').notEmpty().withMessage('Route code is required'),
    // stations must be an array
    body('stations').isArray({ min: 1 }).withMessage('Stations must be an array with at least one station'),

    // Validate each station in the stations array
    body('stations.*.stationCode').isString().withMessage('Station code must be a string').notEmpty().withMessage('Station code is required'),

    body('stations.*.stationName').isString().withMessage('Station name must be a string').notEmpty().withMessage('Station name is required'),
    // location should be a valid GeoJSON Point object with [longitude, latitude]
    body('stations.*.location.type').equals('Point').withMessage('Location type must be "Point"'),
    body('stations.*.location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of two numbers [longitude, latitude]')
        .custom((coordinates) => {
            const [longitude, latitude] = coordinates;
            return (
                typeof longitude === 'number' &&
                typeof latitude === 'number' &&
                longitude >= -180 &&
                longitude <= 180 &&
                latitude >= -90 &&
                latitude <= 90
            );
        })
        .withMessage('Coordinates must contain valid longitude and latitude'),

    // stopNumber must be a positive integer
    body('stations.*.stopNumber').isInt({ min: 1 }).withMessage('Stop number must be a positive integer'),

    // Optional fields for arrival and departure times; if provided, they must match a time format
    body('stations.*.arrivalTime').optional().matches(/^([0-9]{1,2}):([0-9]{2}) (AM|PM)$/).withMessage('Arrival time must be in the format "hh:mm AM/PM"'),

    body('stations.*.departureTime').optional().matches(/^([0-9]{1,2}):([0-9]{2}) (AM|PM)$/).withMessage('Departure time must be in the format "hh:mm AM/PM"'),


]

const valueValidateService=async(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.send(new ApiError(400,{errors:errors.array()}))
    }
    next()
}

export {validateValues,validateTrainValues,validateScheduleValues,valueValidateService}