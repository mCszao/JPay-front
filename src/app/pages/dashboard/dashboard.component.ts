import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatChipsModule } from "@angular/material/chips"
import { MatButtonModule } from "@angular/material/button"
import { NgxChartsModule } from "@swimlane/ngx-charts"
import { SummaryCardComponent } from '../../components/summary-card/summary-card.component';
import { SummaryCardsContainerComponent } from '../../components/summary-cards-container/summary-cards-container.component';
import { PageHeaderComponent } from "../../components/page-header/page-header.component";
import { MainContainerComponent } from '../../components/main-container/main-container.component';
import { AccountPayable } from '../../interfaces/AccountPayable';
export interface SummaryData {
  totalBalance: number;
  totalAccounts: number;
  overdueAccounts: number;
  paidThisMonth: number;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatCardModule, MatChipsModule, NgxChartsModule, MatButtonModule, SummaryCardsContainerComponent, SummaryCardComponent, PageHeaderComponent, MainContainerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  summaryData: SummaryData = {
    totalBalance: 45250.75,
    totalAccounts: 24,
    overdueAccounts: 3,
    paidThisMonth: 12850.30
  };

  chartData: ChartData[] = [
    { name: 'Alimentação', value: 3500, color: '#FF6B6B' },
    { name: 'Transporte', value: 2800, color: '#4ECDC4' },
    { name: 'Moradia', value: 4200, color: '#45B7D1' },
    { name: 'Saúde', value: 1800, color: '#96CEB4' },
    { name: 'Educação', value: 2200, color: '#FFEAA7' },
    { name: 'Outros', value: 1500, color: '#DDA0DD' }
  ];

  recentAccounts: AccountPayable[] = [
    {
      id: 1,
      type: "PASSIVO",
      bankAccount: "MOOPA",
      description: 'Conta de Luz - Janeiro',
      amount: 285.50,
      expirationDate: '2024-01-15',
      status: 'PENDING',
      category: 'Moradia'
    },
    {
      id: 2,
      type: "PASSIVO",
      bankAccount: "MOOPA",
      description: 'Supermercado XYZ',
      amount: 450.30,
      expirationDate: '2024-01-12',
      status: 'EXPIRED',
      category: 'Alimentação'
    },
    {
      id: 3,
      type: "PASSIVO",
      bankAccount: "MOOPA",
      description: 'Plano de Saúde',
      amount: 680.00,
      expirationDate: '2024-01-20',
      status: 'PENDING',
      category: 'Saúde'
    },
    {
      id: 4,
      bankAccount: "MOOPA",
      type: "PASSIVO",
      description: 'Combustível',
      amount: 320.75,
      expirationDate: '2024-01-18',
      status: 'PENDING',
      category: 'Transporte'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Aqui você pode chamar os serviços para buscar dados reais da API
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // TODO: Implementar chamadas para os serviços
    // this.bankAccountService.getTotalBalance().subscribe(...)
    // this.accountService.getAccountsSummary().subscribe(...)
    // this.categoryService.getExpensesByCategory().subscribe(...)
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PAID': return '#2cad31ff';
      case 'PENDING': return '#ff9900c7';
      case 'OVERDUE': return '#F44336';
      default: return 'none';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PAID': return 'Pago';
      case 'PENDING': return 'Pendente';
      case 'OVERDUE': return 'Vencido';
      default: return status;
    }
  }

  onNewAccount(): void {
    // TODO: Navegar para a página de criação de conta
    // this.router.navigate(['/accounts/new']);
  }

  onViewAllAccounts(): void {
    // TODO: Navegar para a página de listagem de contas
    // this.router.navigate(['/accounts']);
  }
}
