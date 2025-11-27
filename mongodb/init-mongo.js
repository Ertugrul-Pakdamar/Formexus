// MongoDB Initialization Script
// This script creates the initial database and user

db = db.getSiblingDB('formexus');

// Create application user with read/write access
db.createUser({
  user: 'formexus_user',
  pwd: 'changeme',  // Change this in production
  roles: [
    {
      role: 'readWrite',
      db: 'formexus'
    }
  ]
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });

db.forms.createIndex({ "userId": 1 });
db.forms.createIndex({ "createdAt": 1 });
db.forms.createIndex({ "name": 1 });

db.submissions.createIndex({ "formId": 1 });
db.submissions.createIndex({ "createdAt": 1 });

print('Database initialized successfully!');
