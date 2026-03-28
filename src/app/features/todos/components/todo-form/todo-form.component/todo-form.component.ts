import { Component, inject, signal, OnInit, Signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../../services/todo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToDoItemUpdate, ToDoItemCreate } from '../../../../../core/models/todo.model';

@Component({
  selector: 'app-todo-form.component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styles: ``,
})
export class TodoFormComponent {
  //Inyeccion de las dependencias
  private fb = inject(FormBuilder);
  private todoService = inject(TodoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  //Estados
  isEditMode = signal(false);
  isLoading = signal(false);
  currentTodoId = signal<number | null>(null);

  //Formulario
  todoForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    statusId: [1],
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      //Si hay id, estamos en modo edicion
      this.isEditMode.set(true);
      const id = Number(idParam);
      this.currentTodoId.set(id);
      //Bloqueamos la ui mientras cargamos datos de la API
      this.isLoading.set(true);

      //Consumimos el endpoint GET de la api
      this.todoService.getById(id).subscribe({
        next: (todo) => {
          //Mapeo de el string  del enum de vuelta a su valor original
          const statusMap: Record<string, number> = {
            Pendiente: 1,
            EnProceso: 2,
            Realizado: 3,
            Cancelado: 4,
          };
          //Llenamos el form con los datos recibidos del backend
          this.todoForm.patchValue({
            title: todo.title,
            description: todo.description || '',
            statusId: statusMap[todo.status] || 1,
          });

          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar la tarea', err);
          this.isLoading.set(false);
          this.router.navigate(['/todos']); //Si no es su id o no existe lo expulsamos a la lista
        },
      });
    }
  }

  onSubmit() {
    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched(); //Fuerza mostrar los errores visuales
      return;
    }

    this.isLoading.set(true);
    const formValues = this.todoForm.getRawValue();

    if (this.isEditMode() && this.currentTodoId() !== null) {
      //FLUJO PUT
      //Preparamos el DTO que espera la peticion HttpPut
      const updateDto: ToDoItemUpdate = {
        title: formValues.title,
        description: formValues.description,
        statusId: Number(formValues.statusId),
      };

      this.todoService.update(this.currentTodoId()!, updateDto).subscribe({
        next: () => this.onSuccess(),
        error: (err) => this.onError(err),
      });
    } else {
      //FLUJO POST
      //Preparamos el dto que espera la peticion HttpPost
      const createDto: ToDoItemCreate = {
        title: formValues.title,
        description: formValues.description,
      };
      this.todoService.create(createDto).subscribe({
        next: () => this.onSuccess(),
        error: (err) => this.onError(err),
      });
    }
  }
  //Metodos axuiliares
  private onSuccess() {
    this.isLoading.set(false);
    this.router.navigate(['/todos']); //Regresa al listado
  }

  private onError(err: any) {
    this.isLoading.set(false);
    console.error('Ocurrio un error al guardar', err);
    console.error('Detalle del error del backend:', err.error);
    alert('No se pudo guardar la tarea. Revisa la conexion al servidor');
  }

  onCancel() {
    this.router.navigate(['/todos']);
  }
}
