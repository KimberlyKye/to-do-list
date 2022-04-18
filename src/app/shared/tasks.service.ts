import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Task } from 'src/app/model/task';

@Injectable({ providedIn: 'root' })
export class TasksService {
  static url =
    'https://angular-practice-calender-default-rtdb.firebaseio.com/tasks';

  constructor(private http: HttpClient) {}

  load(): Observable<Task[]> {
    return this.http.get<Task[]>(`${TasksService.url}/tasks.json`).pipe(
      map((tasks) => {
        if (!tasks) {
          return [];
        }
        return Object.keys(tasks).map((key: any) => ({
          ...tasks[key],
          id: key,
        }));
      })
    );
  }

  create(task: Task): Observable<Task> {
    return this.http.post<Task>(`${TasksService.url}/tasks.json`, task);
  }

  change(task: Task): Observable<Task> {
    return this.http.put<Task>(
      `${TasksService.url}/tasks/${task.id}.json`,
      task
    );
  }

  remove(task: Task): Observable<void> {
    return this.http.delete<void>(`${TasksService.url}/tasks/${task.id}.json`);
  }
}
