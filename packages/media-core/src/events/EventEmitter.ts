type EventHandler<T = any> = (payload: T) => void;

export class EventEmitter<Events extends Record<string, any>> {
  private listeners = new Map<keyof Events, Set<EventHandler>>();

  public on<E extends keyof Events>(event: E, handler: (payload: Events[E]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const set = this.listeners.get(event)!;
    set.add(handler as EventHandler);

    return () => {
      this.off(event, handler);
    };
  }

  public off<E extends keyof Events>(event: E, handler: (payload: Events[E]) => void): void {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(handler as EventHandler);
      if (set.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  public emit<E extends keyof Events>(event: E, payload: Events[E]): void {
    const set = this.listeners.get(event);
    if (set) {
      for (const handler of set) {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Error in event listener for "${String(event)}":`, error);
        }
      }
    }
  }

  public removeAllListeners(event?: keyof Events): void {
    if (event !== undefined) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}
