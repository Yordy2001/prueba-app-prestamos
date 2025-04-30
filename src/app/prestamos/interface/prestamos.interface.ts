export interface Prestamo {
    id: string;
    solicitante: string;
    cantidad: number;
    detalles: string;
    fecha: string;
    estado: 'pendiente' | 'aprobado' | 'rechazado';
}