import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { groupGuard } from './guards/auth-group.guard';
import { MainLayoutComponent } from './main-layout.component';
import { UserCreateComponent } from './components/users/user-create.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: MainLayoutComponent, // layout wrapper with navbar
    canActivate: [groupGuard],
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        data: { groups: ['user'] }
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        data: { groups: ['user'] }
      },
      {
        path: 'create-user',
        component: UserCreateComponent,
        data: { groups: ['admin'] }
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
