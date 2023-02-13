# Getting started with the Vehicle Routing Problem (VRP) 

## Introduction
The Vehicle Routing Problem (VRP) is a classical optimization problem in the field of Operations Research. It involves finding the most efficient routes for a fleet of vehicles to deliver a set of customer demands. The objective is to minimize the total distance traveled by the vehicles while satisfying all customer demands.

In this VRP model, we have defined several classes to represent the problem:

* `Position`: represents a geographical location with latitude and longitude coordinates. It also has a weight attribute that can be used to incorporate external factors such as traffic, weather, and road conditions.

* `CustomerDemand`: represents a demand from a customer, including the customer ID, capacity, location, order ID, and date/time.

* `Vehicle`: represents a delivery vehicle, including its capacity, current position, and driver ID.

* `DeliveryPlan`: represents the final delivery plan, including the vehicle routes and any pending customer demands.

The `DeliveryService` class is the main class that implements the VRP optimization. It takes in an array of vehicles and customer demands as input and returns a DeliveryPlan as output.

## The algorithm
The algorithm implemented in the optimizeDeliveryPlan method follows a heuristic approach, meaning that it uses a set of rules and techniques to find an acceptable solution in a reasonable time, rather than finding the exact and optimal solution. This approach is useful when solving problems that have a large number of variables, and an exhaustive search is computationally impractical.

The algorithm starts by sorting the customer demands by increasing demand capacity and considering the weight linked to the customer location (weight being a placeholder for conditions around Traffic, Weather, Road, etc.). This approach aims to prioritize the customer demands that have a lower capacity and are located in areas with lower weights.

The vehicles are then sorted based on the increasing distance between their current position and the location of the customer demand. This approach ensures that vehicles closer to the customer demands are assigned the delivery tasks first.

The algorithm then assigns the customer demands to the vehicles by iterating through the demands and comparing the distance between each vehicle and the demand's location. The vehicle with the shortest total distance (considering the current distance from the vehicle to the demand and the distance from the last demand to the current demand) is chosen to deliver the demand. The capacity of the chosen vehicle is updated, and the demand is added to the vehicle's route.

This process continues until all the customer demands have been assigned to the vehicles or until no more vehicles are available to fulfill the demands. The final result is stored in a DeliveryPlan object, which contains the routes for each vehicle and the pending demands that couldn't be assigned to any vehicle.

## Running the demo

```bash
bun demos/basic.ts
```