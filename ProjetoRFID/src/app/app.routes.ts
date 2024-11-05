import { ProductEditingComponent } from './pages/product-editing/product-editing.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductRegisterComponent } from './pages/product-register/product-register.component';
import { ProductsReadComponent} from './pages/products-read/products-read.component';
import { Routes } from '@angular/router';
import { ReadingHistoryComponent } from './pages/reading-history/reading-history.component';
import { ReadoutDetailsComponent } from './pages/readout-details/readout-details.component';
import { PackagingRegisterComponent } from './pages/packaging-register/packaging-register.component';

export const routes: Routes = [
    { path: '', redirectTo: 'produtos', pathMatch: 'full' },
    { path: 'produtos/cadastrar', component: ProductRegisterComponent },
    { path: 'produtos', component: ProductListComponent},
    { path: 'produto/editar/:id', component: ProductEditingComponent },
    { path: 'leituras/realizar', component: ProductsReadComponent},
    { path: 'leituras/historico', component: ReadingHistoryComponent },
    { path: 'leituras/historico/:id', component: ReadoutDetailsComponent },
    { path: 'embalagens/cadastrar', component: PackagingRegisterComponent },
   
];
