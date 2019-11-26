import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationBookComponent } from './publication-book.component';

describe('PublicationBookComponent', () => {
  let component: PublicationBookComponent;
  let fixture: ComponentFixture<PublicationBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicationBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
