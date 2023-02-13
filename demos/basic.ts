import { DeliveryService, generateGeoJsonRoute } from './../libs/vrp'
import { Vehicle, Position, DeliveryOrder } from './../libs/model'
import { FeatureCollection } from 'geojson'

const vehicles = [
  new Vehicle('Vehicle1', 100, new Position(52.5075, 13.3295)),
  new Vehicle('Vehicle2', 120, new Position(52.5065, 13.3299)),
  new Vehicle('Vehicle3', 80, new Position(52.5057, 13.3304)),
  new Vehicle('Vehicle4', 90, new Position(52.5055, 13.3307)),
  new Vehicle('Vehicle5', 110, new Position(52.5047, 13.3311))
]

let totalVehicleCapacity = 0
vehicles.forEach(vehicle => {
  totalVehicleCapacity += vehicle.capacity
})

const orders = []
let totalCapacity = 0
let orderId = 1

// Generating 100 DeliveryOrder objects
while (orders.length < 100 && totalCapacity < totalVehicleCapacity) {
  const capacity = Math.floor(Math.random() * 20) + 1
  totalCapacity += capacity
  if (totalCapacity <= totalVehicleCapacity) {
    const longitude = 52.5076 + (Math.random() - 0.5) * 0.01
    const latitude = 13.3299 + (Math.random() - 0.5) * 0.01
    orders.push(
      new DeliveryOrder(
          `C${orderId}`,
          `Order${orderId}`,
          capacity,
          new Position(longitude, latitude),
          new Date()
      )
    )
    orderId++
  }
}

const deliveryService = new DeliveryService(vehicles, orders)
const deliveryPlan = deliveryService.optimizeDeliveryPlan()
console.log(`Pending orders: ${deliveryPlan.pendingOrders.length}`)
console.log('---------------------------')
const routes = deliveryPlan.vehicleRoutes
routes.forEach((route, vehicle) => {
  console.log(`Vehicle ID: ${vehicle.driverId}`)
  console.log(`Remaining vehicle capacity: ${vehicle.capacity}`)
  console.log(`Current vehicle position: (${vehicle.currentPosition.latitude}, ${vehicle.currentPosition.longitude})`)
  console.log('Route:')

  const featureCollection: FeatureCollection = generateGeoJsonRoute(route.map(route => route.location))
  console.log(JSON.stringify(featureCollection, null, 2))

  console.log('---------------------------')
})
