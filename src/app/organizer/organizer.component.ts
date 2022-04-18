import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Task } from '../model/task';
import { TasksService } from '../shared/tasks.service';
import { Observable, take } from 'rxjs';
import { v4 as uuidv4 } from  'uuid';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss'],
})
export class OrganizerComponent implements OnInit {
  constructor(private tasksService: TasksService) {}

  form!: FormGroup;
  tasks: Task[] = [];
  task : Task = new Task();
  taskList = new Observable<any>();

  public editingMode: boolean = false;

  addTaskValue : string = '';
  editTaskValue: string = '';

  ngOnInit() {
    this.loadPage();
  }

  loadPage() {
    this.taskList.subscribe(() => this.tasksService.load());
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
      isDone: false
    }
    this.tasksService.create(task).subscribe(task => {
      this.tasks.push(task);
      this.loadPage();
    }, err => {
      alert(err);
    })
  }

  editTask() {
    this.task.title = this.editTaskValue;
    this.tasksService.change(this.task).subscribe(task => {
      this.loadPage();
      take(1)
    }, err => {
      alert("Failed to update task");
    })
  }

  isDone(task: Task) {
    this.tasksService.change(task).subscribe(task => {
      this.loadPage();
    }, err => {
      alert("Failed to update task");
    })
  }

  remove(task: Task) {
    this.tasksService.remove(task).subscribe(task => {
      this.loadPage();
    }, err => {
      alert("Failed to delete task");
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
