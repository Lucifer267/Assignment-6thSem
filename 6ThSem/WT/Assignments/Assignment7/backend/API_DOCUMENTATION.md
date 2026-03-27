# Backend API Documentation

## Overview
RESTful PHP API for VIT Student Result Portal with MySQL database backend.

## Base URL
```
http://localhost:8000/api
```

## Response Format
All responses are in JSON format with the following structure:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Endpoints

### 1. Get All Students
**Endpoint**: `GET /get_students.php`

**Description**: Retrieves all students with their marks

**Response**:
```json
{
  "success": true,
  "message": "Students fetched successfully",
  "data": [
    {
      "id": 1,
      "roll_number": "REG001",
      "name": "Aman Kumar",
      "course": "B.Tech CSE",
      "email": "aman@vit.ac.in",
      "mse1": 28,
      "ese1": 65,
      "mse2": 30,
      "ese2": 68,
      "mse3": 25,
      "ese3": 62,
      "mse4": 29,
      "ese4": 70,
      "created_at": "2024-01-15 10:30:45",
      "updated_at": "2024-01-15 10:30:45"
    }
  ]
}
```

### 2. Get Single Student
**Endpoint**: `GET /get_student.php?roll_number=REG001`

**Description**: Retrieves a specific student by roll number

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| roll_number | string | Yes | Student roll number |

**Response**:
```json
{
  "success": true,
  "message": "Student fetched successfully",
  "data": {
    "id": 1,
    "roll_number": "REG001",
    "name": "Aman Kumar",
    "course": "B.Tech CSE",
    "email": "aman@vit.ac.in",
    "mse1": 28,
    "ese1": 65,
    "mse2": 30,
    "ese2": 68,
    "mse3": 25,
    "ese3": 62,
    "mse4": 29,
    "ese4": 70,
    "created_at": "2024-01-15 10:30:45",
    "updated_at": "2024-01-15 10:30:45"
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Student not found"
}
```

### 3. Add New Student
**Endpoint**: `POST /add_student.php`

**Description**: Adds a new student to the database

**Request Body**:
```json
{
  "roll_number": "REG006",
  "name": "Rajesh Kumar",
  "course": "B.Tech IT",
  "email": "rajesh@vit.ac.in"
}
```

**Required Fields**:
| Field | Type | Description |
|-------|------|-------------|
| roll_number | string | Unique roll number (max 20 chars) |
| name | string | Student name (max 100 chars) |
| course | string | Course name (max 50 chars) |
| email | string | Email address (optional) |

**Response**:
```json
{
  "success": true,
  "message": "Student added successfully",
  "data": {
    "id": 6,
    "roll_number": "REG006",
    "name": "Rajesh Kumar",
    "course": "B.Tech IT",
    "email": "rajesh@vit.ac.in",
    "mse1": 0,
    "ese1": 0,
    "mse2": 0,
    "ese2": 0,
    "mse3": 0,
    "ese3": 0,
    "mse4": 0,
    "ese4": 0,
    "created_at": "2024-01-15 11:45:30",
    "updated_at": "2024-01-15 11:45:30"
  }
}
```

### 4. Update Student Marks
**Endpoint**: `POST /update_marks.php`

**Description**: Updates marks for a specific student

**Request Body**:
```json
{
  "roll_number": "REG001",
  "marks": {
    "mse1": 28,
    "ese1": 65,
    "mse2": 30,
    "ese2": 68,
    "mse3": 25,
    "ese3": 62,
    "mse4": 29,
    "ese4": 70
  }
}
```

**Mark Constraints**:
- MSE: 0-30 (30% of total)
- ESE: 0-70 (70% of total)

**Response**:
```json
{
  "success": true,
  "message": "Marks updated successfully",
  "data": {
    "id": 1,
    "roll_number": "REG001",
    "name": "Aman Kumar",
    "course": "B.Tech CSE",
    "email": "aman@vit.ac.in",
    "mse1": 28,
    "ese1": 65,
    "mse2": 30,
    "ese2": 68,
    "mse3": 25,
    "ese3": 62,
    "mse4": 29,
    "ese4": 70,
    "created_at": "2024-01-15 10:30:45",
    "updated_at": "2024-01-15 12:00:15"
  }
}
```

### 5. Delete Student
**Endpoint**: `POST /delete_student.php`

**Description**: Deletes a student from the database

**Request Body**:
```json
{
  "roll_number": "REG006"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Student not found"
}
```

## Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request data |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Database or server error |

## CORS Headers

All API responses include CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Rate Limiting

No rate limiting is currently implemented. This should be added for production.

## Authentication

No authentication is currently implemented. This should be added for production with:
- JWT tokens
- Session management
- Password hashing

## Examples Using cURL

### Get All Students
```bash
curl http://localhost:8000/api/get_students.php
```

### Get Single Student
```bash
curl "http://localhost:8000/api/get_student.php?roll_number=REG001"
```

### Add Student
```bash
curl -X POST http://localhost:8000/api/add_student.php \
  -H "Content-Type: application/json" \
  -d '{
    "roll_number": "REG006",
    "name": "Rajesh Kumar",
    "course": "B.Tech IT",
    "email": "rajesh@vit.ac.in"
  }'
```

### Update Marks
```bash
curl -X POST http://localhost:8000/api/update_marks.php \
  -H "Content-Type: application/json" \
  -d '{
    "roll_number": "REG001",
    "marks": {
      "mse1": 28, "ese1": 65,
      "mse2": 30, "ese2": 68,
      "mse3": 25, "ese3": 62,
      "mse4": 29, "ese4": 70
    }
  }'
```

### Delete Student
```bash
curl -X POST http://localhost:8000/api/delete_student.php \
  -H "Content-Type: application/json" \
  -d '{"roll_number": "REG006"}'
```
