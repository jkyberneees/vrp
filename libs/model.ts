export class Position {
  constructor (
    public readonly latitude: number,
    public readonly longitude: number
  ) {
  }

  /**
   * See: https://en.wikipedia.org/wiki/Haversine_formula
   */
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

export class DeliveryOrder {
  constructor (
    public readonly customerId: string,
    public readonly orderId: string,

    public readonly capacity: number,
    public readonly location: Position,
    public readonly dateTime: Date,
    public readonly weight: number = 1
  ) {
  }
}

export class Vehicle {
  private _capacity: number
  private _currentPosition: Position

  constructor (public readonly driverId: string, capacity: number, currentPosition: Position) {
    this._capacity = capacity
    this._currentPosition = currentPosition
  }

  public get capacity (): number {
    return this._capacity
  }

  public set capacity (capacity: number) {
    this._capacity = capacity
  }

  public get currentPosition (): Position {
    return this._currentPosition
  }

  public set currentPosition (currentPosition: Position) {
    this._currentPosition = currentPosition
  }
}

export class DeliveryPlan {
  constructor (
    public readonly vehicleRoutes: Map<Vehicle, DeliveryOrder[]>,
    public readonly pendingOrders: DeliveryOrder[]
  ) {
  }
}
