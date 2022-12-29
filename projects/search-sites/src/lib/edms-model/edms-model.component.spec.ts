import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdmsModelComponent } from './edms-model.component';

describe('EdmsModelComponent', () => {
  let component: EdmsModelComponent;
  let fixture: ComponentFixture<EdmsModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdmsModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdmsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
