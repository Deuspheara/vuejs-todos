
<script>
import taskComponent from './components/taskComponent.vue'
import errorComponent from './components/errorComponent.vue'

import 'tw-elements';
import axios from 'axios';

export default {

  name: 'nom',

  components: {
    'task': taskComponent,
    'error' : errorComponent
  },

  data: () => ({ info: '', 
        todos: [
          
          ], 
          todoId: 0, 
          buttonType: 'submit',
          todoTitle :"",
          showError : false,
          errorMessage : ""
  }),
  // Données calculées
  computed:{
     nbTodo(){
      let cpt = 0
      this.todos.forEach(key => {
        if(key.isComplete)
          cpt++
      })
       return cpt
    },
    todoPourcent :function(){
      if(this.todoId != 0){
        
       
        return (100*this.nbTodo)/this.todoId
      }
      else
        return 0
    },
  },
  methods:{
    
    addTodo() {
        if (this.todoTitle.trim() === "") {
          this.activeError("Rentrer un nom de tâche")
          return;
        }


        axios.post('http://127.0.0.1:3000/tasks', { name : this.todoTitle }).then(response => {
        // Si la requête réussi
        this.todos.push({
          id: this.todoId,
          title: this.todoTitle,
          isComplete: false
        });

        this.todoId++;
        this.todoTitle = "";
        


      }).catch(err => {
        this.activeError("Erreur impossible d'ajouter la tâche :(")
        console.log(err)
    })
      
      
    },
    activeError(message){
      this.showError = true
      this.errorMessage = message
    },
    deleteTodo : function(id) {
       
        axios.put('http://127.0.0.1:3000/tasks', { id : id, delete : id }).then(response => {
        // Si la requête réussi
          this.todos = this.todos.filter((todo) => id !== todo.id);
          this.todoId = this.todos.length



      }).catch(err => {
        this.activeError("Erreur impossible de supprimer la tâche")
        console.log(err)
    })
    }, 
    closeError(){
        this.showError = false
    },
    markComplete: function(todo){
        axios.put('http://127.0.0.1:3000/tasks', { id : todo.id, newState : !todo.isComplete}).then(response => {
        // Si la requête réussi
         todo.isComplete = !todo.isComplete;
        console.log('mark');
      }).catch(err => {
        this.activeError("Erreur impossible de cocher la tâche")
        console.log(err)
    })
    
    },
  },
  mounted(){
    //get all todos
    axios.get('http://127.0.0.1:3000/tasks').then(response => {
        // Si la requête réussi
        response.data.forEach((element) => {
          this.todos.push({
            id : element.id,
            title : element.name,
            isComplete : element.state

          })
       })
      }).catch(err => {
        this.activeError("Connexion impossible")
    })

    //get number of todos
    axios.get('http://127.0.0.1:3000/tasks/stats').then(response => {
        // Si la requête réussi
        console.log(response.data)
        this.todoId = response.data.nbTasks
       
      }).catch(err => {
        this.activeError("Connexion impossible")
    })

  },
}
</script>

<template>
  <div class="max-w-sm rounded overflow-hidden shadow-lg m-10 p-5">
    <h1 class="my-5 flex space-x-2 justify-center text-xl">Tâches</h1>
  <div>
  </div>
    <input class="    
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
      v-model="todoTitle" @keyup.enter="addTodo()" placeholder="Information"/>

    <button :type="buttonType" data-mdb-ripple="true" data-mdb-ripple-color="light"
    class="my-5 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
     @click="addTodo()">Ajouter une tâche</button>

    <div v-for="todo in todos" :key="todo.id">
      <task :todo="todo" @markComplete="markComplete(todo)" @deleteTodo="deleteTodo(todo.id)" ></task>
     
    </div>
    <div class="w-full bg-gray-200 h-1">
      <div class="bg-blue-600 h-1" :style="{ width: todoPourcent + '%' }"></div>
    </div>
    
    <div>
      <p class="text-center my-5">{{nbTodo}}/{{todoId}}</p>
    </div>
    <error v-if="this.showError" @closeError="closeError()" titleError="info" :content="this.errorMessage"> </error>
  </div>
</template>

