import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private apiUrl = 'https://api.exchangerate-api.com/v4/latest/GEL'; 
  constructor(private http: HttpClient) {}
  getExchangeRate(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  private currencySource = new BehaviorSubject<string>('GEL');
  currentCurrency = this.currencySource.asObservable();

  changeCurrency(currency: string) {
    this.currencySource.next(currency);
  }
}
