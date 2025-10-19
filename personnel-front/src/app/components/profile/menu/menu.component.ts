import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, MenuModule, ButtonModule],
    templateUrl: './menu.component.html'
})
export class MenuComponent {
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
        // TODO: implement password change navigation
        console.log('Naviguer vers changement de mot de passe');
    }


    onLogout() {
        // TODO: implement logout logic
        console.log('Déconnexion');
    }

}