import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountsDialogComponent } from './bank-accounts-dialog.component';

describe('BankAccountsDialogComponent', () => {
  let component: BankAccountsDialogComponent;
  let fixture: ComponentFixture<BankAccountsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankAccountsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankAccountsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
