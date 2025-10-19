//component/profile/menu/menu.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, MenuModule, ButtonModule],
    templateUrl: './menu.component.html'
})
export class MenuComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    items: MenuItem[] = [
        {
            label: 'Changer le mot de passe',
            icon: 'pi pi-lock',
            command: () => this.onChangePassword(),
        },
        {
            label: 'Se déconnecter',
            icon: 'pi pi-sign-out',
            command: () => this.onLogout(),
        },
    ];


    onChangePassword() {
        this.router.navigate(['/change-password']);
    }


    onLogout() {
        this.authService.logout();
    }

}