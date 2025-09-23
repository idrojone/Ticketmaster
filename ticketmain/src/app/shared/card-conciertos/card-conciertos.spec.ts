import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardConciertos } from './card-conciertos';

describe('CardConciertos', () => {
  let component: CardConciertos;
  let fixture: ComponentFixture<CardConciertos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardConciertos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardConciertos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
