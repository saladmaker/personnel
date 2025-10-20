//src/component/profile/profile.component.ts
import { Component, inject } from "@angular/core";
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, CardModule, TagModule],
    templateUrl: './profile.component.html',
})
export class ProfileComponent {
    private authService = inject(AuthService);
}