import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFollow } from './profile-follow';

describe('ProfileFollow', () => {
  let component: ProfileFollow;
  let fixture: ComponentFixture<ProfileFollow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileFollow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileFollow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
