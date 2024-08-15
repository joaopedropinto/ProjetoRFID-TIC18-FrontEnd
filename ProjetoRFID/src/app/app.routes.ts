import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductRegisterComponent } from './pages/product-register/product-register.component';
import { ProductsReadComponent} from './pages/products-read/products-read.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'produtos/cadastrar', component: ProductRegisterComponent },
    { path: 'produtos', component: ProductListComponent},
    { path: 'leituras/realizar', component: ProductsReadComponent}
];
