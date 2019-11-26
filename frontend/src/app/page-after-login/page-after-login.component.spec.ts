import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAfterLoginComponent } from './page-after-login.component';

describe('PageAfterLoginComponent', () => {
  let component: PageAfterLoginComponent;
  let fixture: ComponentFixture<PageAfterLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageAfterLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAfterLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
