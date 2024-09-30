import { Component, OnInit } from '@angular/core';
import { RouterModule, } from '@angular/router';

import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';




@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [RouterModule,TranslateModule],
  templateUrl: './pay.component.html',
  styleUrl: './pay.component.css'
})
export class PayComponent  {
  ticketId: string | null=null;
  selectedLanguage: string = 'en'; 

  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang(this.selectedLanguage);


  }

onSubmit(){
  // this.ticketId = sessionStorage.getItem('ticketId') || null;
  //   alert('Successful registration, your ticket ID number is: '+ this.ticketId)
}
}
