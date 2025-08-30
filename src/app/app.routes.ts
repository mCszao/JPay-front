import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { BankAccountComponent } from './pages/bank-account/bank-account.component';
import { TransactionComponent } from './pages/transactions/transactions.component';


export const routes: Routes = [
  {path: "", component: DashboardComponent},
  { path: "dashboard", component: DashboardComponent },
  { path: "categories", component: CategoriesComponent},
  { path: "bank-accounts", component: BankAccountComponent},
  { path: "transactions", component: TransactionComponent},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
