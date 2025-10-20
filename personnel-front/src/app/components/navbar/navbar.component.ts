import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, MenuModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  items: MenuItem[] = [];

  constructor(public auth: AuthService) {
    this.items = [
      { label: 'Profile', icon: 'pi pi-user', routerLink: '/profile' },
      { label: 'Change Password', icon: 'pi pi-key', routerLink: '/change-password' },
      { separator: true },
      { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.auth.logout() }
    ];
  }
}
