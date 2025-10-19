import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { groupGuard } from './guards/auth-group.guard';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

export const routes: Routes = [
    {

        path: '',
        component: LoginComponent
    },
    {

        path: 'login',
        component: LoginComponent
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [groupGuard],
        data: {groups: ['user']}
    },
    {
        path: 'change-password',
        component: ChangePasswordComponent,
        canActivate: [groupGuard],
        data: {groups: ['user']}
    }
];
