import { Routes } from '@angular/router';
import { LoginComponent } from '../app/pages/login/login.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },
    {
        path: 'login',
        component: LoginComponent,
        // component: () => import('../app/pages/login/login.component').then(m => m.LoginComponent),
    }
];
