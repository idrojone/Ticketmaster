import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCarrito } from './list-carrito';

describe('ListCarrito', () => {
  let component: ListCarrito;
  let fixture: ComponentFixture<ListCarrito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCarrito]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCarrito);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
