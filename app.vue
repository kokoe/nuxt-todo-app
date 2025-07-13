<script setup lang="ts">
import type { Todo } from "./types";

const userName = ref("Vue Fes Tokyo");

const todos = ref<Todo[]>([
  {
    id: 1,
    done: true,
    title: "Buy groceries",
    note: "Buy groceries for the week",
    dueDate: "2025-07-15",
  },
  {
    id: 2,
    done: false,
    title: "Buy groceries",
    note: "Buy groceries for the week",
    dueDate: "2025-07-15",
  },
]);

// 一括操作
const checkedTaskIds = ref<number[]>([]);

const checkedTaskCount = computed(() => {
  return checkedTaskIds.value.length;
});

const allChecked = computed(() => {
  return checkedTaskCount.value === todos.value.length;
});

const isCreateDialogOpen = ref(false);

function resetCheckedTaskIds() {
  checkedTaskIds.value = [];
}

function handleAllCheckedChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.checked) {
    checkedTaskIds.value = todos.value.map((todo) => todo.id);
  } else {
    resetCheckedTaskIds();
  }
}

function bulkUpdateIsDone(taskIds: number[], isDone: boolean) {
  return todos.value.map((todo) => {
    return {
      ...todo,
      done: taskIds.includes(todo.id) ? isDone : todo.done,
    };
  });
}

function handleCheckedComplete() {
  todos.value = bulkUpdateIsDone(checkedTaskIds.value, true);
  resetCheckedTaskIds();
}

function handleCheckedIncomplete() {
  todos.value = bulkUpdateIsDone(checkedTaskIds.value, false);
  resetCheckedTaskIds();
}
</script>

<template>
  <UApp>
    <UContainer class="pt-4 pb-10 flex flex-col gap-10 min-h-screen">
      <header class="flex gap-1 items-end flex-wrap">
        <div class="flex-grow">
          <h1 class="text-2xl font-bold">Nuxt TODO Application</h1>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="i-heroicons-user" />
          <span class="text-sm">{{ userName }}</span>
        </div>
      </header>

      <main class="flex-grow flex flex-col gap-2">
        <div class="flex gap-2">
          <div class="flex-grow">絞り込み処理</div>
          <button
            type="button"
            class="bg-primary text-white dark:text-black px-4 py-1.5 rounded-md text-sm hover:bg-primary-600"
            aria-haspopup="dialog"
            aria-expanded="false"
            @click="isCreateDialogOpen = true"
          >
            新規作成
          </button>
        </div>

        <table class="todo-table">
          <thead>
            <tr>
              <th class="w-0 text-center">
                <input
                  v-model="allChecked"
                  type="checkbox"
                  @change="handleAllCheckedChange"
                />
              </th>
              <th class="w-16 text-center">完了</th>
              <th>タイトル</th>
              <th>期限</th>
              <th aria-label="操作">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="todo in todos" :key="todo.id">
              <td class="leading-none text-center">
                <input
                  v-model="checkedTaskIds"
                  type="checkbox"
                  :value="todo.id"
                />
              </td>
              <td class="leading-none text-center">
                <button
                  type="button"
                  class="hover:opacity-70"
                  :aria-label="todo.done ? '未完了にする' : '完了にする'"
                  @click="todo.done = !todo.done"
                >
                  <UIcon
                    name="i-heroicons-check-circle"
                    class="text-xl align-middle"
                    :class="{
                      'text-green-500': todo.done,
                      'opacity-30': !todo.done,
                    }"
                    aria-hidden="true"
                  />
                </button>
              </td>
              <td>{{ todo.title }}</td>
              <td>{{ todo.dueDate }}</td>
              <td>
                <button type="button" />
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="checkedTaskCount > 0"
          class="fixed bottom-0 inset-x-0 px-6 pt-6 pb-10 border-t bg-white border-t-gray-200 dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="flex gap-y-2 gap-x-6 items-center justify-center">
            <p>選択した{{ checkedTaskCount }}件のタスクを</p>
            <ul class="flex gap-y-2 gap-x-4">
              <li>
                <button
                  type="button"
                  class="bg-primary text-white dark:text-black px-4 py-1.5 rounded-md text-sm hover:bg-primary-600"
                  @click="handleCheckedComplete"
                >
                  完了にする
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="bg-primary text-white dark:text-black px-4 py-1.5 rounded-md text-sm hover:bg-primary-600"
                  @click="handleCheckedIncomplete"
                >
                  未完了にする
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- 新規作成 -->
        <dialog
          :open="isCreateDialogOpen"
          class="fixed inset-y-0 left-auto right-0 min-h-screen w-sm max-w-full border-l bg-white dark:bg-gray-800 border-l-gray-200 dark:border-l-gray-700"
        >
          <div class="flex flex-col gap-6 p-4">
            <div class="flex gap-2">
              <h2 class="flex-grow text-md font-bold">新規作成</h2>
              <button
                type="button"
                aria-label="新規作成ダイアログを閉じる"
                class="hover:opacity-70"
                @click="isCreateDialogOpen = false"
              >
                <UIcon
                  name="i-heroicons-x-mark"
                  class="text-xl"
                  aria-hidden="true"
                />
              </button>
            </div>
            <form class="text-sm flex flex-col gap-5 flex-grow">
              <div class="flex flex-col gap-1">
                <label for="title">タイトル</label>
                <input
                  id="title"
                  type="text"
                  class="border border-gray-300 rounded-sm py-1 px-2"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label for="note">メモ</label>
                <textarea
                  id="note"
                  class="border border-gray-300 rounded-sm py-1 px-2"
                  rows="5"
                  resize="vertical"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label for="dueDate">期限</label>
                <input
                  id="dueDate"
                  type="date"
                  class="border border-gray-300 rounded-sm py-1 px-2"
                />
              </div>
            </form>
            <div class="text-center">
              <button
                type="button"
                class="bg-primary text-white dark:text-black px-4 py-1.5 rounded-md text-sm hover:bg-primary-600"
              >
                登録
              </button>
            </div>
          </div>
        </dialog>
      </main>

      <footer>
        <p class="text-center">Vue Fes Tokyo 2025</p>
      </footer>
    </UContainer>
  </UApp>
</template>

<style scoped>
.todo-table {
  --border-color: #ccc;

  th,
  td {
    padding: 0.5rem 1rem;
    vertical-align: middle;
  }
  thead th {
    padding-block-start: 0;
    text-align: left;
  }
  thead tr {
    border-bottom: 2px solid var(--border-color);
  }
  tbody tr {
    border-bottom: 1px solid var(--border-color);
  }
}
</style>
