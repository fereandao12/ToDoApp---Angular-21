import { Component, inject } from '@angular/core';
import { TodoService } from '../../../services/todo.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-todo-list.component',
  imports: [RouterLink, NgClass],
  templateUrl: './todo-list.component.html',
  styles: ``,
})
export class TodoListComponent {
  //Inyeccion servicios
  todoService = inject(TodoService);
  private authService = inject(AuthService);
  private router = inject(Router);

  //
  statusColors: Record<string, string> = {
    Pendiente: 'bg-yellow-100 text-yellow-800',
    EnProceso: 'bg-blue-100 text-blue-800',
    Realizado: 'bg-green-100 text-green-800',
    Cancelado: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800', // Color por defecto
  };

  getStatusClasses(status: string): string {
    const statusKey = status;
    return this.statusColors[statusKey] || this.statusColors['default'];
  }

  //Se ejecuta al iniciar el componente en la pantalla
  ngOnInit() {
    //Dispara la peticion get hacia el backend
    this.todoService.loadTodos();
  }

  onDelete(id: number) {
    //Confirmamos la eliminacion
    if (confirm('¿Eliminar esta tarea?')) {
      this.todoService.delete(id).subscribe({
        next: () => this.todoService.loadTodos(),
        error: (err) => console.error('Error al eliminar', err),
      });
    }
  }

  onLogout() {
    this.authService.logout(); //Borra el token
    this.router.navigate(['/login']); //Expulsa al usuario al login
  }
}
