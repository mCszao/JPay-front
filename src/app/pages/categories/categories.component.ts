import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatProgressSpinnerModule, } from '@angular/material/progress-spinner';
import { MainContainerComponent } from "../../components/main-container/main-container.component";
import { PageHeaderComponent } from "../../components/page-header/page-header.component";



export interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [MatPaginatorModule, MatToolbarModule, MatIconModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatFormFieldModule, MatProgressSpinnerModule, MainContainerComponent, PageHeaderComponent],
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
    }
  ];

  filteredCategories: Category[] = [];
  searchTerm: string = '';
  showInactive: boolean = false;
  isLoading: boolean = false;

  // Pagination
  pageSize: number = 10;
  currentPage: number = 0;
  totalCategories: number = 0;

  // Table columns
  displayedColumns: string[] = ['name', 'description', 'status', 'createdAt', 'actions'];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
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

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.filteredCategories = this.categories.filter(category =>
        category.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (this.showInactive ? true : category.active)
      );
    } else {
      this.loadCategories();
    }
  }

  onToggleInactive(): void {
    this.loadCategories();
  }

  onNewCategory(): void {
    // TODO: Abrir modal de criação
    // const dialogRef = this.dialog.open(CategoryFormComponent, {
    //   width: '500px',
    //   data: { isEdit: false }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.createCategory(result);
    //   }
    // });

    this.showSnackBar('Funcionalidade em desenvolvimento', 'info');
  }

  onEditCategory(category: Category): void {
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

    this.showSnackBar(`Editar categoria: ${category.name}`, 'info');
  }

  onToggleStatus(category: Category): void {
    const action = category.active ? 'desativar' : 'ativar';

    // TODO: Implementar chamada da API
    // if (category.active) {
    //   this.categoryService.deactivateCategory(category.id).subscribe(...)
    // } else {
    //   this.categoryService.activateCategory(category.id).subscribe(...)
    // }

    category.active = !category.active;
    category.updatedAt = new Date().toISOString();

    this.showSnackBar(`Categoria ${action}da com sucesso!`, 'success');
    this.loadCategories();
  }

  onDeleteCategory(category: Category): void {
    if (confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
      // TODO: Implementar chamada da API
      // this.categoryService.deleteCategory(category.id).subscribe(...)

      this.categories = this.categories.filter(c => c.id !== category.id);
      this.loadCategories();
      this.showSnackBar('Categoria excluída com sucesso!', 'success');
    }
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

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCategories();
  }

  private showSnackBar(message: string, type: 'success' | 'error' | 'info'): void {
    const config = {
      duration: 3000,
      panelClass: [`snackbar-${type}`]
    };

    this.snackBar.open(message, 'Fechar', config);
  }
}
