const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open", () => console.log("Connected to DB!"));
const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}
const seedDb = async () => {
    await Campground.deleteMany({});
    for(let i = 0 ; i < 200 ; i ++ ) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const c = new Campground({
            author: '62401043b646be6217a9dc8e',
            title : `${sample(descriptors)} ${sample(places)}`,
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/giaphong/image/upload/v1648440353/YelpCamp/z4xlzt8avsxddzxagctm.png',
                    fileName: 'YelpCamp/z4xlzt8avsxddzxagctm',
                },
                {
                  url: 'https://res.cloudinary.com/giaphong/image/upload/v1648440351/YelpCamp/lml4gisrynpbhykwpbtr.png',
                  fileName: 'YelpCamp/lml4gisrynpbhykwpbtr',
                }
            ],
            description : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis ad aut ex provident quisquam voluptas modi? Unde veritatis praesentium accusamus eveniet repellendus dicta magnam a sunt, sequi assumenda rerum beatae.',
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude, 
                    cities[random1000].latitude
                ]
            },
        });
        await c.save();
    }
}
seedDb().then(() => {
    mongoose.connection.close();
})