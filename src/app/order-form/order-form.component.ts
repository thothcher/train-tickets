
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, NgModel, FormsModule } from '@angular/forms';
import {  CommonModule, NgFor, NgIf, NgStyle } from '@angular/common';
import { TicketService } from '../ticket.service';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CurrencyService } from '../currency.service';


interface Wagon {
  id: number;
  trainId: number;
  trainNumber: number;
  name: string;
  seats: { seatId: string; number: string; price: number; isOccupied: boolean; vagonId: number }[];
}

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'], 
  imports:[ FormsModule,CommonModule,ReactiveFormsModule, NgFor, NgIf,RouterModule,NgStyle,TranslateModule],
  standalone:true
})
export class OrderFormComponent implements OnInit {
  train: any;
  ticket: any;
  trainId: any;
  filteredWagons: Wagon[] = [];
  selectedWagon: Wagon | undefined;
  selectedWagonSeats: string[] = [];
  selectedWagonClass: string | null = null;
  isDisplay: boolean = false;
  isOpen: boolean = false;
  travelers: number = 1; // Set this dynamically based on your requirement
  travelersPerUL: number = 5;
  selectedSeatNums: string[] = [];
  selectedPassengerIndex: number | null = null;
  seatNum: string | undefined;
  price:number | undefined;
  totalPrice: number = 0;
  selectedSeatIds: Map<number, string> = new Map();  // Map to store selected seat IDs for each passenger
  ticketId: string | null = null;
  selectedLanguage: string = 'en'; 

  totalPriceGEL: number = this.totalPrice; // Example total price in GEL
  totalPriceUSD: number  = 0;
  exchangeRate: number  = 0;
  currency: string = 'GEL';

  orderForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private ticketservice: TicketService,
    private translateService: TranslateService,
    private currencyService: CurrencyService
    // private ticketService:TicketService,

  ) {
    this.translateService.setDefaultLang(this.selectedLanguage);

    this.orderForm = this.formBuilder.group({
      email: ['',[Validators.required,Validators.email]],
      phoneNumber: ['',[Validators.required,Validators.pattern('^[0-9]{9}$')]],
      passengers: this.formBuilder.array([])
    });

    const travelers = sessionStorage.getItem('travelers');
    if (travelers) {
      this.travelers = +travelers;
    }
  }




  fetchExchangeRate() {
    if (this.currency === 'USD') {
      this.currencyService.getExchangeRate().subscribe(data => {
        this.exchangeRate = data.rates.USD;
        this.convertPrice();
      });
    } else {
      this.totalPriceUSD = 0;
    }
  }

  convertPrice() {
    if (this.exchangeRate) {
      this.totalPriceUSD = this.totalPriceGEL * this.exchangeRate;
    }
  }

 

  ngOnInit(): void {
    this.currencyService.currentCurrency.subscribe(currency => {
      this.currency = currency;
      this.fetchExchangeRate();
    });

    this.train = history.state.train;
    this.trainId = history.state.trainId;

    this.setPassengers(this.travelers);

    console.log('look this is train ID', this.trainId);
    console.log('ready-trainId', this.trainId);
    console.log(new Date().toISOString());
    console.log('ready details', this.orderForm.value);
  }

  setPassengers(numPassengers: number) {
    const passengers = this.orderForm.get('passengers') as FormArray;

    for (let i = 0; i < numPassengers; i++) {
      passengers.push(this.formBuilder.group({
        name: [''],
        surname: [''],
        idNumber: ['',[Validators.required,Validators.pattern('^[0-9]{11}$')]],
        seatNumber: ['']
      }));
    }
  }

  signIn(event: Event, index: number) {
    event.preventDefault();
    this.selectedPassengerIndex = index;
    setTimeout(() => {
      this.isDisplay = !this.isDisplay;
    }, 100);
  }

  preventClose(event: Event) {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isDisplay) {
      const clickedInside = (event.target as HTMLElement).closest('.seat_container');
      if (!clickedInside) {
        this.isDisplay = false;
        console.log('Clicked outside, isDisplay:', this.isDisplay);
      }
    }
  }

  openSeat(event: Event) {
    event.preventDefault();
    if (!this.isOpen) {
      this.isOpen = true;
    }
  }
  apiUrl = 'https://railway.stepprojects.ge/api/tickets/register';
  onSubmit() {
    if (this.orderForm.valid) {
      const formData = this.orderForm.value;
      const ticketData = {
        trainId: this.trainId,
        date: new Date().toISOString(),
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        people: formData.passengers.map((passenger: any) => ({
          seatId: this.seatNum,
          name: passenger.name,
          surname: passenger.surname,
          idNumber: passenger.idNumber,
          status: 'confirmed',
          payoutCompleted: true
        }))
      };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      this.http.post(this.apiUrl, ticketData, { headers, responseType: 'text' as 'json' })
        .subscribe(
          response => {
            try {
              const stringedResponse = JSON.stringify(response);
              const ticketId = stringedResponse.slice(46, stringedResponse.length - 1);
              // alert(stringedResponse);
              console.log(ticketId);

              sessionStorage.setItem('ticketId', ticketId);
              console.log('Ticket ID saved in sessionStorage:', ticketId);



            } catch (e) {
              console.error('Error parsing response', e);
            }
          },
          error => {
            console.error('Error registering ticket', error);
            alert(error.error);
          }
        );
    } else {
      this.orderForm.markAllAsTouched();
    }
  }

  showWagon(wagonName: string) {
    this.selectedWagon = this.filteredWagons.find((wagon: Wagon) => wagon.name === wagonName);
    this.selectedWagonSeats = this.selectedWagon ? this.selectedWagon.seats.map(seat => seat.number) : [];
    this.selectedWagonClass = wagonName;
  }

  vagonSearch() {
    const url = `https://railway.stepprojects.ge/api/vagons`;
    this.http.get(url).subscribe((response: any) => {
      this.ticket = response;
      this.filteredWagons = response.filter((wagon: any) => wagon.trainId === this.trainId);
    }, (error) => {
      console.error('API Error:', error);
    });
  }

  // logSeatId(seatNumber: string) {
  //   const selectedSeat = this.selectedWagon?.seats.find(seat => seat.number === seatNumber);
  //   if (selectedSeat) {
  //     this.seatNum = selectedSeat.seatId;
  //     this.price = selectedSeat.price;
  //     console.log('this is price', this.price)
  //     if (this.selectedPassengerIndex !== null) {
  //       const passengers = this.orderForm.get('passengers') as FormArray;
  //       const passenger = passengers.at(this.selectedPassengerIndex) as FormGroup;
  //       passenger.get('seatNumber')?.setValue(selectedSeat.number);


  //       this.totalPrice += selectedSeat.price;


  //     }
  //   }
  // }
  logSeatId(seatNumber: string) {
    const selectedSeat = this.selectedWagon?.seats.find(seat => seat.number === seatNumber);
    if (selectedSeat) {
      // Check if selectedPassengerIndex is not null
      if (this.selectedPassengerIndex !== null && this.selectedPassengerIndex !== undefined) {
        // Check if the seat is already assigned to another passenger
        if (this.selectedSeatIds.has(this.selectedPassengerIndex)) {
          const existingSeatId = this.selectedSeatIds.get(this.selectedPassengerIndex);
          if (existingSeatId) {
            // Find the wagon of the previously selected seat
            const previousWagon = this.filteredWagons.find(wagon => {
              return wagon.seats.some(seat => seat.seatId === existingSeatId);
            });
  
            if (previousWagon) {
              // Find the previous seat and subtract its price from the total
              const previousSeat = previousWagon.seats.find(seat => seat.seatId === existingSeatId);
              if (previousSeat) {
                this.totalPrice -= previousSeat.price;
              }
            }
          }
        }
  
        this.seatNum = selectedSeat.seatId;
        this.price = selectedSeat.price;
        console.log('this is price', this.price);
  
        const passengers = this.orderForm.get('passengers') as FormArray;
        const passenger = passengers.at(this.selectedPassengerIndex) as FormGroup;
  
        passenger.get('seatNumber')?.setValue(selectedSeat.number);
  
        // Add the new seat ID to the map for the current passenger
        this.selectedSeatIds.set(this.selectedPassengerIndex, selectedSeat.seatId);
  
        // Add the new seat price to the total
        this.totalPrice += selectedSeat.price;
        this.totalPriceGEL = this.totalPrice; // Example total price in GEL

      }
    }
  }
  






  get passengers() {
    return this.orderForm.get('passengers') as FormArray;
  }

  passengerIndexes(): number[] {
    return Array(this.travelers).fill(0).map((_, i) => i);
  }
}
