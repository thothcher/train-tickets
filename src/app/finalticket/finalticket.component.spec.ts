import { ComponentFixture, TestBed } from '@angular/core/testing';

import {finalticketComponent } from './finalticket.component';

describe('FinalticketComponent', () => {
  let component: finalticketComponent;
  let fixture: ComponentFixture<finalticketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [finalticketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(finalticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
