import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselGeneros } from './carousel-generos';

describe('CarouselGeneros', () => {
  let component: CarouselGeneros;
  let fixture: ComponentFixture<CarouselGeneros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselGeneros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselGeneros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
