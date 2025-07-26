// 🗄️ MongoDB Initialization Script for Whisper Database

// Switch to whisper_db database
db = db.getSiblingDB('whisper_db');

// 👤 Create application user with read/write permissions
db.createUser({
  user: 'whisper_app',
  pwd: 'whisper_app_password_2024',
  roles: [
    {
      role: 'readWrite',
      db: 'whisper_db'
    }
  ]
});

// 📋 Create collections with validation schemas

// 👥 Users Collection
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'email', 'name', 'passwordHash', 'createdAt'],
      properties: {
        username: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 30,
          description: 'Username must be 3-30 characters'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'Valid email address required'
        },
        name: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 100,
          description: 'Name must be 2-100 characters'
        },
        passwordHash: {
          bsonType: 'string',
          description: 'Hashed password required'
        }
      }
    }
  }
});

// 💕 Relationships Collection
db.createCollection('relationships', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['users', 'firstMeetingDate', 'createdAt'],
      properties: {
        users: {
          bsonType: 'array',
          minItems: 2,
          maxItems: 2,
          description: 'Exactly 2 users required'
        },
        firstMeetingDate: {
          bsonType: 'date',
          description: 'First meeting date required'
        }
      }
    }
  }
});

// 🎉 Events Collection  
db.createCollection('events', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['relationshipId', 'title', 'date', 'type', 'createdAt'],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 200,
          description: 'Title must be 1-200 characters'
        },
        type: {
          bsonType: 'string',
          enum: ['DATE', 'TRIP', 'ANNIVERSARY', 'BIRTHDAY', 'MEETING', 'PARTY', 'FIGHT_MAKEUP', 'TODO_COMPLETED', 'CUSTOM'],
          description: 'Valid event type required'
        },
        isPublic: {
          bsonType: 'bool',
          description: 'Public visibility flag'
        }
      }
    }
  }
});

// 🌟 Whispers Collection
db.createCollection('whispers', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['relationshipId', 'type', 'date', 'recurrence', 'createdAt'],
      properties: {
        type: {
          bsonType: 'string',
          description: 'Whisper type required'
        },
        recurrence: {
          bsonType: 'string',
          enum: ['once', 'everyday', 'weekly'],
          description: 'Valid recurrence type required'
        },
        isDone: {
          bsonType: 'bool',
          description: 'Completion status'
        }
      }
    }
  }
});

// ✅ Todos Collection
db.createCollection('todos', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['relationshipId', 'title', 'priority', 'createdAt'],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 200,
          description: 'Title must be 1-200 characters'
        },
        priority: {
          bsonType: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Valid priority level required'
        },
        isCompleted: {
          bsonType: 'bool',
          description: 'Completion status'
        }
      }
    }
  }
});

// 🎫 Invite Codes Collection
db.createCollection('invitecodes', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['code', 'createdBy', 'firstMeetingDate', 'createdAt'],
      properties: {
        code: {
          bsonType: 'string',
          minLength: 6,
          maxLength: 10,
          description: 'Code must be 6-10 characters'
        },
        isUsed: {
          bsonType: 'bool',
          description: 'Usage status'
        },
        expiresAt: {
          bsonType: 'date',
          description: 'Expiration date'
        }
      }
    }
  }
});

// 📊 Create indexes for performance optimization

// Users indexes
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "relationshipId": 1 });

// Relationships indexes
db.relationships.createIndex({ "users": 1 });
db.relationships.createIndex({ "createdAt": 1 });

// Events indexes
db.events.createIndex({ "relationshipId": 1, "date": -1 });
db.events.createIndex({ "isPublic": 1, "date": -1 });
db.events.createIndex({ "type": 1 });
db.events.createIndex({ "createdAt": -1 });

// Whispers indexes
db.whispers.createIndex({ "relationshipId": 1, "date": 1 });
db.whispers.createIndex({ "isDone": 1, "date": 1 });
db.whispers.createIndex({ "type": 1 });

// Todos indexes
db.todos.createIndex({ "relationshipId": 1, "isCompleted": 1 });
db.todos.createIndex({ "priority": 1, "createdAt": -1 });
db.todos.createIndex({ "dueDate": 1 });

// Invite codes indexes
db.invitecodes.createIndex({ "code": 1 }, { unique: true });
db.invitecodes.createIndex({ "createdBy": 1 });
db.invitecodes.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });
db.invitecodes.createIndex({ "isUsed": 1 });

// 🎯 Insert sample data for testing (optional)
print('🗄️ MongoDB initialization completed successfully!');
print('📋 Collections created: users, relationships, events, whispers, todos, invitecodes');
print('📊 Performance indexes created');
print('👤 Application user created: whisper_app');
print('🎉 Database ready for Whisper application!'); 