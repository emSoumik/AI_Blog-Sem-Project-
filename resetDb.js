const mongoose = require('mongoose');

async function resetDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb+srv://abhisheknair616:faceless123@cluster0.8eyay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        
        // Get the users collection
        const collection = mongoose.connection.collection('users');
        
        // Drop all indexes
        await collection.dropIndexes();
        console.log('All indexes dropped');
        
        // Optional: Drop the collection entirely to start fresh
        await collection.drop();
        console.log('Users collection dropped');
        
        console.log('Database reset successful');
    } catch (error) {
        console.error('Error resetting database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from database');
    }
}

// Run the reset function
resetDatabase(); 