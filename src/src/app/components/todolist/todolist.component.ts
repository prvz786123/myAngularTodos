import { Component, OnInit } from '@angular/core';
import { HttpClient, } from '@angular/common/http';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {

  todolist;
  showAddTaskForm;
  addFormButtonValue;
  showEditFormFlag;
  completedTaskCount=0;
  incompleteTaskCount=0;
  totalTaskCount=0;
  statusButtonValue;
  

  constructor(public httpClient:HttpClient) {
    this.showEditFormFlag=false;
    this.showAddTaskForm=false;
    this.addFormButtonValue="Add Task";    
    httpClient.get('https://springgreengrandprogrammingtool--five-nine.repl.co/todos').subscribe((res)=>{
      this.todolist=res;      
      this.getCompletedCount();
    })

       
   }

  ngOnInit() {

  }

  getTodolist(){
    this.httpClient.get   ('https://springgreengrandprogrammingtool--five-nine.repl.co/todos').subscribe((res)=>{
      this.todolist=res;      
      this.getCompletedCount();      
    })
  }
  
  getCompletedCount(){
    this.completedTaskCount=0;
    this.todolist.forEach((todo)=>{
      if(todo.completed){
        this.completedTaskCount++;
      }
    })  
    this.totalTaskCount=this.todolist.length;
    this.incompleteTaskCount=this.totalTaskCount-this.completedTaskCount;
  }

  toggleAddForm(){
    if(this.showAddTaskForm){
      this.addFormButtonValue="Add Form"
      this.showAddTaskForm=!this.showAddTaskForm;
    } else{
      this.addFormButtonValue="Hide"
      this.showAddTaskForm=!this.showAddTaskForm;
    }    
  }

  setError(msg){    
    let errorDiv=document.querySelector('#addTaskErrorDiv')
    if(errorDiv.className=="alert alert-danger text-center"){
    }
    else{
        errorDiv.innerHTML=`${msg}`
       errorDiv.className="alert alert-danger text-center";
       
       setTimeout(()=>{         
         errorDiv.className="";
         errorDiv.textContent="";            
       },2500)
    }
    
  }

  saveToDatabase(todolist){
    this.httpClient.post('https://springgreengrandprogrammingtool--five-nine.repl.co/todos',todolist).subscribe();
  }

  addTask(title,body){   
    if(title.value=="" || title.value==undefined){
           title.focus();
           this.setError("Please enter proper details");       
    } else if(body.value==""||body.value==undefined){
          body.focus();
          this.setError("Please enter proper details");
    } else{
          let isDuplicate=false;
          for(let i=0;i<this.todolist.length;i++){
            if(this.todolist[i].title==title.value){
              this.setError("Task Already Exist")
              isDuplicate=true;            
            }
          }
          if(!isDuplicate){
            let newTask={
            title:title.value,
            body:body.value,
            completed:false,
            completedClass:'Incomplete'
            }
            this.todolist.unshift(newTask);
            this.httpClient.post('https://springgreengrandprogrammingtool--five-nine.repl.co/todos',newTask).subscribe((res)=>{
              
            })

            this.toggleAddForm();
            title.value="";
            body.value="";
        }     
    }
    this.getCompletedCount();
  }

  deleteTask(task){
    let idx=this.todolist.indexOf(task);
    this.todolist.splice(idx,1);
    this.getCompletedCount()
    this.httpClient.delete(`https://springgreengrandprogrammingtool--five-nine.repl.co/todos/${task._id}`,{responseType: 'text'}).subscribe(()=>console.log("deleted"))
  }

  changeStatus(task){   
    let id=task._id;
   
    if(task.completed==false){
      task.completedClass="Complete";      
      
      task.completed=true;
    } else{
      
      task.completedClass="Incomplete";
       
      task.completed=false;
    }
    this.getCompletedCount();
    this.httpClient.patch(`https://springgreengrandprogrammingtool--five-nine.repl.co/todos/${task._id}`,task,{responseType: 'text'}).subscribe((result)=>{
      console.log(result);
    })
  }
 

  showEditForm(task){      
      if(task.showEditFormFlag==undefined){
        task.showEditFormFlag=true;
      }else{
        task.showEditFormFlag=undefined;
      }       
  }

  saveEdit(task){
    delete task.showEditFormFlag;
    let dupFlag=true;
   if(task.title==undefined||task.title==""){
    
     dupFlag=false;
    this.getTodolist();

    return alert('Invalid Details');
   } else{
     let idx=this.todolist.indexOf(task);   
   for(let i=0;i<this.todolist.length;i++){
     if(task.title==this.todolist[i].title && i!=idx){
        dupFlag=false;
        this.getTodolist();
        return alert('Task Already Exist')        
   }
   }
   }
   if(dupFlag){
      this.httpClient.patch(`https://springgreengrandprogrammingtool--five-nine.repl.co/todos/${task._id}`,task,{responseType:'text'}).subscribe((result)=>{
        console.log(result);
      })      
   }   
  }
}   