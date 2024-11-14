import mongoose from "mongoose";
import { Train } from "../models/trainModel.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/errorResponse.js";
import { Schedule } from "../models/scheduleModel.js";
import {redisClient} from "../config/redisConfig.js"
import geolib from 'geolib'

const createTrainService=async(req,res)=>{
    try {
        const existedTrain=await Train.findOne({trainNumber:req.body?.trainNumber})
        if(existedTrain){
            return res.send(new ApiError(403,"Train Already Exists!"))
        }
        const train=await Train.create(req.body)
        if(!train){
            return res.send(new ApiError(301,"Train Creatio Failed! Try Again"))
        }
        return res.send(new ApiResponse(train,200,"Train Created Successfuly"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

const findTrainBetweenStaionService=async(req,res)=>{
    try {
        const {boardingStationCode,destinationStationCode}=req.body
        const trains = await Schedule.aggregate([
            {
                $match: {
                    stations: {
                        $all: [
                            { $elemMatch: { stationCode: boardingStationCode } },
                            { $elemMatch: { stationCode: destinationStationCode } }
                        ]
                    }
                }
            },
            // Step 2: Unwind stations array to access individual stations
            { $unwind: "$stations" },
            // Step 3: Filter for only the boarding and destination stations
            {
                $match: {
                    "stations.stationCode": { $in: [boardingStationCode, destinationStationCode] }
                }
            },
            // Step 4: Group stations back together
            {
                $group: {
                    _id: "$_id",
                    trainId: { $first: "$trainId" },
                    boardingStation: {
                        $first: {
                            $cond: [{ $eq: ["$stations.stationCode", boardingStationCode] }, "$stations", null]
                        }
                    },
                    destinationStation: {
                        $last: {
                            $cond: [{ $eq: ["$stations.stationCode", destinationStationCode] }, "$stations", null]
                        }
                    }
                }
            },
            {
                $lookup:{
                    from:"trains",
                    foreignField:"_id",
                    localField:"trainId",
                    as:"trainDeatils"
                }
            },
            {
                $addFields:{
                    trainDetails:"$trainDeatils"
                }
            },
            {
                $project: {
                    trainId: 1,
                    boardingStation: 1,
                    destinationStation: 1,
                    trainDetails:1
                }
            }
        ])

        let boardingStationCoordinates=  { latitude: trains[0].boardingStation.location.coordinates[0], longitude:  trains[0].boardingStation.location.coordinates[1] };
        let destinationStationCoordinates= { latitude: trains[0].destinationStation.location.coordinates[0], longitude:  trains[0].destinationStation.location.coordinates[1] };


    
        const distance = geolib.getDistance(boardingStationCoordinates, destinationStationCoordinates) / 1000;

        trains.distance=distance
        console.log( `${distance} km`, trains)
        if(!trains.length){
            return res.json(new ApiError(404,"No direct trains for this route!"))
        }
        return res.json(new ApiResponse(trains,200,"Train fecthed"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

const getAllTrainService=async(req,res)=>{
    try {
        const allTrains=await Train.find().populate("schedule").exec()
        if(!allTrains.length){
            return res.send(new ApiError(404,"No Train Found!"))
        }
        // console.log(allTrains[0].route[0])
        return res.send(new ApiResponse(allTrains,200,"Train Fetched"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

const getTrainByIdService=async(req,res)=>{
    try {
        const trainId=req.query.id
        if(!trainId){
            return res.send(new ApiError(404,"Invalid Train Number!"))
        }
        // const train=await Train.findById({_id:trainId})
        const train= await Train.aggregate([
            {
                $match:{_id:new mongoose.Types.ObjectId(trainId)}
            },
            {
                $lookup:{
                    from:"schedules",
                    foreignField:"trainId",
                    localField:"_id",
                    as:"StationTiming"
                }
            },
            {
                $project:{
                    "_id":0,
                    "createdAt":0,
                    "updatedAt":0,
                    "StationTiming._id":0,
                    "StationTiming.__v":0
                }
            }
        ])
        if(!train){
            return res.send(new ApiError(404,"Train Not Exists!"))
        }
        return res.send(train,200,"Train Fetched")
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

const updateTrainService=async(req,res)=>{
    try {
        const trainId=req.query.id
        const data=req.body
        if(!trainId){
            return res.send(new ApiError(404,"Invalid Train Number!"))
        }
        const train=await Train.findByIdAndUpdate({_id:trainId},data,{new:true})
        if(!train){
            return res.send(new ApiError(404,"Train Not Exists!"))
        }
        return res.send(train,200,"Train Updated")
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}


const deleteTrainService=async(req,res)=>{
    try {
        const trainId=req.query.id
        if(!trainId){
            return res.send(new ApiError(404,"Invalid Train Number!"))
        }
        const train=await Train.findByIdAndDelete({_id:trainId})
        if(!train){
            return res.send(new ApiError(404,"Train Not Exists!"))
        }
        return res.send(train,200,"Train Deleted")
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

export {createTrainService,getAllTrainService,getTrainByIdService,updateTrainService,deleteTrainService,findTrainBetweenStaionService}