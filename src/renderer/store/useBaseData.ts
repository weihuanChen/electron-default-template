import { defineStore } from "pinia";
import { ref } from "vue";

export const useBaseData = defineStore("base", () => {
  let data = ref(0);
  const addCount = (number: number) => {
    data.value += number;
  };
  return { data, addCount };
});
