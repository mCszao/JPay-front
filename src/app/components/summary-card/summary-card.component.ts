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
  @Input("amount") amount?: number;
  @Input("quantity") quantity: string = "";
  @Input("name") name: string = "";
  @Input("material-icon-name") materialIconName: string = "";
  @Input("color") color: string = "";
  @Input("acceptZero") acceptZero: boolean = false;

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

}
