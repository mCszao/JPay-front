### JPay Admin — Angular 20

Aplicação web administrativa minimalista para gestão de:
- Categorias
- Contas Bancárias
- Contas a Pagar

O projeto usa Angular 20 com standalone components, diretivas modernas (@if/@for), Angular Material para UI e uma arquitetura em camadas: pages (containers), components (apresentação), dialogs (CRUD), services (HTTP) e interfaces (tipos).

---

### Sumário
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré‑requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Scripts](#scripts)
- [Padrões de Arquitetura](#padrões-de-arquitetura)
- [Componentes Principais](#componentes-principais)
- [Diálogos (CRUD)](#diálogos-crud)
- [Paginação](#paginação)
- [Boas Práticas](#boas-práticas)
- [Próximos Passos](#próximos-passos)
- [Licença](#licença)

---

### Tecnologias
- Angular 20 (standalone components)
- Angular Material (MatDialog, FormField, Input, Select, Paginator, etc.)
- TypeScript
- SCSS

---

### Estrutura do Projeto

Baseado na estrutura mostrada (pode variar ligeiramente, pois posso ter atualizado rs):

```
src/
└── app/
    ├── components/
    │   ├── accounts-payable-dialog/
    │   │   ├── account-payable-dialog.component.html
    │   │   ├── account-payable-dialog.component.scss
    │   │   └── account-payable-dialog.component.ts
    │   ├── accounts-payable-list/
    │   │   ├── accounts-payable-list.component.html
    │   │   ├── accounts-payable-list.component.scss
    │   │   ├── accounts-payable-list.component.spec.ts
    │   │   └── accounts-payable-list.component.ts
    │   ├── bank-accounts-dialog/
    │   │   ├── bank-account-dialog.component.html
    │   │   ├── bank-account-dialog.component.scss
    │   │   └── bank-account-dialog.component.ts
    │   ├── bank-accounts-list/
    │   │   ├── bank-accounts-list.component.html
    │   │   ├── bank-accounts-list.component.scss
    │   │   ├── bank-accounts-list.component.spec.ts
    │   │   └── bank-accounts-list.component.ts
    │   ├── category-dialog/
    │   │   ├── category-dialog.component.html
    │   │   ├── category-dialog.component.scss
    │   │   └── category-dialog.component.ts
    │   ├── header/
    │   ├── main-container/
    │   ├── page-header/
    │   ├── search-bar/
    │   │   ├── search-bar.component.html
    │   │   ├── search-bar.component.scss
    │   │   ├── search-bar.component.spec.ts
    │   │   └── search-bar.component.ts
    │   ├── summary-card/
    │   └── summary-cards-container/
    │
    │   └── styles/
    │       ├── list.shared.scss
    │       └── dialog.shared.scss (se aplicável)
    │
    ├── interfaces/
    │   ├── AccountPayable.ts
    │   ├── AccountPayableFormData.ts
    │   ├── BankAccount.ts
    │   ├── BankAccountFormData.ts
    │   ├── BankAccountResponse.ts
    │   ├── Category.ts
    │   ├── CategoryFormData.ts
    │   ├── CategoryResponse.ts
    │   ├── PageResponse.ts
    │   └── SpringPageable.ts
    │
    ├── pages/
    │   ├── account-payable/
    │   │   ├── account-payable.component.html
    │   │   ├── account-payable.component.scss
    │   │   ├── account-payable.component.spec.ts
    │   │   └── account-payable.component.ts
    │   ├── bank-account/
    │   │   ├── bank-account.component.html
    │   │   ├── bank-account.component.scss
    │   │   ├── bank-account.component.spec.ts
    │   │   └── bank-account.component.ts
    │   ├── categories/
    │   │   ├── categories.component.html
    │   │   ├── categories.component.scss
    │   │   ├── categories.component.spec.ts
    │   │   └── categories.component.ts
    │   └── dashboard/
    │       ├── dashboard.component.html
    │       ├── dashboard.component.scss
    │       ├── dashboard.component.spec.ts
    │       └── dashboard.component.ts
    │
    └── services/
        ├── account-payable/
        │   ├── account-payable.service.spec.ts
        │   └── account-payable.service.ts
        ├── bank-account/
        │   ├── bank-account.service.spec.ts
        │   └── bank-account.service.ts
        ├── category/
        │   ├── category.service.spec.ts
        │   └── category.service.ts
        └── dialog.service.ts
```

- components: UI de apresentação e diálogos (standalone).
- pages: containers (regras de tela, integração com serviços, abertura de diálogos).
- services: camada de acesso a dados/HTTP e utilitários (dialog.service).
- interfaces: tipagens e contratos de API.
- styles: estilos compartilhados para listas e diálogos.

---

### Pré‑requisitos
- Node.js 18+
- Angular CLI 20+

---

### Instalação e Execução

1. Instale as dependências:
```
npm install
```

2. Rode o projeto:
```
npm start
```
Acesse em http://localhost:4200

3. Build de produção:
```
npm run build
```
Arquivos gerados em dist/

4. Lint (se configurado):
```
npm run lint
```

---

### Scripts
Adapte conforme seu package.json.
- start: ng serve
- build: ng build
- test: ng test
- lint: ng lint

---

### Padrões de Arquitetura

- Standalone Components (sem NgModule).
- Diretivas modernas: @if, @for (Angular 16+).
- Separação de responsabilidades:
  - Page/Container: orquestração, chamadas de serviço, estado, paginação e abertura de diálogos.
  - Components (listas, cartões, barra de busca): apresentação + @Input/@Output.
  - Dialogs: criação/edição com Reactive Forms e Angular Material.
- Tipagem forte em src/app/interfaces.

---

### Componentes Principais

- SearchBarComponent: busca, filtros e botão “Adicionar”.
- Lists:
  - CategoriesListComponent
  - BankAccountsListComponent
  - AccountsPayableListComponent
  - Estilos compartilhados: styles/list.shared.scss
  - Eventos emitidos: edit, toggle/toggleStatus, remove
- SummaryCardsContainerComponent e SummaryCardComponent: KPIs do dashboard.
- MainContainerComponent e PageHeaderComponent: layout.

---

### Diálogos (CRUD)

Padrão dos dialogs (Category/BankAccount/AccountPayable):
- Standalone + Reactive Forms.
- Recebem data via MAT_DIALOG_DATA:
  - mode: 'create' | 'edit'
  - value: dados iniciais (no modo edit).
- Retornam os valores no close:
  - this.ref.close(form.value).

Abertura padronizada via DialogService:
```ts
// Editar Categoria
const ref = this.dialogService.open(
  CategoryDialogComponent,
  {
    mode: 'edit',
    value: { name: category.name, description: category.description }
  },
  { width: '520px' } // opcional
);
ref.afterClosed().subscribe(formData => {
  if (!formData) return;
  this.updateCategory(category.id, formData);
});
```

Responsividade dos diálogos:
- Largura fluida: width: min(520px, 92vw)
- Paddings consistentes (título, conteúdo, actions)
- Scroll interno quando necessário
- Ajustes visuais em dialog.shared.scss (quando aplicável)

