import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCarrito } from './card-carrito';

describe('CardCarrito', () => {
  let component: CardCarrito;
  let fixture: ComponentFixture<CardCarrito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCarrito]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardCarrito);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
