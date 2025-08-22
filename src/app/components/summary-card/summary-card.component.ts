import { Component, Input } from '@angular/core';
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-summary-card',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './summary-card.component.html',
  styleUrl: './summary-card.component.scss'
})
export class SummaryCardComponent {
  @Input("label-text") labelText: string = "";
  @Input("amount") amount: number = 0;
  @Input("material-icon-name") materialIconName: string = "";
  @Input("color") color: string = "";

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

}
