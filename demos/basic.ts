import { DeliveryService, generateGeoJsonRoute } from './../libs/vrp'
import { Vehicle, Position, CustomerDemand } from './../libs/model'
import { FeatureCollection } from 'geojson'

const vehicles = [
  new Vehicle(100, new Position(52.5075, 13.3295), 'Driver1'),
  new Vehicle(120, new Position(52.5065, 13.3299), 'Driver2'),
  new Vehicle(80, new Position(52.5057, 13.3304), 'Driver3'),
  new Vehicle(90, new Position(52.5055, 13.3307), 'Driver4'),
  new Vehicle(110, new Position(52.5047, 13.3311), 'Driver5')
]

let totalVehicleCapacity = 0
vehicles.forEach(vehicle => {
  totalVehicleCapacity += vehicle.capacity
})

const customerDemands = []
let totalCapacity = 0
let orderId = 1

// Generating 100 CustomerDemand objects
while (customerDemands.length < 100 && totalCapacity < totalVehicleCapacity) {
  const capacity = Math.floor(Math.random() * 20) + 1
  totalCapacity += capacity
  if (totalCapacity <= totalVehicleCapacity) {
    const longitude = 52.5076 + (Math.random() - 0.5) * 0.01
    const latitude = 13.3299 + (Math.random() - 0.5) * 0.01
    customerDemands.push(
      new CustomerDemand(
          `C${orderId}`,
          capacity,
          new Position(longitude, latitude),
          `Order${orderId}`,
          new Date()
      )
    )
    orderId++
  }
}

const deliveryService = new DeliveryService(vehicles, customerDemands)
const deliveryPlan = deliveryService.optimizeDeliveryPlan()
console.log(`Pending demands: ${deliveryPlan.pendingDemands.length}`)
console.log('---------------------------')
const routes = deliveryPlan.vehicleRoutes
routes.forEach((route, vehicle) => {
  console.log(`Vehicle driver: ${vehicle.driverId}`)
  console.log(`Remaining capacity: ${vehicle.capacity}`)
  console.log(`Current position: (${vehicle.currentPosition.latitude}, ${vehicle.currentPosition.longitude})`)
  console.log('Route:')

  const featureCollection: FeatureCollection = generateGeoJsonRoute(route.map(route => route.location))
  console.log(JSON.stringify(featureCollection, null, 2))

  console.log('---------------------------')
})
