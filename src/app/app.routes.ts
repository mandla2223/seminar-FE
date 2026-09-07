import { Routes } from '@angular/router';

import { SeminarFormComponent } from './pages/public/seminar-form/seminar-form.component';

import { AdminLoginComponent } from './pages/admin/admin-login/admin-login.component';

import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    component: SeminarFormComponent
  },

  {
    path: 'admin/login',
    component: AdminLoginComponent
  },

  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [
      authGuard
    ]
  },

  {
    path: '**',
    redirectTo: ''
  }

];