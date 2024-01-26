import * as VueRouter from "vue-router";
const routes = [
  { path: "/", redirect: "/WindowMain" },
  {
    path: "/WindowMain",
    component: () => import("./Window/WindowMain.vue"),
    children: [
    ],
  },
  {
    path: "/WindowSetting",
    component: () => import("./Window/WindowSetting.vue"),
    children: [
      {
        path: "AccountSetting",
        component: () => import("./Window/WindowSetting/AccountSetting.vue"),
      },
    ],
  },
];
// 导出
export const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});
