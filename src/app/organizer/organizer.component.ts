import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Task } from '../model/task';
import { TasksService } from '../shared/tasks.service';
import { catchError, Observable, take, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss'],
})
export class OrganizerComponent implements OnInit {
  constructor(private tasksService: TasksService) {}

  form!: FormGroup;
  tasks: Task[] = [];
  task: Task = new Task();

  editingMode: boolean = false;

  addTaskValue: string = '';
  editTaskValue: string = '';

  ngOnInit() {
    this.loadPage();
  }

  private loadPage() {
    this.tasksService
      .load()
      .pipe(take(1))
      .subscribe((tasks) => (this.tasks = tasks));
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
    });
    this.editTaskValue = '';
    this.addTaskValue = '';
    this.task = new Task();
    this.editingMode = false;
  }

  addTask() {
    const task: Task = {
      id: uuidv4(),
      title: this.addTaskValue,
      isDone: false,
    };
    this.tasksService
      .create(task)
      .pipe(
        take(1),
        catchError((err) => {
          alert('Failed to add a task');
          return throwError(err);
        })
      )
      .subscribe(() => {
        this.loadPage();
      });
  }

  editTask() {
    this.task.title = this.editTaskValue;
    this.tasksService
      .change(this.task)
      .pipe(
        take(1),
        catchError((err) => {
          alert('Failed to update task');
          return throwError(err);
        })
      )
      .subscribe(() => {
        this.loadPage();
      });
  }

  isDone(task: Task) {
    this.tasksService
      .change(task)
      .pipe(
        take(1),
        catchError((err) => {
          alert('Failed to update task');
          return throwError(err);
        })
      )
      .subscribe(() => {
        this.loadPage();
      });
  }

  remove(task: Task) {
    this.tasksService
      .remove(task)
      .pipe(
        take(1),
        catchError((err) => {
          alert('Failed to delete task');
          return throwError(err);
        })
      )
      .subscribe(() => {
        this.loadPage();
      });
  }

  call(task: Task) {
    this.editingMode = true;
    this.task = task;
    this.editTaskValue = task.title;
  }

  closeEditing() {
    this.editingMode = false;
    this.editTaskValue = '';
  }
}
