import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConcierto } from './add-concierto';

describe('AddConcierto', () => {
  let component: AddConcierto;
  let fixture: ComponentFixture<AddConcierto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddConcierto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddConcierto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
