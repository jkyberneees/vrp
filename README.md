# Getting started with the Vehicle Routing Problem (VRP) 

## Introduction
The Vehicle Routing Problem (VRP) is a classical optimization problem in the field of Operations Research. It involves finding the most efficient routes for a fleet of vehicles to deliver a set of customer orders. The objective is to minimize the total distance traveled by the vehicles while satisfying most orders.

In this VRP model, we have defined several classes to represent the problem:

* `Position`: represents a geographical location with latitude and longitude coordinates. 

* `DeliveryOrder`: represents a delivery order from a customer, including the customer ID, capacity, location, order ID and date/time. It also has a weight attribute that can be used to incorporate external factors such as traffic, weather, and road conditions.

* `Vehicle`: represents a delivery vehicle, including its capacity, current position, and vehicle ID.

* `DeliveryPlan`: represents the final delivery plan, including the vehicle routes and any pending delivery orders which could not be fulfiled.

The `DeliveryService` class is the main class that implements the VRP optimization. It takes in an array of vehicles and delivery orders as input and returns a DeliveryPlan as output.

## The algorithm
The algorithm in the `optimizeDeliveryPlan` method uses a heuristic approach, which means it uses a set of rules and techniques to find an acceptable solution in a reasonable time, instead of finding the exact and optimal solution. This approach is useful when solving problems with a large number of variables and an exhaustive search is computationally impractical.

The algorithm first sorts delivery orders ASC by "capacity * weight of the order" (where weight represents conditions such as Price, Traffic, Weather, Road, etc.). Then, vehicles are sorted based on the increasing distance between their current position and the order location, assigning delivery tasks first to vehicles closest to the order location.

The algorithm then assigns orders to vehicles by iterating through the orders and comparing the distance between each vehicle and the order location. The vehicle with the shortest total distance, considering both the current distance from the vehicle to the order and the distance from the last order to the current order, is chosen to deliver the order. The chosen vehicle's capacity is updated, and the delivery order is added to the vehicle's route.

This process continues until all orders have been assigned to vehicles or until no more vehicles are available to fulfill the orders. The final result is stored in a DeliveryPlan object, which contains the routes for each vehicle and the pending orders that couldn't be assigned to any vehicle.
```ts
class DeliveryService {
  constructor (
    private readonly vehicles: Vehicle[],
    private readonly orders: DeliveryOrder[]
  ) {
  }

  public optimizeDeliveryPlan (): DeliveryPlan {
    // Sort delivery orders ASC by capacity * weight
    // (weight = optional placeholder for conditions around Price, Traffic, Weather, Road, etc...)
    this.orders.sort((a, b) => a.capacity * a.weight - b.capacity * b.weight)

    // Sort vehicles ASC by distance between current position and order location
    this.vehicles.sort((a, b) => {
      const distanceA = a.currentPosition.distanceTo(this.orders[0].location)
      const distanceB = b.currentPosition.distanceTo(this.orders[0].location)

      return distanceA - distanceB
    })

    const routes = new VehicleRoutes()

    // Assign delivery orders to vehicles
    let orderIndex = 0
    for (; orderIndex < this.orders.length; orderIndex++) {
      const order = this.orders[orderIndex]

      let selectedVehicle: Vehicle | undefined
      let minDistance = Infinity

      for (const vehicle of this.vehicles) {
        if (vehicle.capacity >= order.capacity) {
          const currentDistance = vehicle.currentPosition.distanceTo(order.location)
          const lastOrder = routes.getVehicleLastOrder(vehicle)
          const distanceToOrder = (lastOrder != null)
            ? lastOrder.location.distanceTo(order.location)
            : currentDistance

          if (distanceToOrder < minDistance) {
            selectedVehicle = vehicle
            minDistance = distanceToOrder
          }
        }
      }

      if (selectedVehicle == null) {
        break
      }

      selectedVehicle.capacity = selectedVehicle.capacity - order.capacity
      selectedVehicle.currentPosition = order.location

      const route = routes.getVehicleRoute(selectedVehicle)
      route.push(order)
    }

    return new DeliveryPlan(routes.routes, this.orders.splice(orderIndex))
  }
}
```

## Running the demo

```bash
bun demos/basic.ts
```