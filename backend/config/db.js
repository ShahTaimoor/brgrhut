const mongoose = require('mongoose');
const dns = require('dns');
const logger = require('../utils/logger');

// Windows machines that get an IPv6 link-local resolver (fe80::1) from their
// router cause Node's DNS client to fail SRV lookups with ECONNREFUSED.
// Force a public resolver so mongodb+srv:// lookups work regardless of the
// OS-assigned DNS server.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
    try {
        // MongoDB connection options for slow networks
        const mongooseOptions = {
            serverSelectionTimeoutMS: 30000, // 30 seconds to select server
            socketTimeoutMS: 60000, // 60 seconds for socket operations
            connectTimeoutMS: 30000, // 30 seconds to establish connection
            maxPoolSize: 10, // Maximum number of connections in pool
            minPoolSize: 5, // Minimum number of connections in pool
            maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
            retryWrites: true,
            retryReads: true,
        };

        // First, establish the connection
        await mongoose.connect(process.env.MONGO_URI, mongooseOptions);
        logger.info('MongoDB connected successfully');
        
        // Check if the 'email_1' index exists
        const indexes = await mongoose.connection.db.collection('users').indexes();
        const emailIndex = indexes.find(index => index.name === 'email_1');
        
        // If the index exists, drop it
        if (emailIndex) {
            const result = await mongoose.connection.db.collection('users').dropIndex('email_1');
            logger.info('Email index dropped successfully', { result });
        } else {
            logger.debug('Email index does not exist');
        }
    } catch (error) {
        logger.error('MongoDB connection failed', { error: error.message, stack: error.stack });
    }
};

module.exports = connectDB;
