// MongoDB Initialization Script
// This script creates indexes for better performance

db = db.getSiblingDB('formexus');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });

db.forms.createIndex({ "userId": 1 });
db.forms.createIndex({ "slug": 1 }, { unique: true });
db.forms.createIndex({ "createdAt": 1 });

db.submissions.createIndex({ "formId": 1 });
db.submissions.createIndex({ "createdAt": 1 });

print('Database initialized successfully!');
