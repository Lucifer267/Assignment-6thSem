# Student Management API Documentation

## Base URL
`http://localhost:3000/api`

## Endpoints

### 1. Get All Students
**GET** `/students`

Get a list of all students in the system.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Aditi Sharma",
    "email": "aditi.sharma2026@vit.edu",
    "course": "Computer Science",
    "createdAt": "2026-04-14T10:30:00.000Z"
  }
]
```

**Status Codes:**
- `200 OK` - Successfully retrieved students

---

### 2. Get Single Student
**GET** `/students/:id`

Get a specific student by their ID.

**Parameters:**
- `id` (path) - Student ID (integer)

**Response:**
```json
{
  "id": 1,
  "name": "Aditi Sharma",
  "email": "aditi.sharma2026@vit.edu",
  "course": "Computer Science",
  "createdAt": "2026-04-14T10:30:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Student found
- `404 Not Found` - Student not found

---

### 3. Create Student (via API)
**POST** `/students`

Add a new student to the system.

**Request Body:**
```json
{
  "name": "Rohan Gupta",
  "email": "rohan.gupta2026@vit.edu",
  "course": "Data Science"
}
```

**Required Fields:**
- `name` (string) - Full name of the student
- `email` (string) - VIT email address (must be unique)
- `course` (string) - Course name

**Response:**
```json
{
  "id": 5,
  "name": "Rohan Gupta",
  "email": "rohan.gupta2026@vit.edu",
  "course": "Data Science",
  "createdAt": "2026-04-14T10:35:00.000Z"
}
```

**Status Codes:**
- `201 Created` - Student created successfully
- `400 Bad Request` - Missing required fields or duplicate email

**Example using cURL:**
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rohan Gupta",
    "email": "rohan.gupta2026@vit.edu",
    "course": "Data Science"
  }'
```

**Example using fetch (JavaScript):**
```javascript
fetch('http://localhost:3000/api/students', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Rohan Gupta',
    email: 'rohan.gupta2026@vit.edu',
    course: 'Data Science'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

**Example using Python:**
```python
import requests

url = 'http://localhost:3000/api/students'
data = {
    'name': 'Rohan Gupta',
    'email': 'rohan.gupta2026@vit.edu',
    'course': 'Data Science'
}

response = requests.post(url, json=data)
print(response.json())
```

---

### 4. Update Student
**PUT** `/students/:id`

Update an existing student's information.

**Parameters:**
- `id` (path) - Student ID (integer)

**Request Body:**
```json
{
  "name": "Rohan Gupta Updated",
  "email": "rohan.updated@vit.edu",
  "course": "Artificial Intelligence"
}
```

**Required Fields:**
- `name` (string) - Full name of the student
- `email` (string) - VIT email address (must be unique, but can keep the same)
- `course` (string) - Course name

**Response:**
```json
{
  "id": 5,
  "name": "Rohan Gupta Updated",
  "email": "rohan.updated@vit.edu",
  "course": "Artificial Intelligence",
  "createdAt": "2026-04-14T10:35:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Student updated successfully
- `400 Bad Request` - Missing required fields or duplicate email
- `404 Not Found` - Student not found

**Example using cURL:**
```bash
curl -X PUT http://localhost:3000/api/students/5 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rohan Gupta Updated",
    "email": "rohan.updated@vit.edu",
    "course": "Artificial Intelligence"
  }'
```

**Example using fetch (JavaScript):**
```javascript
fetch('http://localhost:3000/api/students/5', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Rohan Gupta Updated',
    email: 'rohan.updated@vit.edu',
    course: 'Artificial Intelligence'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 5. Delete Student
**DELETE** `/students/:id`

Remove a student from the system.

**Parameters:**
- `id` (path) - Student ID (integer)

**Response:**
```json
{
  "message": "Student deleted successfully",
  "student": {
    "id": 5,
    "name": "Rohan Gupta Updated",
    "email": "rohan.updated@vit.edu",
    "course": "Artificial Intelligence",
    "createdAt": "2026-04-14T10:35:00.000Z"
  }
}
```

**Status Codes:**
- `200 OK` - Student deleted successfully
- `404 Not Found` - Student not found

**Example using cURL:**
```bash
curl -X DELETE http://localhost:3000/api/students/5
```

**Example using fetch (JavaScript):**
```javascript
fetch('http://localhost:3000/api/students/5', {
  method: 'DELETE'
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Errors:
- **400 Bad Request:** Missing required fields or validation error
- **404 Not Found:** Resource doesn't exist
- **500 Internal Server Error:** Server error

---

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. The API will be available at `http://localhost:3000`

---

## Testing the API

### Using Postman:
1. Import the API endpoints as shown above
2. Set the request method (GET, POST, PUT, DELETE)
3. Add JSON body for POST and PUT requests
4. Click "Send" to test

### Using Thunder Client (VS Code Extension):
1. Create new request
2. Set method and URL
3. Add headers: `Content-Type: application/json`
4. Add request body
5. Click "Send"

### Using REST Client Extension (VS Code):
Create a file named `requests.http`:
```
### Get all students
GET http://localhost:3000/api/students

### Create new student
POST http://localhost:3000/api/students
Content-Type: application/json

{
  "name": "Test Student",
  "email": "test@vit.edu",
  "course": "Computer Science"
}

### Get specific student
GET http://localhost:3000/api/students/1

### Update student
PUT http://localhost:3000/api/students/1
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@vit.edu",
  "course": "Data Science"
}

### Delete student
DELETE http://localhost:3000/api/students/1
```

---

## Features

✅ **CRUD Operations** - Create, Read, Update, Delete students
✅ **Email Validation** - Prevents duplicate emails
✅ **Admin Dashboard** - Beautiful UI for managing students
✅ **Search & Filter** - Find students quickly
✅ **Grid/Table Views** - Flexible display options
✅ **Responsive Design** - Works on all devices
✅ **Real-time Updates** - Changes reflect immediately

---

## Notes

- The API currently uses in-memory storage (data is reset on server restart)
- For production, integrate a proper database (MySQL, PostgreSQL, MongoDB)
- Email addresses must be unique across all students
- All required fields must be provided in POST and PUT requests
