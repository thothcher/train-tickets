import { Component } from '@angular/core';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent {
  selectedLanguage: string = 'en'; 

  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang(this.selectedLanguage);


  }
}
