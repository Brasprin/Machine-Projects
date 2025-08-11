const mongoose = require('mongoose');
require('dotenv').config(); 

const mongoURI = process.env.MONGODB_URI;

async function connectToMongo(dbName = process.env.DB_NAME) {
    try {
        await mongoose.connect(mongoURI, {dbName});
        console.log(`Database: Connected to database ~> Name: ${dbName}`);
    } catch (error) {
        console.error('Database: Error connecting to MongoDB', error);
    }
    console.log('ENV Mongo URI:', process.env.MONGODB_URI);
};
function signalHandler() {
    console.log("Database: Closing MongoDB connection...");
    mongoose.disconnect().then(() => {
        process.exit();
    }).catch(error => {
        console.error('Database: Error disconnecting from MongoDB', error);
        process.exit(1);
    });
}
process.on("SIGINT", signalHandler);
process.on("SIGTERM", signalHandler);
process.on("SIGQUIT", signalHandler);

module.exports = connectToMongo;