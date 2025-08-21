import { Component } from '@angular/core';
import { MainContainerComponent } from "../../components/main-container/main-container.component";
import { PageHeaderComponent } from "../../components/page-header/page-header.component";

@Component({
  selector: 'app-account-payable.component',
  standalone: true,
  imports: [MainContainerComponent, PageHeaderComponent],
  templateUrl: './account-payable.component.html',
  styleUrl: './account-payable.component.scss'
})
export class AccountPayableComponent {

}
