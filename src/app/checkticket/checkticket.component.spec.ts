import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckticketComponent } from './checkticket.component';

describe('CheckticketComponent', () => {
  let component: CheckticketComponent;
  let fixture: ComponentFixture<CheckticketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckticketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
