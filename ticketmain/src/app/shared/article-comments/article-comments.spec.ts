import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleComments } from './article-comments';

describe('ArticleComments', () => {
  let component: ArticleComments;
  let fixture: ComponentFixture<ArticleComments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleComments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleComments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
