import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoSliderComponent } from './promo-slider.component';

describe('PromoSliderComponent', () => {
  let component: PromoSliderComponent;
  let fixture: ComponentFixture<PromoSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromoSliderComponent]
    });
    fixture = TestBed.createComponent(PromoSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
