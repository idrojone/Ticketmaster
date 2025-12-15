import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostGeneroAdmin } from 'src/app/core/models/dashboard-admin/GenerosAdmin.model';

@Component({
  selector: 'app-add-genero',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './add-genero.css',
  templateUrl: './add-genero.html'
})
export class AddGeneroComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  ngOnInit() {
    // Inicializar valores por defecto si es necesario
  }
}
