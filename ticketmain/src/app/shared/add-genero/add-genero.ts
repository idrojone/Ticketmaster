import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostGeneroAdmin } from 'src/app/core/models/dashboard-admin/GenerosAdmin.model';


@Component({
  selector: 'app-add-genero',
  templateUrl: './add-genero.html',
  styleUrls: ['./add-genero.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddGenero implements OnInit {

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    img: new FormControl('', Validators.required)
  });

  ngOnInit() {
    // Inicializar valores por defecto si es necesario
  }
}
