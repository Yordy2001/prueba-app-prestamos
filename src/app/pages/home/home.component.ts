import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PrestamoService, SolicitudPrestamo } from '../../prestamos/prestamo.service';
import { AuthService } from '../login/login.service';
import { User } from '../login/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule],
})
export class HomeComponent implements OnInit {
  @ViewChild('loanDialog', { static: true }) loanDialog!: TemplateRef<any>;
  formularioPrestamo!: FormGroup;
  currentUser: User | null = null;
  solicitudes: SolicitudPrestamo[] = [];
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private prestamoService: PrestamoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.isAdmin = this.currentUser?.role === 'admin';
    this.loadForm();
    this.loadSolicitudes();
  }

  loadForm(): void {
    this.formularioPrestamo = this.fb.group({
      solicitante: [this.currentUser?.email, Validators.required],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      detalles: ['']
    });
  }
  checlIsAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
  openLoanModal(): void {
    this.dialog.open(this.loanDialog, {
      width: '400px'
    });
  }

  submit() {
    if (this.formularioPrestamo.valid && this.currentUser) {
      const data = this.formularioPrestamo.value;
  
      this.prestamoService.agregarSolicitud({
        solicitante: this.currentUser.email,
        cantidad: data.cantidad,
        detalles: data.detalles
      });
  
      this.solicitudes = this.isAdmin
        ? this.prestamoService.getSolicitudes()
        : this.prestamoService.filtrarPorUsuario(this.currentUser.email);
  
      this.dialog.closeAll();
      this.formularioPrestamo.reset();
    } else {
      this.formularioPrestamo.markAllAsTouched();
    }
  }

  cancel(): void {
    this.dialog.closeAll();
    this.formularioPrestamo.reset();
  }

  loadSolicitudes(): void {
    if (this.isAdmin) {
      this.solicitudes = this.prestamoService.getSolicitudes();
    } else if (this.currentUser?.email) {
      this.solicitudes = this.prestamoService.filtrarPorUsuario(this.currentUser.email);
    }
  }

  cambiarEstado(id: number, nuevoEstado: 'aprobado' | 'rechazado'): void {
    this.prestamoService.cambiarEstado(id, nuevoEstado);
    this.loadSolicitudes();
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
