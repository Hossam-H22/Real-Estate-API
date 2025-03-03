# Real Estate API

<br>

## Overview
This is a RESTful API for a real estate application built using Node.js with TypeScript and PostgreSQL. The API allows users to manage properties, projects, areas, and cities.

<br>



## Run Steps:
Note: you should have Docker installed

### Step 1
```bash
  git clone https://github.com/Hossam-H22/Real-Estate-API.git
  cd Real-Estate-API
```

### Step 2
```bash
  docker-compose up --build
```

### Step 3 - (shutdown)
```bash
  docker-compose down 
```


<br>


## Technologies Used
- **Node.js** with **TypeScript**
- **PostgreSQL** with **TypeORM**
- **Zod** for validation
- **bcrypt** for security
- **Cloudinary** for image uploads
- **Express.js** for routing and middleware

<br>

## Features
- **Authentication & Authorization** middleware for securing endpoints
- **Error Handling** middleware for consistent API responses
- **Validation** middleware using Zod
- **Pagination, Filtering, Sorting, and Selection** using the `ApiFeatures` class
- **CRUD Operations** for all entities

<br>

## Folder Structure
```
src/
  database/
  middleware/
  modules/
    each module/
      moduleName.entity.ts
      moduleName.route.ts
      moduleName.controller.ts
      moduleName.service.ts
      moduleName.validation.ts
  utils/
```

<br>

## Entities & Database Schema

### Users
```json
{
  "_id": "UUID",
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "role": "enum('admin', 'buyer', 'agent')",
  "createdAt": "Date"
}
```

### Cities
```json
{
  "_id": "UUID",
  "name": "string",
  "createdBy": "UUID (references users)",
  "createdAt": "Date"
}
```

### Areas
```json
{
  "_id": "UUID",
  "name": "string",
  "cityId": "UUID (references cities)",
  "createdBy": "UUID (references users)",
  "createdAt": "Date"
}
```

### Projects
```json
{
  "_id": "UUID",
  "name": "string",
  "description": "string",
  "areaId": "UUID (references areas)",
  "createdBy": "UUID (references users)",
  "createdAt": "Date"
}
```

### Properties
```json
{
  "_id": "UUID",
  "title": "string",
  "description": "string",
  "price": "number",
  "type": "enum('house', 'apartment', 'land', 'commercial')",
  "status": "enum('available', 'sold', 'rented')",
  "bedrooms": "number",
  "bathrooms": "number",
  "squareFeet": "number",
  "images": ["array of strings (URLs)"],
  "createdBy": "UUID (references users)",
  "projectId": "UUID (references projects)",
  "createdAt": "Date"
}
```

<br>

## API Endpoints
Each module includes four endpoints:

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get a specific user
- `POST /users` - Create a new user
- `PUT /users/:id` - Update a user

### Cities
- `GET /cities` - Get all cities
- `GET /cities/:id` - Get a specific city
- `POST /cities` - Create a new city
- `PUT /cities/:id` - Update a city

### Areas
- `GET /areas` - Get all areas
- `GET /areas/:id` - Get a specific area
- `POST /areas` - Create a new area
- `PUT /areas/:id` - Update an area

### Projects
- `GET /projects` - Get all projects
- `GET /projects/:id` - Get a specific project
- `POST /projects` - Create a new project
- `PUT /projects/:id` - Update a project

### Properties
- `GET /properties` - Get all properties
- `GET /properties/:id` - Get a specific property
- `POST /properties` - Create a new property
- `PUT /properties/:id` - Update a property


<br>


## Query Parameters for Filtering & Pagination
- **Pagination**: `?page=1&size=10`
- **Sorting**: like `?sort=-createdAt` (Descending), `?sort=price` (Ascending)
- **Field Selection**: `?fields=name,description,price`
- **Filtering**: `?price[gte]=50000&status=available`
- **Search**: `?search=apartment`


<br>

## Authentication & Authorization
- User authentication is implemented using JWT.
- Middleware ensures role-based access control.
- Passwords are securely hashed using bcrypt.


<br>


## Image Uploads
- Cloudinary is used to store images.
- The `properties` module allows uploading images via Cloudinary.


<br>

## Error Handling
- All errors are handled using a centralized middleware.
- Standard response format for errors.


<br>


## Postman - [link](https://documenter.getpostman.com/view/23533987/2sAYdeKqjG)


<br>

## Conclusion
This API provides a comprehensive real estate management system with authentication, authorization, validation, and data management features.



<br>
