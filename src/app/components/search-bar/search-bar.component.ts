import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Buscar...';
  @Input() filterOptions: string[] = [];
  @Input() filterLabel: string = '';
  @Input() addButtonLabel: string = '+ Adicionar';
  @Input() showFilter: boolean = true;

  @Output() search = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() add = new EventEmitter<void>();

  searchValue: string = '';
  selectedFilter: string = '';

  onSearchChange(value: string) {
    this.searchValue = value;
    this.search.emit(this.searchValue);
  }

  // onFilterChange(value: string) {
  //   this.selectedFilter = value;
  //   this.filterChange.emit(this.selectedFilter);
  // }

  onAddClick() {
    this.add.emit();
  }
}
