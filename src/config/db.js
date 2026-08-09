const mongoose = require("mongoose");
const dns = require("dns");

// Force Node.js to use Google Public DNS for SRV lookups
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log("Database Connection Failed");
        console.log(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;