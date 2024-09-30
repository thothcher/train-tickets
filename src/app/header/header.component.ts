import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, HostListener, OnInit, } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CurrencyService } from '../currency.service';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, RouterModule, NgIf, NgClass, CommonModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  language: string = ''

  selectedLanguage: string = 'en';
  selectedCurrency: string = 'gel';

  currency: string= 'GEL';

  onCurrencyChange(event: any) {
    this.currencyService.changeCurrency(event.target.value);
  }

  constructor(private translateService: TranslateService, private currencyService: CurrencyService) {
    this.translateService.setDefaultLang(this.selectedLanguage);
    localStorage.setItem('selectedLanguage', JSON.stringify("en"))

    this.currencyService.currentCurrency.subscribe(currency => this.currency = currency);
  }

  switchCurrency(event: Event) {
    event.preventDefault();
  }
  // getCurrency(): string {
  //   if (this.selectedLanguage === 'en') {
  //     return this.selectedCurrency === 'usd' ? 'USD' : 'GEL';
  //   } else {
  //     return this.selectedCurrency === 'usd' ? 'დოლარი' : 'ლარი';
  //   }
  // }


  switchLanguage(language: string) {
    this.selectedLanguage = language;
    this.translateService.use(language);
    localStorage.removeItem("selectedLanguage")
    localStorage.setItem('selectedLanguage', JSON.stringify(language))

  }

  getLanguageName(): string {
    // Replace with actual translations as per your JSON files
    return this.selectedLanguage === 'en' ? 'English' : 'ქართული'; // Example translation
  }

  // constructor(private translate: TranslateService) {
  //   translate.setDefaultLang('en');
  // }

  // switchLanguage(language: string) {
  //   this.translate.use(language);
  // }

  toggleMenu: boolean = false;

  toggle() {
    this.toggleMenu = !this.toggleMenu
    console.log(this.toggleMenu)
  }
  preventToggle(event: Event) {
    event.stopPropagation();
  }


  // რესპონსივში ენების/ვალუტის გამოატანა

  list: boolean = false;
  responsiveList() {
    this.list = !this.list
    console.log(this.list)
  }
  listCurrensy: boolean = false;
  responsiveListCurrency() {
    this.listCurrensy = !this.listCurrensy
  }

  // რეგისტრაციის ფორმის ჩართვა/გამორთვა
  isDisplay: boolean = false;

  signIn() {
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
      const clickedInside = (event.target as HTMLElement).closest('.sign-container');
      if (!clickedInside) {
        this.isDisplay = false;
        console.log('Clicked outside, isDisplay:', this.isDisplay);
      }
    }
  }
}
