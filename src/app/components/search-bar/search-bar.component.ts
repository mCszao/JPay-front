import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule, MatCheckbox],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Buscar...';
  @Input() filterOptions: string[] = [];
  @Input() filterLabel: string = '';
  @Input() addButtonLabel: string = '+ Adicionar';
  @Input() showFilter: boolean = true;
  @Input() active?: boolean
  @Input() showInactiveFilter: boolean = false;

  @Output() search = new EventEmitter<string>();
  @Output() checkboxChange = new EventEmitter<boolean>();
  @Output() add = new EventEmitter<void>();

  searchValue: string = '';

  onSearchChange(value: string) {
    this.searchValue = value;
    this.search.emit(this.searchValue);
  }

  onCheckBoxChange() {
    this.checkboxChange.emit(this.active)
  }

  onAddClick() {
    this.add.emit();
  }
}
