import { Component } from '@angular/core';
import { MainContainerComponent } from "../../components/main-container/main-container.component";
import { PageHeaderComponent } from "../../components/page-header/page-header.component";

@Component({
  selector: 'app-bank-account.component',
  standalone: true,
  imports: [MainContainerComponent, PageHeaderComponent],
  templateUrl: './bank-account.component.html',
  styleUrl: './bank-account.component.scss'
})
export class BankAccountComponent {

}
