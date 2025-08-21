import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsPayableListComponent } from './accounts-payable-list.component';

describe('AccountsPayableListComponent', () => {
  let component: AccountsPayableListComponent;
  let fixture: ComponentFixture<AccountsPayableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsPayableListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsPayableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
