class Gsi {
  private static instance: Gsi

  private listenerPort: number

  private constructor() {
    this.listenerPort = -1
  }

  public static getInstance(): Gsi {
    if (!Gsi.instance) {
      Gsi.instance = new Gsi()
    }
    return Gsi.instance
  }

  public setListenerPort(port: number) {
    this.listenerPort = port
  }

  public getListenerPort(): number {
    return this.listenerPort
  }
}

export const GSI = Gsi.getInstance()
