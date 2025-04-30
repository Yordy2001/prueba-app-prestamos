import { Injectable } from '@angular/core';

export interface SolicitudPrestamo {
  id: number;
  solicitante: string;
  cantidad: number;
  detalles: string;
  fecha: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
}

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private localStorageKey = 'solicitudes';

  constructor() {}

  getSolicitudes(): SolicitudPrestamo[] {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }

  agregarSolicitud(solicitud: Omit<SolicitudPrestamo, 'id' | 'fecha' | 'estado'>): void {
    const solicitudes = this.getSolicitudes();
    const nueva: SolicitudPrestamo = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      estado: 'pendiente',
      ...solicitud
    };
    solicitudes.push(nueva);
    localStorage.setItem(this.localStorageKey, JSON.stringify(solicitudes));
  }

  filtrarPorUsuario(nombre: string): SolicitudPrestamo[] {
    return this.getSolicitudes().filter(s => s.solicitante === nombre);
  }

  cambiarEstado(id: number, nuevoEstado: 'aprobado' | 'rechazado'): void {
    const solicitudes = this.getSolicitudes();
    const solicitud = solicitudes.find(s => s.id === id);
    if (solicitud) {
      solicitud.estado = nuevoEstado;
      localStorage.setItem(this.localStorageKey, JSON.stringify(solicitudes));
    }
  }

  limpiarSolicitudes(): void {
    localStorage.removeItem(this.localStorageKey);
  }
}
