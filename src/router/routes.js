
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/PageHome.vue'),
        name: 'Home',
      },
      {
        path: '/about',
        component: () => import('pages/PageAbout.vue'),
        name: 'About',
      },
      {
        path: '/admin',
        component: () => import('pages/PageAdmin.vue'),
        name: 'Admin developer',
      },
      {
        path: '/message/:id',
        name: 'Message',
        component: () => import('pages/Message.vue'),
        props: true,
      },
      {
        path: '/messaget/:id',
        name: 'MessageT',
        component: () => import('pages/MessageT.vue'),
        props: true,
      },
      {
        path: '/Fayz',
        name: 'MuhammadAmin',
        component: () => import('pages/MuhammadAmin.vue'),
      },
      {
        path: '/Fayzulloh',
        name: 'Fayzulloh',
        component: () => import('pages/Fayzulloh.vue'),
      },
      {
        path: '/admin/Fayz',
        name: 'MuhammadAmina',
        component: () => import('pages/MuhammadAmin.vue'),
      },
      {
        path: '/admin/Fayzulloh',
        name: 'Fayzulloha',
        component: () => import('pages/Fayzulloh.vue'),
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
