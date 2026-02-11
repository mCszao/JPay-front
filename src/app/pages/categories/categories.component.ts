import {Component, OnInit, signal} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

import {MainContainerComponent} from "../../components/main-container/main-container.component";
import {PageHeaderComponent} from "../../components/page-header/page-header.component";
import {
  SummaryCardsContainerComponent
} from "../../components/summary-card/summary-cards-container/summary-cards-container.component";
import {SummaryCardComponent} from "../../components/summary-card/summary-card.component";
import {SearchBarComponent} from "../../components/search-bar/search-bar.component";
import {Category} from '../../domain/category/interfaces/Category';
import {CategoryFormData} from '../../domain/category/interfaces/CategoryFormData';
import {CategoriesListComponent} from "../../components/categories-list/categories-list.component";
import {CategoryDialogComponent} from '../../components/categories-list/category-dialog/category-dialog.component';
import {DialogService} from '../../core/services/dialog/dialog.service';
import {CategoryResponse} from '../../domain/category/interfaces/CategoryResponse';
import {DateService} from '../../core/utils/date/date.util';
import {CategoryService} from '../../domain/category/services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [MainContainerComponent, PageHeaderComponent, SummaryCardsContainerComponent, SummaryCardComponent, SearchBarComponent, CategoriesListComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  filteredCategories: Category[] = [];
  showInactive: boolean = true;
  isLoading: boolean = false;
  currentPage: number = 0;
  totalActiveCategories = signal(0);
  totalCategories = signal(0);
  mostUsedCategorie = signal("Sem lançamentos cadastrados")

  get getCategories(): Category[] {
    if (!this.showInactive) return this.filteredCategories.filter(c => c.active)
    return this.filteredCategories
  }


  constructor(private snackBar: MatSnackBar, private dialogService: DialogService, private categoryService: CategoryService, private dateService: DateService) {
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  protected loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAll(this.currentPage).subscribe({
      next: (categories) => {
        this.filteredCategories = categories.content;
      },
      error: (error: any) => {
        this.showSnackBar(error.message, 'error');
      },
      complete: () => {
        this.buildStats();
      }
    })
  }

  onSearch(textInput: string): void {
    if (textInput.trim()) {
      this.filteredCategories = this.filteredCategories.filter(category =>
        category.name.toLowerCase().includes(textInput.toLowerCase())
      );
    } else {
      this.loadCategories();
    }
  }

  onNewCategory(): void {
    const ref = this.dialogService.open(CategoryDialogComponent, {mode: 'create'});

    ref.afterClosed().subscribe(formData => {
      if (!formData) return;
      this.createCategory(formData);
    });
  }

  onEditCategory(category: Category): void {
    const ref = this.dialogService.open(
      CategoryDialogComponent,
      {
        mode: 'edit',
        value: {
          name: category.name,
          description: category.description,
        },
      }
    );

    ref.afterClosed().subscribe(formData => {
      if (!formData) return;
      this.updateCategory(category.id, formData);
    });
  }

  onToggleStatus(category: Category): void {
    const action = category.active ? 'desativa' : 'ativa';

    this.categoryService.deactivate(category.id).subscribe({
      next: () => {
        this.showSnackBar(`Categoria ${action}da com sucesso!`, 'success');
        category.active = !category.active;
        this.buildStats();
      },
      error: (error: any) => {
        this.showSnackBar(error.message, 'error');
      }
    })
  }

  onDeleteCategory(category: Category): void {
    if (confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
      // TODO: Implementar chamada da API
      this.categoryService.delete(category.id).subscribe({
        next: () => {
          this.showSnackBar('Categoria excluída com sucesso!', 'success');
          this.loadCategories();
        },
        error: (error: any) => {
          this.showSnackBar(error.message, 'error');
        }
      })
    }
  }

  protected onCheckedActive(event: boolean) {
    this.showInactive = event
    this.loadCategories()
  }

  private createCategory(formData: CategoryFormData): void {
    this.categoryService.add(formData).subscribe({
      next: (category: CategoryResponse) => {
        this.filteredCategories.push(category);
        this.showSnackBar('Categoria criada com sucesso!', 'success');
      },
      error: (error: any) => {
        this.showSnackBar(error.message, 'error');
      }
    })
    this.buildStats();
  }

  private updateCategory(id: number, formData: CategoryFormData): void {
    this.categoryService.update(id, formData).subscribe({
      next: (category: CategoryResponse) => {
        const categoryIndex = this.filteredCategories.findIndex(c => c.id === id);
        if (categoryIndex !== -1) {
          this.filteredCategories[categoryIndex] = category;
          this.showSnackBar('Categoria atualizada com sucesso!', 'success');
        }
      },
      error: (error: any) => {
        this.showSnackBar(error.message, 'error');
      }
    })
    this.buildStats();
  }

  formatDate(dateString: string): string {
    return this.dateService.formatDateByString(dateString);
  }

  getStatusText(active: boolean): string {
    return active ? 'Ativo' : 'Inativo';
  }

  getStatusColor(active: boolean): string {
    return active ? '#4CAF50' : '#757575';
  }

  buildStats() {
    this.totalCategories.set(this.filteredCategories.length)
    this.totalActiveCategories.set(this.filteredCategories.filter(c => c.active).length)
    this.categoryService.mostUsed().subscribe({
      next: (category: CategoryResponse) => {
        this.mostUsedCategorie.set(category.id > 0 ? category.name : 'Sem lançamentos cadastrados');
      }
      , error: (error: any) => {
        this.showSnackBar(error, "error");
      }
    })
  }

  private showSnackBar(message: string, type: 'success' | 'error' | 'info'): void {
    const config = {
      duration: 3000,
      panelClass: [`snackbar-${type}`]
    };

    this.snackBar.open(message, 'Fechar', config);
  }
}
