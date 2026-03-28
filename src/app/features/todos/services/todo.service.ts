import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ToDoItem, ToDoItemCreate, ToDoItemUpdate } from '../../../core/models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5125/api/todos';

  todos = signal<ToDoItem[]>([]);

  //METODOS HTTP

  loadTodos() {
    this.http.get<ToDoItem[]>(this.apiUrl).subscribe((data) => this.todos.set(data));
  }

  create(todo: ToDoItemCreate) {
    return this.http.post<ToDoItem>(this.apiUrl, todo);
  }

  update(id: number, todo: ToDoItemUpdate) {
    return this.http.put(`${this.apiUrl}/${id}`, todo);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getById(id: number) {
    return this.http.get<ToDoItem>(`${this.apiUrl}/${id}`);
  }
}
