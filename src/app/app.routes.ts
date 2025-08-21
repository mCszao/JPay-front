import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { BankAccountComponent } from './pages/bank-account/bank-account.component';
import { AccountPayableComponent } from './pages/account-payable/account-payable.component';

export const routes: Routes = [
  {path: "", component: DashboardComponent},
  { path: "dashboard", component: DashboardComponent },
  { path: "categories", component: CategoriesComponent},
  { path: "bank-accounts", component: BankAccountComponent},
  { path: "accounts-payable", component: AccountPayableComponent},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
