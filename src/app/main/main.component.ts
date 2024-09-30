import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, AfterViewInit, NgModule, ElementRef, OnInit, HostListener, viewChild, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { DateAdapter } from '@angular/material/core';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatSelect } from '@angular/material/select';





interface Source {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatSliderModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, NgClass, NgFor, NgIf, FormsModule, CommonModule, RouterModule, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, TranslateModule,],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})


export class MainComponent implements OnInit {


  //ინფორმაცია სორსების ასარჩევად
  formatLabel(value: number): string {
    return `${value}`;
  }





  source: string = '';
  destination: string = '';
  date: string = '';
  travelers: number = 1;
  filteredDestinations: Source[] = [];
  language: string = ''

  //ინფორმაცია სორსების ასარჩევად

  sources: Source[] = [
    { value: 'თბილისი', viewValue: this.language == 'geo' ? 'თბილისი' : 'Tbilisi' },
    { value: 'ბათუმი', viewValue: 'ბათუმი' },
    { value: 'ფოთი', viewValue: 'ფოთი' },
  ];

  updateSourcesViewValue() {
    this.language = JSON.parse(localStorage.getItem('selectedLanguage') || '');
    switch (this.language) {
      case 'geo':
        this.sources[0].viewValue = 'თბილისი';
        this.sources[1].viewValue = 'ბათუმი';
        this.sources[2].viewValue = 'ფოთი';
        break;
      default:
        // If language is not 'geo', set default values
        this.sources[0].viewValue = 'Tbilisi';
        this.sources[1].viewValue = 'Batumi';
        this.sources[2].viewValue = 'Poti';

        break;
    }
  }



  onSelectMenuOpen(isOpened: boolean) {
    if (isOpened) {
        // Always fetch and update the language and view values whenever the menu is opened
        this.language = JSON.parse(localStorage.getItem('selectedLanguage') || '{}');
        console.log("header component lang", this.language);
        this.updateSourcesViewValue();
    }
}


  constructor(private router: Router, private dateAdapter: DateAdapter<Date>, private translate: TranslateService) {
    translate.setDefaultLang('en');



    // Setting the locale to be used by date adapter
    this.dateAdapter.setLocale('en-GB'); // Set your desired locale

  }

  ngOnInit() {
    this.filteredDestinations = [...this.sources];



  }


  // Function to filter out dates before today
  dateFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight to compare only dates
    return (d || new Date()) >= today; // Allow only today or future dates
  };

  filterDestinationOptions() {
    this.filteredDestinations = this.sources.filter(option => option.value !== this.source);
  }

  onSubmit() {
    this.router.navigate(['/train-list'], {
      queryParams: {
        source: this.source,
        destination: this.destination,
        date: this.date,
        travelers: this.travelers,
      },
    });
  }



  // რეგისტრაცია
  isDisplay: boolean = false;

  check() {
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
      const clickedInside = (event.target as HTMLElement).closest('.popup');
      if (!clickedInside) {
        this.isDisplay = false;
        console.log('Clicked outside, isDisplay:', this.isDisplay);
      }
    }
  }





  adults: number = 1;
  children: number = 0;
  showPopup: boolean = false;
  increaseAdults() {
    this.adults++;
  }

  decreaseAdults() {
    if (this.adults > 1) {
      this.adults--;
    }
  }

  increaseChildren() {
    this.children++;
  }

  decreaseChildren() {
    if (this.children > 0) {
      this.children--;
    }
  }



}