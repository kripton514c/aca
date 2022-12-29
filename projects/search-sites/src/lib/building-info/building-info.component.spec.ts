import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingInfoComponent } from './building-info.component';

describe('BuildingInfoComponent', () => {
  let component: BuildingInfoComponent;
  let fixture: ComponentFixture<BuildingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
