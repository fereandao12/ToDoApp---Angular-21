export interface ToDoItem {
  id: number;
  title: string;
  description?: string;
  status: string;
  createdAt: Date;
}

export interface ToDoItemCreate {
  title: string;
  description?: string;
}

export interface ToDoItemUpdate {
  title: string;
  description?: string;
  statusId: number;
}
