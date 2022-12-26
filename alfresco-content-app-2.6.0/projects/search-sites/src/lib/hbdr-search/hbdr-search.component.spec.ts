import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HbdrSearchComponent } from './hbdr-search.component';

describe('HbdrSearchComponent', () => {
  let component: HbdrSearchComponent;
  let fixture: ComponentFixture<HbdrSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HbdrSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HbdrSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
