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
        position: []
    },
    {
        id: 234,
        name: "picante grille",
        position: []
    },
    {
        id: 345,
        name: "taco tacos", 
        position: []
    },
    {
        id: 456,
        name: "dog house",
        position: []
    },
    {
        id: 567,
        name: "this is a food truck",
        position: []
    },
    {
        id: 789,
        name: "the gabriel joint",
        position: []
    }
];

app.post("/api/truck", (request, response) => {
    response.status(200).json(app.locals.trucks)
})

export default app;