import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsCarousel } from './items-carousel';

describe('ItemsCarousel', () => {
  let component: ItemsCarousel;
  let fixture: ComponentFixture<ItemsCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
