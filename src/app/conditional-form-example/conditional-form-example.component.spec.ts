import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionalFormExampleComponent } from './conditional-form-example.component';

describe('ConditionalFormExampleComponent', () => {
  let component: ConditionalFormExampleComponent;
  let fixture: ComponentFixture<ConditionalFormExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionalFormExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionalFormExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
