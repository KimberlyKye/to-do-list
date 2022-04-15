import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Task } from '../model/task';
import { TasksService } from '../shared/tasks.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss'],
})
export class OrganizerComponent implements OnInit {
  constructor(private tasksService: TasksService) {}

  form!: FormGroup;
  tasks: Task[] = [];
  taskObj : Task = new Task();
  taskList = new Observable<any>();

  public editingMode: boolean = false;

  addTaskValue : string = '';
  editTaskValue: string = '';

  ngOnInit() {
    this.taskList
      .pipe(() => this.tasksService.load())
      .subscribe((tasks) => {
        this.tasks = tasks;
      });

    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
    });
    this.editTaskValue = '';
    this.addTaskValue = '';
    this.taskObj = new Task();
    this.tasks = [];
    this.editingMode = false;

  }

  addTask() {
    this.taskObj.title = this.addTaskValue;
    this.tasksService.create(this.taskObj).subscribe(res => {
      this.ngOnInit();
      this.addTaskValue = '';
    }, err => {
      alert(err);
    })
      console.log(this.addTaskValue);
  }

  editTask() {
    this.taskObj.title = this.editTaskValue;
    this.tasksService.change(this.taskObj).subscribe(res => {
      this.ngOnInit();
    }, err=> {
      alert("Failed to update task");
    })
  }

  isDone(task: Task) {
    this.tasksService.change(task).subscribe(res => {
      this.ngOnInit();
    }, err=> {
      alert("Failed to update task");
    })
  }

  remove(task: Task) {
    this.tasksService.remove(task).subscribe(res => {
      this.ngOnInit();
    }, err=> {
      alert("Failed to delete task");
    });
  }

  call(task: Task) {
    this.editingMode = true;
    this.taskObj = task;
    this.editTaskValue = task.title;
  }

  closeEditing() {
    this.editingMode = false;
    this.editTaskValue = '';
  }
}
