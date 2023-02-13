export class Position {
  constructor (
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly weight: number = 1
  ) {
  }

  distanceTo (other: Position): number {
    const earthRadius = 6371 // Earth's radius in kilometers

    const lat1 = this.latitude * (Math.PI / 180)
    const lat2 = other.latitude * (Math.PI / 180)
    const deltaLat = (other.latitude - this.latitude) * (Math.PI / 180)
    const deltaLon = (other.longitude - this.longitude) * (Math.PI / 180)

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return earthRadius * c
  }
}

export class CustomerDemand {
  private readonly customerID: string
  private readonly capacity: number
  private readonly location: Position
  private readonly orderId: string
  private readonly dateTime: Date

  constructor (customerID: string, capacity: number, location: Position, orderId: string, dateTime: Date) {
    this.customerID = customerID
    this.capacity = capacity
    this.location = location
    this.orderId = orderId
    this.dateTime = dateTime
  }

  public getCustomerID (): string {
    return this.customerID
  }

  public getCapacity (): number {
    return this.capacity
  }

  public getLocation (): Position {
    return this.location
  }

  public getOrderId (): string {
    return this.orderId
  }

  public getDateTime (): Date {
    return this.dateTime
  }
}

export class Vehicle {
  private capacity: number
  private currentPosition: Position
  private readonly driverId: string

  constructor (capacity: number, currentPosition: Position, driverId: string) {
    this.capacity = capacity
    this.currentPosition = currentPosition
    this.driverId = driverId
  }

  public getCapacity (): number {
    return this.capacity
  }

  public setCapacity (capacity: number): void {
    this.capacity = capacity
  }

  public getCurrentPosition (): Position {
    return this.currentPosition
  }

  public setCurrentPosition (currentPosition: Position): void {
    this.currentPosition = currentPosition
  }

  public getDriverId (): string {
    return this.driverId
  }
}

export class DeliveryPlan {
  constructor (
    public readonly vehicleRoutes: Map<Vehicle, CustomerDemand[]>,
    public readonly pendingDemands: CustomerDemand[]
  ) {
  }
}
