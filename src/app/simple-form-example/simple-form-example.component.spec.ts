import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFormExampleComponent } from './simple-form-example.component';

describe('SimpleFormExampleComponent', () => {
  let component: SimpleFormExampleComponent;
  let fixture: ComponentFixture<SimpleFormExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleFormExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleFormExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
