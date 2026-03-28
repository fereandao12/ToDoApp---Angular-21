import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component/login.component';
import { TodoListComponent } from './features/todos/components/todo-list/todo-list.component/todo-list.component';
import { authGuardGuard } from './core/guards/auth.guard-guard';
import { TodoFormComponent } from './features/todos/components/todo-form/todo-form.component/todo-form.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'todos',
    component: TodoListComponent,
    canActivate: [authGuardGuard],
  },
  {
    path: 'todos',
    canActivate: [authGuardGuard],
    children: [
      {
        path: '',
        component: TodoListComponent,
      },
      {
        path: 'new',
        component: TodoFormComponent,
      },
      {
        path: 'edit/:id',
        component: TodoFormComponent,
      },
    ],
  },
  {
    path: 'todos/edit/:id',
    component: TodoFormComponent,
    canActivate: [authGuardGuard],
  },
  {
    path: '',
    redirectTo: 'todos',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'todos',
  },
];
