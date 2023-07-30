export class EventService {
  fire(name: string, payload = {}) {
    const event = new CustomEvent(name, { detail: payload });
    document.dispatchEvent(event);
  }
}
