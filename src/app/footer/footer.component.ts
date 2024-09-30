import { Component, NgModule } from '@angular/core';
import { TermsComponent } from '../terms/terms.component';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TermsComponent, RouterModule,TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  selectedLanguage: string = 'en'; 

  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang(this.selectedLanguage);


  }
}
