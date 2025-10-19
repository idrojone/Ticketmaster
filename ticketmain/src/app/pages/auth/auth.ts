import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZardButtonComponent } from '../../shared/components/button/button.component';
import { ZardInputDirective } from '../../shared/components/input/input.directive';
import { UserService } from '../../core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, ReactiveFormsModule, ZardButtonComponent, ZardInputDirective],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth implements OnInit {
  modoLogin = true;
  authForm!: FormGroup;
  enviando = false;
  errors: any = {};
  returnUrl: string = '/';
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  ngOnInit() {
    this.modoLogin = this.router.url.includes('/login');
    // Capturar el parámetro returnUrl si existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.buildForm();
  }

  buildForm() {
    if (this.modoLogin) {
      // este es el login
      this.authForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(4)]]
      });
    } else {
      // este es el registre
      this.authForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', [Validators.required]]
      });
    }
  }

  cambiarModo() {
    if (this.modoLogin) {
      this.router.navigate(['/auth/register']);
    } else {
      this.router.navigate(['/auth/login']);
    }
    this.modoLogin = !this.modoLogin;
    this.buildForm();
    this.errors = {};
  }

  onSubmit() {
    if (this.authForm.invalid) {
      this.revisarCampos();
      return;
    }

    // Validar confirmación de contraseña en registro
    if (!this.modoLogin && this.authForm.value.password !== this.authForm.value.confirmPassword) {
      this.errors = { confirmPassword: 'Las contraseñas no coinciden' };
      return;
    }

    this.enviando = true;
    this.errors = {};

    const credentials = this.prepararCredenciales();
    const authType = this.modoLogin ? 'login' : 'register';
    
    console.log(`Enviando ${authType}:`, credentials);

    this.userService.attemptAuth(authType, credentials).subscribe({
      next: (response) => {
        console.log(`${authType} exitoso:`, response);
        this.enviando = false;
        
        // Redirigir al usuario después del login/registro exitoso
        // Si hay returnUrl, usar esa; si no, ir a home
        this.router.navigateByUrl(this.returnUrl);
        
        // Mostrar mensaje de éxito con SweetAlert2
        Swal.fire({
          icon: 'success',
          title: this.modoLogin ? '¡Login exitoso!' : '¡Registro exitoso!',
          text: `Bienvenido${this.modoLogin ? '' : ', tu cuenta ha sido creada correctamente.'}`,
          confirmButtonText: 'Continuar'
        });

      },
      error: (error) => {
        console.error(`Error en ${authType}:`, error);
        this.enviando = false;
        this.errors = {general: error.message || 'Error desconocido'};
      }
    });
  }

  private prepararCredenciales() {
    const formValue = this.authForm.value;
    
    if (this.modoLogin) {
      // Para login: solo email y password
      return {
        email: formValue.email,
        password: formValue.password
      };
    } else {
      // Para registro: username, email y password
      return {
        username: formValue.username,
        email: formValue.email,
        password: formValue.password
      };
    }
  }

  private revisarCampos() {
    Object.keys(this.authForm.controls).forEach(key => {
      const control = this.authForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para acceder fácilmente a los campos en el template
  get email() { return this.authForm.get('email'); }
  get password() { return this.authForm.get('password'); }
  get username() { return this.authForm.get('username'); }
  get confirmPassword() { return this.authForm.get('confirmPassword'); }

  // Métodos de utilidad para validaciones validar
  isFieldInvalid(fieldName: string): boolean {
    const field = this.authForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.authForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }
    
    // Verificar errores específicos del servidor
    if (this.errors[fieldName]) {
      return this.errors[fieldName];
    }
    
    return '';
  }

  // Método para verificar si hay errores generales
  hasGeneralError(): boolean {
    return !!(this.errors.general || this.errors.message);
  }

  // Método para obtener el mensaje de error general
  getGeneralError(): string {
    return this.errors.general || this.errors.message || '';
  }
}
