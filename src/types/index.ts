// Tipos basados en tu backend
export interface Usuario {
  id_usuario?: number;
  user_usuario: string;
  contraseña: string;
  email_usuario: string;
  tel_usuario: number;
  direccion_usuario: string;
  nombre_usuario: string;
  apellido_usuario: string;
  tipo_usuario: number;
}

export interface TipoProducto {
  id?: number;
  nombre_tipo: string;
  desc_tipo?: string;
}

export interface Producto {
  idproducto?: number;
  nombre_prod: string;
  precio: number;
  desc_prod?: string;
  cant_stock?: number;
  imagen?: string;
  id_tipoprod?: number;
  activo?: boolean;
}

export interface LoginRequest {
  user_usuario: string;
  contraseña: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}