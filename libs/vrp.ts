
import { Vehicle, CustomerDemand, DeliveryPlan, Position } from './model'
import { FeatureCollection } from 'geojson'

class VehicleRoutes {
  public readonly routes: Map<Vehicle, CustomerDemand[]> = new Map<Vehicle, CustomerDemand[]>()

  public getVehicleRoute (vehicle: Vehicle): CustomerDemand[] {
    if (!this.routes.has(vehicle)) {
      this.routes.set(vehicle, [])
    }

    return this.routes.get(vehicle) as CustomerDemand[]
  }

  public getVehicleLastDemand (vehicle: Vehicle): CustomerDemand | undefined {
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
    private readonly customerDemands: CustomerDemand[]
  ) {
  }

  public optimizeDeliveryPlan (): DeliveryPlan {
    // Sort customer demands by increasing demand capacity
    // We also consider the weight linked to the customer location
    // (weight = placeholder for conditions around Traffic, Weather, Road, etc...)
    this.customerDemands.sort((a, b) => a.capacity * a.location.weight - b.capacity * a.location.weight)

    // Sort vehicles by increasing current position to customer demand location distance
    this.vehicles.sort((a, b) => {
      const distanceA = a.currentPosition.distanceTo(this.customerDemands[0].location)
      const distanceB = b.currentPosition.distanceTo(this.customerDemands[0].location)

      return distanceA - distanceB
    })

    const vehicleRoutes = new VehicleRoutes()

    // Assign customer demands to vehicles
    let demandIndex = 0
    for (; demandIndex < this.customerDemands.length; demandIndex++) {
      const demand = this.customerDemands[demandIndex]

      let minVehicle: Vehicle | undefined
      let minDistance = Infinity

      for (const vehicle of this.vehicles) {
        if (vehicle.capacity >= demand.capacity) {
          const lastDemand = vehicleRoutes.getVehicleLastDemand(vehicle)
          const currentDistance = vehicle.currentPosition.distanceTo(demand.location)
          const totalDistance = (lastDemand != null)
            ? lastDemand.location.distanceTo(demand.location)
            : currentDistance

          if (totalDistance < minDistance) {
            minVehicle = vehicle
            minDistance = totalDistance
          }
        }
      }

      if (minVehicle == null) {
        break
      }

      minVehicle.capacity = minVehicle.capacity - demand.capacity
      minVehicle.currentPosition = demand.location

      const route = vehicleRoutes.getVehicleRoute(minVehicle)
      route.push(demand)
    }

    return new DeliveryPlan(vehicleRoutes.routes, this.customerDemands.splice(demandIndex))
  }
}
