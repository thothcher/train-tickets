import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-train-list',
  standalone: true,
  imports: [NgFor, HttpClientModule, NgIf,RouterModule,TranslateModule],
  templateUrl: './train-list.component.html',
  styleUrl: './train-list.component.css'
})
export class TrainListComponent implements OnInit {
  // filteredTrains: trainType[] = []

  source!: string;
  destination!: string;
  date!: string;
  travelers!: number; // Declare the travelers variable
  trains: any[] = [];
  selectedLanguage: string = 'en'; 




  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient,private translateService: TranslateService) {
    this.translateService.setDefaultLang(this.selectedLanguage);
   }


  ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
      this.source = params['source'];
      this.destination = params['destination'];
      this.date = params['date'];
      this.fetchTrains();
    });
    const params = this.route.snapshot.queryParamMap;
    this.travelers = +(params.get('travelers') || 0);
    console.log('here is travelers numbers', this.travelers)
    sessionStorage.setItem('travelers', this.travelers.toString());

  }

  fetchTrains() {
    const url = 'https://railway.stepprojects.ge/api/departures';

    let params = new HttpParams()
      .set('source', this.source)
      .set('destination', this.destination)
      .set('date', this.date)

    this.http.get<any[]>(url, { params }).subscribe((response: any[]) => { // Corrected the type declaration to any[]
      console.log('API Response:', response);

      this.trains = response.filter(train =>
        train.source === this.source &&
        train.destination === this.destination &&
        train.date === this.transformToGeorgianWeekday(this.date)
      )[0].trains;

      console.log('API gett:', this.trains);
    }, (error) => {
      console.error('Error fetching trains:', error);
    });
  }



  transformToGeorgianWeekday(dateString: string) {
    const weekdays = ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'];
  
    // Ensure that the date string is in a format that JavaScript Date object can parse
    const dateObj = new Date(dateString);
 
    const weekday = weekdays[dateObj.getDay()];
    console.log(dateString)
    return weekday;
  }
  
  orderTicket(train:any, trainId: any) {
    // Navigate to the component where the traveler information form is displayed
    this.router.navigate(['/order-form'], { state: { train:train, trainId: trainId } });
  }

}