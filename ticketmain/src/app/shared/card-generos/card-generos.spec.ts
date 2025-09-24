import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGeneros } from './card-generos';

describe('CardGeneros', () => {
  let component: CardGeneros;
  let fixture: ComponentFixture<CardGeneros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGeneros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardGeneros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
