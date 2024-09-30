import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private ticketIdSource = new BehaviorSubject<string | null>(null);
  ticketId$ = this.ticketIdSource.asObservable();

  constructor() { }

  setTicketId(ticketId: string | null) {
    this.ticketIdSource.next(ticketId);
  }
}
