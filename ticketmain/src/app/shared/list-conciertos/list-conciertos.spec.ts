import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConciertos } from './list-conciertos';

describe('ListConciertos', () => {
  let component: ListConciertos;
  let fixture: ComponentFixture<ListConciertos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListConciertos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListConciertos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
