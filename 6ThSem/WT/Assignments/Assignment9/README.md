# Product Inventory Management System

This assignment now contains:
1. React + Vite frontend (improved UI)
2. Spring Boot backend with MongoDB
3. Spring Security Basic Authentication
4. REST APIs for full CRUD

## Requirement Coverage Checklist

1. Configure MongoDB connection
Done in [spring-backend/src/main/resources/application.properties](spring-backend/src/main/resources/application.properties)

2. Create document class
Done in [spring-backend/src/main/java/com/example/inventory/model/Product.java](spring-backend/src/main/java/com/example/inventory/model/Product.java)

3. Create MongoRepository interface
Done in [spring-backend/src/main/java/com/example/inventory/repository/ProductRepository.java](spring-backend/src/main/java/com/example/inventory/repository/ProductRepository.java)

4. Add Spring Security Dependency
Done in [spring-backend/pom.xml](spring-backend/pom.xml)

5. Implement Basic Authentication
Done in [spring-backend/src/main/java/com/example/inventory/config/SecurityConfig.java](spring-backend/src/main/java/com/example/inventory/config/SecurityConfig.java)

6. Perform basic CRUD operations (REST APIs)
Done in [spring-backend/src/main/java/com/example/inventory/controller/ProductController.java](spring-backend/src/main/java/com/example/inventory/controller/ProductController.java) and [spring-backend/src/main/java/com/example/inventory/service/ProductService.java](spring-backend/src/main/java/com/example/inventory/service/ProductService.java)

7. Restrict access to specific APIs
Done in [spring-backend/src/main/java/com/example/inventory/config/SecurityConfig.java](spring-backend/src/main/java/com/example/inventory/config/SecurityConfig.java)
POST, PUT, DELETE are ADMIN-only.
GET is USER or ADMIN.

8. Test the application
Postman examples are included below.

## Default Credentials

1. USER: user / password
2. ADMIN: admin / password

## API Endpoints

Base URL: http://localhost:8080/api/products

1. GET /api/products
Fetch all products.

2. GET /api/products/{id}
Fetch one product.

3. POST /api/products
Create product (ADMIN only).

4. PUT /api/products/{id}
Update product (ADMIN only).

5. DELETE /api/products/{id}
Delete product (ADMIN only).

## Run Instructions

### A) Run Spring Boot Backend

Prerequisites:
1. Java 17+
2. Maven
3. MongoDB running on localhost:27017

Commands:
1. cd spring-backend
2. mvn spring-boot:run

Backend runs on http://localhost:8080

### B) Run Frontend

Prerequisites:
1. Node.js 18+

Commands:
1. npm install
2. npm run dev

Frontend runs on http://localhost:5173

The frontend calls backend via:
VITE_API_BASE_URL=http://localhost:8080/api

## Postman Testing

Set Authorization for all requests:
1. Type: Basic Auth
2. Username: admin (or user)
3. Password: password

Sample POST body:
{
  "name": "Wireless Mouse",
  "price": 799.0,
  "quantity": 30,
  "category": "Accessories"
}

Expected behavior:
1. user can call GET endpoints only.
2. user gets 403 for POST/PUT/DELETE.
3. admin can perform all CRUD operations.

## Frontend Notes

The UI now supports:
1. Connect/reload with credentials
2. Create product
3. Inline edit product
4. Delete product
5. Inventory summary cards

## Removed Legacy Items

Google AI Studio and Gemini-specific config/references were removed from this assignment.
