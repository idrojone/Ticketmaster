import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalCarrito } from './total-carrito';

describe('TotalCarrito', () => {
  let component: TotalCarrito;
  let fixture: ComponentFixture<TotalCarrito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalCarrito]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalCarrito);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
