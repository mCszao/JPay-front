import {Component, Input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatButtonModule} from "@angular/material/button"
import {RouterModule} from '@angular/router';
import {SnackbarService} from '../../core/services/snack-bar/snackbar.service';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatToolbarModule, MatButtonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private snackBarService: SnackbarService) {
  }

  @Input("btn-add-text") btnAddText: string = "";

  login() {
    this.snackBarService.showSnackBar('Funcionalidade em desenvolvimento', 'info');
  }
}
