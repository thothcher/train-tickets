import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-finalticket',
  standalone: true,
  imports: [RouterModule,FormsModule,NgFor,NgIf,TranslateModule],
  templateUrl: './finalticket.component.html',
  styleUrl: './finalticket.component.css'
})


export class finalticketComponent implements OnInit{

  ticketId: string = '';
  ticket:any;
  isDisplay:boolean = false;
  isIdCorrect: boolean = true;
  currentDate: string = '';
  isTicketDeleted: boolean = false;
  ticketIdfrom: string | null=null;
  selectedLanguage: string = 'en'; 



constructor(private router: Router, private http:HttpClient,private translateService: TranslateService) {
  this.translateService.setDefaultLang(this.selectedLanguage);
}
ngOnInit(): void {
  this.ticketIdfrom = sessionStorage.getItem('ticketId') || null;
  // alert('Successful registration, your ticket ID in last page number is: '+ this.ticketIdfrom)
  this.fetchTrains(this.ticketIdfrom)
}
change(){
  this.isDisplay = !this.isDisplay;



}
// onSubmit() {
// this.fetchTrains(this.ticketId)
// }

fetchTrains(id: string| null) {
  const url = `https://railway.stepprojects.ge/api/tickets/checkstatus/${id}`;
  this.http.get(url).subscribe((response?: any) => {
    console.log('API Response:', response);
    this.ticket = response;

    if (this.ticket && this.ticket.id ===id) {
      this.isDisplay = true; 
      this.isIdCorrect = true; // Set flag to true if ID is correct
      this.setCurrentDate(); 
    } else {
      this.isDisplay = false; // Hide the ticket details section
      this.isIdCorrect = false; // Set flag to false if ID is not correct

    }
  },(error) => {
    console.error('API Error:', error);
    this.isIdCorrect = false; // Set flag to false if there's an error
  }
 );
}

printTicket() {
  const printContents = document.querySelector('.ticket_details')?.innerHTML;
  const originalContents = document.body.innerHTML;

  if (printContents) {
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    location.reload(); // This will reload the page to restore the original contents
  } else {
    console.error('Could not find ticket_container element.');
  }
}

downloadPDF() {
  const element = document.querySelector('.ticket_details') as HTMLElement | null;

  if (element) {
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('ticket_details.pdf');
    }).catch((error) => {
      console.error('Error generating PDF:', error);
    });
  } else {
    console.error('Could not find ticket_details element.');
  }
}
setCurrentDate() {
  const date = new Date();
  this.currentDate = date.toLocaleDateString();
  console.log("date is" , this.currentDate)
}
cancelTicket() {
  const url = `https://railway.stepprojects.ge/api/tickets/cancel/${this.ticketId}`;
  this.http.delete(url).subscribe(() => {
    this.ticket = null;
    this.isDisplay = false;
    this.isTicketDeleted = true;

    console.log('Ticket deleted successfully.');
    alert('Ticket deleted successfuly')
  }, error => {
    console.error('Error deleting ticket:', error);
  });
}

}