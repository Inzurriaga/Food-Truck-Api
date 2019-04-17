const express = require("express");
const app = express();
const cors = require("cors");
global.fetch = require("node-fetch");
app.use(cors());
app.use(express.json());

app.locals.trucks = [
    {
        id: 123,
        name: "Chibby Wibbitz Sliderz n Bitez",
        type: ["Burgers", "Sandwiches", "Tacos"],
        descrip: "Providing fresh, made to order small bitez that are both healthy and satisfyingly delicious!",
        site: "http://chibbywibbitz.com/",
        position: [39.75050,-104.99878]
    },
    {
        id: 234,
        name: "The Spicy Kitchen",
        type: ["Mexican", "American"],
        descrip: "From tacos and tortas to burgers and dogs. We offer affordable catering to feed all needs. Authentic Mexican Cuisine and a twist on American classics. Family heirloom recipes. Here at TSK we strive to give our customers the best service and quality of products. Skillful preperation, fresh, made from scratch ingredients. Gourmet style. Our bakers make decadent desserts and cakes. Book online or by phone. Serving the local community and public events. Vegan/Vegetarian options available.",
        site: "https://www.tskfoodtruck.com/",
        position: [39.75085,-104.99070]
    },
    {
        id: 345,
        name: "Kona Ice of South Central Denver",
        type: ["shave icecream", "icecream"],
        descrip: "We're the coolest shaved ice truck around! Plus, we're mobile. That means we bring the party to you! Corporate events, birthday parties, school fundraising",
        site: "https://www.kona-ice.com/local-site/kona-ice-of-south-central-denver/",
        position: [39.75082,-104.99879]
    },
    {
        id: 456,
        name: "Church of Cupcakes",
        type: ["cupcakes"],
        descrip: "Like churchgoers to church, cupcakes are something we have faith in. From the bottom of our toes to the tips of our frosting-tipped noses, they make our soul happy. So we started it ourselves: A faith-based community to celebrate The Cupcake. Welcome!",
        site: "http://www.churchofcupcakes.com",
        position: [39.76086,-104.99971]
    },
    {
        id: 567,
        name: "Hamburghini",
        type: ["Burgers", "Comfort Food", "Mac 'n Cheese"],
        descrip: "A pimped out truck that has an inspired hockey themed menu, but specializes in gourmet burgers, Mac N ' Cheese bowls, and many more delicious creations...so whether it is our signature Hab Burger...Peter Forsberg, or Patrick Roy....you will not be disappointed with anything you choose.",
        site: "http://www.hamburghini.net",
        position: [39.75685,-104.99670]
    },
    {
        id: 789,
        name: "Roll It Up Sushi Truck",
        type: ["Seafood", "Asian Fusion"],
        descrip: "Denver's original street sushi. A leap from traditional sushi with a new spin, giving you the best of both worlds.",
        site: "https://www.rollitupsushitruck.com/",
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
    const trucks = app.locals.trucks.filter(truck => {
        return distanceCalutation(userLatit, userLong, truck.position[0], truck.position[1]) <= userDistance
    })
    const trucksWithDistance = trucks.map(truck => {
        const distance = distanceCalutation(userLatit, userLong, truck.position[0], truck.position[1])
        return {...truck, distance}
    })
    const SortedTrucksWithDistance = trucksWithDistance.sort((a, b) => {
        return a.distance - b.distance
    })
    return SortedTrucksWithDistance
}

const fetchAddressCoordinates = async (address) => {
    const addressURl = address.split(" ").join("+")
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${addressURl}&key=AIzaSyCM3dcUZQVSfuCV4R2ijORw_xPIieQvX_Y`, {
        method: "POST"
    })
    const data = await response.json()
    return data
}

app.get("/api/:id", (request, response) => {
    const truck = app.locals.trucks.find(truck => request.params.id == truck.id)
    response.status(200).json(truck)
})

app.post("/api/truck", (request, response) => {
    const { distance, long, latit } = request.body
    const trucklist = grabTruck(distance, latit, long)
    response.status(200).json(trucklist)
})


app.post("/api/truck/update", async (request, response) => {
    const { distance, address } = request.body
    const fetchAddress = await fetchAddressCoordinates(address)
    const {lat, lng} = fetchAddress.results[0].geometry.location
    const trucklist = grabTruck(parseInt(distance), lat, lng)
    const truckData = {trucklist, position: [lat, lng]}
    response.status(200).json(truckData)
})


export default app;