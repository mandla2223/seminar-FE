import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarFormComponent } from './seminar-form.component';

describe('SeminarFormComponent', () => {
  let component: SeminarFormComponent;
  let fixture: ComponentFixture<SeminarFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeminarFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeminarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
