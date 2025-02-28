## Car Store B4A2V3

A Node-Express application to manage a car store and process customer orders. The application supports features such as adding and updating car details, managing orders, and calculating revenue using MongoDB aggregation pipelines.

## Features

### Car Management:

- Add new cars with details such as brand, model, year, price, and quantity.
- Update car details including price, quantity, and availability status.
- Automatically update car availability (inStock) based on inventory quantity.

### Order Management:

- Place orders for cars with validation of inventory stock.
- Calculate the total price for orders dynamically.
- Handle scenarios like insufficient stock with user-friendly error messages.

### Revenue Calculation:

- Compute total revenue from orders using MongoDB aggregation pipelines.
- Ensure accurate revenue tracking by validating stock availability during order placement.

## Getting Started

Follow the instructions below to set up the project locally.

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (Local or Atlas)
- A package manager (npm or yarn)

## Installation

Clone the repository:

```bash
git clone https://github.com/RittikaDev/car-store-B4A2V3.git
cd car-store-B4A2V3
```

Install dependencies:

```bash
npm install
```

Set up environment variables:

- Create a .env file in the project root and configure secret keys

```bash
PORT=5000
DATABASE_URL=mongodb+srv://rittikadev:rittikaadmin1234@cluster0.729wj.mongodb.net/assignment-two?retryWrites=true&w=majority&appName=Cluster0
```

Run the application:

```bash
npm run start:dev
```

Build the application:

```bash
npm run build
```

API Documentation

- Once the server is running, you can access the API documentation (if Swagger or Postman is configured) or use the endpoints directly via Postman.

### API Endpoints

#### Car Management

- Create a Car:
  - POST /api/cars
  - Request Body: { "brand": "BMW", "model": "X5", "year": 2023, "price": 50000, "quantity": 10, "category": "SUV", "description": "Luxury SUV" }
- Get All Cars:
  - GET /api/cars?searchTerm=
- Get Single Car
  - GET /api/cars/:carId
- Update a Car:
  - PUT /api/cars/:carId
  - Request Body: { "price": 55000, "quantity": 5 }
- Delete a Car
  - DELETE /api/cars/:carId

#### Order Management

- Create an Order:
  - POST /api/orders
  - Request Body: { "email": "customer@example.com", "car": "<carId>", "quantity": 1, "totalPrice": 50000 }
- Get Total Revenue
  - GET /api/orders/revenue

## Project Structure

```go
car-store-B4A2V3/
├── src/
│   ├── app/
│   │   ├── modules/
│   │   │   ├── car/
│   │   │   │   ├── car.controller.ts
│   │   │   │   ├── car.model.ts
│   │   │   │   ├── car.route.ts
│   │   │   │   ├── car.service.ts
│   │   │   │   ├── car.interface.ts
│   │   │   │   └── car.validation.ts
│   │   │   │
│   │   │   ├── order/
│   │   │   │   ├── order.controllers.ts
│   │   │   │   ├── order.model.ts
│   │   │   │   ├── order.route.ts
│   │   │   │   ├── order.service.ts
│   │   │   │   ├── order.interface.ts
│   │   │   │   └── order.validation.ts
│   │   ├─── config/
│   │       └── index.ts
│   ├── app.ts
│   ├── server.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

### Known Issues
- Response Structure Update:
During the initial submission for recheck, a minor inconsistency was still present in the API response structure that I later realized. This issue has now been fixed and redeployed.
