import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsPayableDialogComponent } from './accounts-payable-dialog.component';

describe('AccountsPayableDialogComponent', () => {
  let component: AccountsPayableDialogComponent;
  let fixture: ComponentFixture<AccountsPayableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsPayableDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsPayableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
