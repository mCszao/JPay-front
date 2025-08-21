import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface CategoryRow {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-list.component.html',
  styleUrls: ['../list.shared.scss'],
})
export class CategoriesListComponent {
  @Input() items: CategoryRow[] = [];
  @Output() edit = new EventEmitter<CategoryRow>();
  @Output() toggle = new EventEmitter<CategoryRow>();
  @Output() remove = new EventEmitter<CategoryRow>();
}
