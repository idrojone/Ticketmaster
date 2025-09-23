import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGeneros } from './list-generos';

describe('ListGeneros', () => {
  let component: ListGeneros;
  let fixture: ComponentFixture<ListGeneros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListGeneros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListGeneros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
