
import { Vehicle, DeliveryOrder, DeliveryPlan, Position } from './model'
import { FeatureCollection } from 'geojson'

class VehicleRoutes {
  public readonly routes: Map<Vehicle, DeliveryOrder[]> = new Map<Vehicle, DeliveryOrder[]>()

  public getVehicleRoute (vehicle: Vehicle): DeliveryOrder[] {
    if (!this.routes.has(vehicle)) {
      this.routes.set(vehicle, [])
    }

    return this.routes.get(vehicle) as DeliveryOrder[]
  }

  public getVehicleLastOrder (vehicle: Vehicle): DeliveryOrder | undefined {
    const route = this.getVehicleRoute(vehicle)

    return (route.length > 0) ? route[route.length - 1] : undefined
  }
}

export function generateGeoJsonRoute (positions: Position[]): FeatureCollection {
  const coordinates = positions.map(position => [position.longitude, position.latitude])

  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates
      }
    }]
  }
}

export class DeliveryService {
  constructor (
    private readonly vehicles: Vehicle[],
    private readonly orders: DeliveryOrder[]
  ) {
  }

  public optimizeDeliveryPlan (): DeliveryPlan {
    // Sort delivery orders ASC by capacity * weight
    // (weight = placeholder for conditions around Traffic, Weather, Road, etc...)
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
