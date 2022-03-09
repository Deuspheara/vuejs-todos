
<script>


export default{

    props:{
        "todo" : Object
    },
    methods:{
        deleteTodo : function(){
            this.$emit("deleteTodo");
        },
        markComplete() {
          this.$emit("markComplete");
        }
    }
}


</script>

<template :key="todo.id">
          <li class="flex justify-between items-center mt-3" v-if="todo.title !== ''">
            <div class="flex items-center" :key="todo.isComplete" :class="{'line-through' : todo.isComplete}">
              <input type="checkbox" :checked="todo.isComplete" @change="markComplete()" >
              <div class="capitalize ml-3 text-sm font-semibold" >{{todo.title}}</div>
            </div>
            <div>
              <button>
                <svg class=" w-4 h-4 text-gray-600 fill-current" @click="deleteTodo()" 
                fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </li>
</template>