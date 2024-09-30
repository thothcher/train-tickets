import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { TrainListComponent } from './train-list/train-list.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { TermsComponent } from './terms/terms.component';
import { CheckticketComponent } from './checkticket/checkticket.component';
import { PayComponent } from './pay/pay.component';
import { finalticketComponent } from './finalticket/finalticket.component';

export const routes: Routes = [
    {
        path:'',
        component:MainComponent,
        title:'Home'
    },
    {
        path:'trainList',
        component:TrainListComponent,
        title:'trainList'
    },
    {
        path:'terms',
        component:TermsComponent,
        title:'terms'
    },
    { 
        path: 'train-list',
         component: TrainListComponent 
    },

    { path: 'order-form',
     component: OrderFormComponent 
    },
    { 
        path: 'checkticket',
        component: CheckticketComponent, 
        title:'checkticket'
    },
 
    { 
        path: 'pay',
        component:PayComponent, 
        title:'pay'
    }, 
    { 
        path: 'finalticket',
        component:finalticketComponent, 
        title:'finalticket'
    }, 
  

];
