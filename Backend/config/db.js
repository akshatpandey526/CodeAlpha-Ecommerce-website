const mongoose = require('mongoose');
const dns = require('dns');

// Force using Google and Cloudflare DNS to bypass Jio network SRV resolution issue
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    }
    catch (error) {
        console.log('mongoDB connction Failed', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;