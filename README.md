# Conversions Tracking Application

A full-stack application for tracking conversions with analytics capabilities. Built with Node.js, Express, MongoDB, and AngularJS.

## Features

- **User Management**: Create and manage user accounts
- **Conversion Tracking**: Create and track conversions per user
- **Analytics**: 
  - Track conversions by date
  - Get aggregated totals within specific date ranges
  - Real-time conversion counting
- **Unique Constraints**: Prevents duplicate conversion names per user
- **Clean Architecture**: Separation of concerns with controllers, services, and models

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Moment.js** for date handling
- **CORS** enabled for cross-origin requests

### Frontend
- **AngularJS 1.8**
- **Bootstrap 4** for styling
- **jQuery** for DOM manipulation

### Testing
- **Mocha** test framework
- **Chai** assertion library
- **Supertest** for HTTP assertions

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ProveSource-
```

2. Install dependencies:
```bash
npm install
```

3. Make sure MongoDB is running:
```bash
# On Linux/Mac
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 mongo:latest
```

## Running the Application

### Development Mode

You need to run both the API server and the dashboard in separate terminal windows:

**Terminal 1 - API Server (Port 3000):**
```bash
npm run start-server
```

**Terminal 2 - Dashboard (Port 3001):**
```bash
npm run start-dashboard
```

Then open your browser and navigate to:
- Dashboard: http://localhost:3001
- API: http://localhost:3000

## API Endpoints

### Accounts

#### Create Account
```http
POST /account/create
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "age": 30
}
```

#### Fetch Accounts
```http
GET /account/fetch
```

### Conversions

#### Create Conversion
```http
POST /conversion/create
Content-Type: application/json

{
  "name": "Newsletter Signup",
  "userId": "user_id_here"
}
```

**Note**: Two conversions cannot have the same name for the same user.

#### Fetch User Conversions
```http
GET /conversion/fetch?userId=user_id_here
```

#### Count Conversion (Increment)
```http
POST /conversion/count
Content-Type: application/json

{
  "name": "Newsletter Signup",
  "userId": "user_id_here"
}
```

This increments the conversion count for today's date.

#### Get Total Conversions by Date Range
```http
GET /conversion/total-by-date?userId=user_id&startDate=2024-01-01&endDate=2024-01-31
```

Returns the aggregate sum of all conversions within the specified date range.

## Testing

Run the test suite:
```bash
npm test
```

The tests cover:
- Account creation and retrieval
- Conversion CRUD operations
- Duplicate name prevention
- Date range analytics
- Edge cases and error handling

## Project Structure

```
ProveSource-/
├── api/                    # API Controllers
│   ├── account/
│   │   ├── create.js      # Account creation endpoint
│   │   └── fetch.js       # Account retrieval endpoint
│   └── conversion/
│       ├── create.js      # Conversion creation endpoint
│       ├── fetch.js       # Conversion retrieval endpoint
│       ├── count.js       # Conversion increment endpoint
│       └── total-by-date.js # Date range analytics endpoint
├── models/                # Mongoose Models
│   ├── account/
│   │   └── Account.js     # User account schema
│   └── conversion/
│       └── Conversion.js  # Conversion schema with unique index
├── services/              # Business Logic Layer
│   ├── accountService.js  # Account operations
│   └── conversionService.js # Conversion operations
├── tests/                 # Test Suite
│   ├── account.test.js    # Account API tests
│   └── conversion.test.js # Conversion API tests
├── public/                # Frontend Application
│   ├── index.html        # Main dashboard
│   ├── app.js            # AngularJS application
│   └── app.css           # Styles
├── app.js                # Express app setup
├── package.json          # Dependencies
└── README.md            # This file
```

## Architecture & Design Decisions

### Separation of Concerns
The application follows a clean architecture pattern:
- **Controllers** (api/*): Handle HTTP requests/responses, input validation
- **Services** (services/*): Contain business logic, interact with models
- **Models** (models/*): Define data schemas and database interactions

### Modern JavaScript
- Uses `async/await` for asynchronous operations
- Consistent error handling with try/catch blocks
- ES6+ syntax (const/let, arrow functions, template literals)

### Database Design
- **Unique Index**: Composite unique index on `(name, userId)` in Conversion model prevents duplicate conversion names per user
- **Embedded Counts**: `countByDate` is stored as an object for efficient date-based queries
- **References**: User references use MongoDB ObjectId for data integrity

### Error Handling
- Proper HTTP status codes (200, 404, 500)
- Descriptive error messages
- Graceful failure handling

## Common Issues & Troubleshooting

### MongoDB Connection Issues
If you see "MongoDB connection error":
1. Ensure MongoDB is running: `sudo systemctl status mongod`
2. Check if port 27017 is available: `lsof -i :27017`
3. Verify MongoDB URL in `app.js`

### Port Already in Use
If ports 3000 or 3001 are busy:
```bash
# Find process using the port
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Frontend Not Loading
1. Ensure both servers are running
2. Check browser console for errors
3. Verify API is accessible at http://localhost:3000/account/fetch

## Future Improvements

- [ ] Add user authentication and authorization
- [ ] Implement pagination for conversions list
- [ ] Add data export functionality (CSV, JSON)
- [ ] Create charts/visualizations for analytics
- [ ] Add real-time updates using WebSockets
- [ ] Implement caching layer (Redis)
- [ ] Add API rate limiting
- [ ] Migrate frontend to React or Vue.js
- [ ] Add TypeScript for type safety
- [ ] Implement CI/CD pipeline

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

### Commit Message Guidelines

Follow [best practices](https://chris.beams.io/posts/git-commit/):
- Use imperative mood ("Add feature" not "Added feature")
- Capitalize first letter
- No period at the end
- Keep subject line under 50 characters
- Separate subject from body with blank line

## License

ISC

## Author

Created as a coding interview project demonstrating:
- Clean code principles
- RESTful API design
- Full-stack development skills
- Test-driven development
- Modern JavaScript practices
