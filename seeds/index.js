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
    for(let i = 0 ; i < 50 ; i ++ ) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const c = new Campground({
            author: '62401043b646be6217a9dc8e',
            title : `${sample(descriptors)} ${sample(places)}`,
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            image : `https://source.unsplash.com/collection/483251`,
            description : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis ad aut ex provident quisquam voluptas modi? Unde veritatis praesentium accusamus eveniet repellendus dicta magnam a sunt, sequi assumenda rerum beatae.',
            price: price
        });
        await c.save();
    }
}
seedDb().then(() => {
    mongoose.connection.close();
})