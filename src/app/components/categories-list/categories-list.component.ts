import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../domain/category/interfaces/Category';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl:'./categories-list.component.html',
  styleUrls: ['../list.shared.scss'],
})
export class CategoriesListComponent {
  @Input() items: Category[] = [];
  @Output() edit = new EventEmitter<Category>();
  @Output() toggle = new EventEmitter<Category>();
  @Output() remove = new EventEmitter<Category>();
}
