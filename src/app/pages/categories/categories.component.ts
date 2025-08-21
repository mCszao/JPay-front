import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { MainContainerComponent } from "../../components/main-container/main-container.component";
import { PageHeaderComponent } from "../../components/page-header/page-header.component";
import { SummaryCardsContainerComponent } from "../../components/summary-cards-container/summary-cards-container.component";
import { SummaryCardComponent } from "../../components/summary-card/summary-card.component";
import { SearchBarComponent } from "../../components/search-bar/search-bar.component";
import { Category } from '../../interfaces/Category';
import { CategoryFormData } from '../../interfaces/CategoryFormData';
import { CategoriesListComponent } from "../../components/categories-list/categories-list.component";
import { CategoryDialogComponent, CategoryDialogData } from '../../components/category-dialog/category-dialog.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ MainContainerComponent, PageHeaderComponent, SummaryCardsContainerComponent, SummaryCardComponent, SearchBarComponent, CategoriesListComponent, CategoryDialogComponent],
templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {

  categories: Category[] = [
    {
      id: 1,
      name: 'Alimentação',
      description: 'Gastos com supermercado, restaurantes e delivery',
      active: true,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 2,
      name: 'Transporte',
      description: 'Combustível, transporte público e manutenção veicular',
      active: true,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 3,
      name: 'Moradia',
      description: 'Aluguel, condomínio, energia elétrica e água',
      active: true,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 4,
      name: 'Saúde',
      description: 'Plano de saúde, medicamentos e consultas médicas',
      active: true,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 5,
      name: 'Educação',
      description: 'Cursos, livros e material educacional',
      active: true,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 6,
      name: 'Lazer',
      description: 'Cinema, viagens e atividades recreativas',
      active: false,
      createdAt: '2024-01-05T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },{
      id: 5,
      name: 'Educação',
      description: 'Cursos, livros e material educacional',
      active: true,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },{
      id: 5,
      name: 'Educação',
      description: 'Cursos, livros e material educacional',
      active: true,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },{
      id: 5,
      name: 'Educação',
      description: 'Cursos, livros e material educacional',
      active: true,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },{
      id: 5,
      name: 'Educação',
      description: 'Cursos, livros e material educacional',
      active: true,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },{
      id: 5,
      name: 'Educação',
      description: 'Cursos, livros e material educacional',
      active: true,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },{
      id: 5,
      name: 'Educação',
      description: 'Cursos, livros e material educacional',
      active: true,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },

  ];

  filteredCategories: Category[] = [];
  searchTerm: string = '';
  showInactive: boolean = false;
  isLoading: boolean = false;

  totalCategories: number = 0;


  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.isLoading = true;

    // TODO: Substituir por chamada real da API
    // this.categoryService.getCategories(this.currentPage, this.pageSize).subscribe(...)

    setTimeout(() => {
      this.filteredCategories = this.categories.filter(category =>
        this.showInactive ? true : category.active
      );
      this.totalCategories = this.filteredCategories.length;
      this.isLoading = false;
    }, 500);
  }

  onSearch(event: any): void {
    if (this.searchTerm.trim()) {
      this.filteredCategories = this.categories.filter(category =>
        category.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (this.showInactive ? true : category.active)
      );
    } else {
      this.loadCategories();
    }
  }

  onFilterChange(event: any): void {

  }

  onToggleInactive(): void {
    this.loadCategories();
  }

  onNewCategory(): void {
  const ref = this.dialog.open<CategoryDialogComponent, CategoryDialogData, { name: string; description: string }>(
    CategoryDialogComponent,
    {
      data: { mode: 'create' },
      autoFocus: false
    }
  );

  ref.afterClosed().subscribe(formData => {
    if (!formData) return;
    this.createCategory(formData);
  });
}

  onEditCategory(event: any): void {
    // TODO: Abrir modal de edição
    // const dialogRef = this.dialog.open(CategoryFormComponent, {
    //   width: '500px',
    //   data: { isEdit: true, category: category }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.updateCategory(category.id, result);
    //   }
    // });

    this.showSnackBar(`Editar categoria: ${event.name}`, 'info');
  }

  onToggleStatus(event: any): void {
    // const action = category.active ? 'desativar' : 'ativar';

    // TODO: Implementar chamada da API
    // if (category.active) {
    //   this.categoryService.deactivateCategory(category.id).subscribe(...)
    // } else {
    //   this.categoryService.activateCategory(category.id).subscribe(...)
    // }

    // category.active = !category.active;
    // category.updatedAt = new Date().toISOString();

    this.showSnackBar(`Categoria ${event}da com sucesso!`, 'success');
    this.loadCategories();
  }

  onDeleteCategory(event: any): void {
    // if (confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
    //   // TODO: Implementar chamada da API
    //   // this.categoryService.deleteCategory(category.id).subscribe(...)

    //   this.categories = this.categories.filter(c => c.id !== category.id);
    //   this.loadCategories();
    //   this.showSnackBar('Categoria excluída com sucesso!', 'success');
    // }
  }

  private createCategory(formData: CategoryFormData): void {
    // TODO: Implementar chamada da API
    // this.categoryService.createCategory(formData).subscribe(...)

    const newCategory: Category = {
      id: Math.max(...this.categories.map(c => c.id)) + 1,
      name: formData.name,
      description: formData.description,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.categories.push(newCategory);
    this.loadCategories();
    this.showSnackBar('Categoria criada com sucesso!', 'success');
  }

  private updateCategory(id: number, formData: CategoryFormData): void {
    // TODO: Implementar chamada da API
    // this.categoryService.updateCategory(id, formData).subscribe(...)

    const categoryIndex = this.categories.findIndex(c => c.id === id);
    if (categoryIndex !== -1) {
      this.categories[categoryIndex] = {
        ...this.categories[categoryIndex],
        name: formData.name,
        description: formData.description,
        updatedAt: new Date().toISOString()
      };
      this.loadCategories();
      this.showSnackBar('Categoria atualizada com sucesso!', 'success');
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  getStatusText(active: boolean): string {
    return active ? 'Ativo' : 'Inativo';
  }

  getStatusColor(active: boolean): string {
    return active ? '#4CAF50' : '#757575';
  }


  private showSnackBar(message: string, type: 'success' | 'error' | 'info'): void {
    const config = {
      duration: 3000,
      panelClass: [`snackbar-${type}`]
    };

    this.snackBar.open(message, 'Fechar', config);
  }
}
