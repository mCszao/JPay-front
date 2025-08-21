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

export interface Account {
  id: number;
  description: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  category: string;
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

  recentAccounts: Account[] = [
    {
      id: 1,
      description: 'Conta de Luz - Janeiro',
      amount: 285.50,
      dueDate: '2024-01-15',
      status: 'PENDING',
      category: 'Moradia'
    },
    {
      id: 2,
      description: 'Supermercado XYZ',
      amount: 450.30,
      dueDate: '2024-01-12',
      status: 'OVERDUE',
      category: 'Alimentação'
    },
    {
      id: 3,
      description: 'Plano de Saúde',
      amount: 680.00,
      dueDate: '2024-01-20',
      status: 'PENDING',
      category: 'Saúde'
    },
    {
      id: 4,
      description: 'Combustível',
      amount: 320.75,
      dueDate: '2024-01-18',
      status: 'PENDING',
      category: 'Transporte'
    },
    {
      id: 5,
      description: 'Internet Fibra',
      amount: 89.90,
      dueDate: '2024-01-10',
      status: 'PAID',
      category: 'Moradia'
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
      case 'PENDING': return '#FF9800';
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
