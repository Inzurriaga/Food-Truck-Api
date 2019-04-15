import { request } from "http";

const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.locals.trucks = [
    {
        id: 123,
        name: "hamburger Joint",
        cuisine: [],
        position: [39.75050,-104.99878]
    },
    {
        id: 234,
        name: "picante grille",
        cuisine: [],
        rating: [],
        position: [39.75085,-104.99870]
    },
    {
        id: 345,
        name: "taco tacos", 
        cuisine: [],
        rating: [],
        position: [39.75082,-104.99879]
    },
    {
        id: 456,
        name: "dog house",
        cuisine: [],
        rating: [],
        position: [39.75086,-104.99871]
    },
    {
        id: 567,
        name: "this is a food truck",
        cuisine: [],
        rating: [],
        position: [39.75685,-104.99670]
    },
    {
        id: 789,
        name: "the gabriel joint",
        cuisine: [],
        rating: [],
        position: [39.76085,-104.90870]
    }
];

const distanceCalutation = (userLatit, userLong, truckLatit, truckLong) =>  {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(truckLatit-userLatit);  // deg2rad below
    var dLon = deg2rad(truckLong-userLong); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(userLatit)) * Math.cos(deg2rad(truckLatit)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = (R * c) * 0.6214; // Distance in miles
    return d;
  }
  
const  deg2rad = (deg) => {
    return deg * (Math.PI/180)
  }

const grabTruck = (userDistance, userLatit, userLong) => {
    const truck = app.locals.trucks.filter(truck => {
        return distanceCalutation(userLatit, userLong, truck.position[0], truck.position[1]) <= userDistance
    })
    return truck
}

app.post("/api/truck", (request, response) => {
    const { distance, long, latit } = request.body
    const trucklist = grabTruck(distance, latit, long)
    response.status(200).json(trucklist)
})

export default app;