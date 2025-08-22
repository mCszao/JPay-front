import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPayableDialogComponent } from './accounts-payable-dialog.component';

describe('AccountsPayableDialogComponent', () => {
  let component: AccountPayableDialogComponent;
  let fixture: ComponentFixture<AccountPayableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountPayableDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountPayableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
