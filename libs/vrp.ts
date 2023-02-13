
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
  private readonly vehicles: Vehicle[]
  private readonly customerDemands: CustomerDemand[]

  constructor (vehicles: Vehicle[], customerDemands: CustomerDemand[]) {
    this.vehicles = vehicles
    this.customerDemands = customerDemands
  }

  public optimizeDeliveryPlan (): DeliveryPlan {
    // Sort customer demands by increasing demand capacity
    // We also consider the weight linked to the customer location
    // (weight = placeholder for conditions around Traffic, Weather, Road, etc...)
    this.customerDemands.sort((a, b) => a.getCapacity() * a.getLocation().weight - b.getCapacity() * a.getLocation().weight)

    // Sort vehicles by increasing current position to customer demand location distance
    this.vehicles.sort((a, b) => {
      const distanceA = a.getCurrentPosition().distanceTo(this.customerDemands[0].getLocation())
      const distanceB = b.getCurrentPosition().distanceTo(this.customerDemands[0].getLocation())
      return distanceA - distanceB
    })

    const vehicleRoutes = new VehicleRoutes()

    // Assign customer demands to vehicles
    let dIndex = 0
    for (; dIndex < this.customerDemands.length; dIndex++) {
      const demand = this.customerDemands[dIndex]

      let minVehicle: Vehicle | undefined
      let minDistance = Infinity

      for (const vehicle of this.vehicles) {
        if (vehicle.getCapacity() >= demand.getCapacity()) {
          const lastDemand = vehicleRoutes.getVehicleLastDemand(vehicle)
          const currentDistance = vehicle.getCurrentPosition().distanceTo(demand.getLocation())
          const totalDistance = (lastDemand != null)
            ? lastDemand.getLocation().distanceTo(demand.getLocation())
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

      minVehicle.setCapacity(minVehicle.getCapacity() - demand.getCapacity())
      minVehicle.setCurrentPosition(demand.getLocation())

      const route = vehicleRoutes.getVehicleRoute(minVehicle)
      route.push(demand)
    }

    return new DeliveryPlan(vehicleRoutes.routes, this.customerDemands.splice(dIndex))
  }
}
