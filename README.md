# Getting started with the Vehicle Routing Problem (VRP) 

The Vehicle Routing Problem (VRP) is a classical optimization problem in the field of Operations Research. It involves finding the most efficient routes for a fleet of vehicles to deliver a set of customer demands. The objective is to minimize the total distance traveled by the vehicles while satisfying all customer demands.

In this VRP model, we have defined several classes to represent the problem:

* `Position`: represents a geographical location with latitude and longitude coordinates. It also has a weight attribute that can be used to incorporate external factors such as traffic, weather, and road conditions.

* `CustomerDemand`: represents a demand from a customer, including the customer ID, capacity, location, order ID, and date/time.

* `Vehicle`: represents a delivery vehicle, including its capacity, current position, and driver ID.

* `DeliveryPlan`: represents the final delivery plan, including the vehicle routes and any pending customer demands.

The `DeliveryService` class is the main class that implements the VRP optimization. It takes in an array of vehicles and customer demands as input and returns a DeliveryPlan as output.

## The algorithm
The optimization algorithm sorts the customer demands by increasing demand capacity and considers the weight linked to the customer location. It then sorts the vehicles by increasing distance from the first customer demand to the vehicle's current position. The customer demands are then assigned to vehicles, starting with the closest vehicle that has enough capacity to fulfill the demand. The delivery plan is updated with the assigned customer demand, and the process is repeated until all customer demands have been assigned or no vehicle has enough capacity to fulfill the next demand.

In conclusion, the VRP model provides a basic implementation of the Vehicle Routing Problem and can be used as a starting point for further development and customization.

## Running the demo

```bash
bun demos/basic.ts
```