import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendFormExampleComponent } from './backend-form-example.component';

describe('BackendFormExampleComponent', () => {
  let component: BackendFormExampleComponent;
  let fixture: ComponentFixture<BackendFormExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackendFormExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendFormExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
