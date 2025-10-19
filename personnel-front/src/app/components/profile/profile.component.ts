//src/component/profile/profile.component.ts
import { Component } from "@angular/core";
import { MenuComponent } from "./menu/menu.component";

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    imports: [MenuComponent]
})
export class ProfileComponent{

}