<template>
  <q-layout view="lHr lpR fFf" v-if="correct">

    <q-header bordered class="bg-white text-black">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="text-weight-bold">
          <span class="gt-sm">{{ $route.name }}</span>
          <img class="iconLogo sid lt-md header-icon" src="/images/logo.png" alt="">
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" :width="283" side="left" bordered>
      <q-img class="iconLogo" :to="istin" src="/images/logo.png" alt="" />
      <q-list>
        <q-item exact :to="istin" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="home" size="md" />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold">Home</q-item-section>
        </q-item>
        <q-item exact to="/about" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="help" size="md" />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold">About</q-item-section>
        </q-item>
        <q-item exact @click="exit" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="fa-solid fa-door-open" size="md" />
          </q-item-section>
          <q-item-section class="text-h6 text-weight-bold">Exit</q-item-section>
        </q-item>
        <q-item exact @click="openRightDrawer" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="fa-solid fa-magnifying-glass-arrow-right" size="md" />
          </q-item-section>
          <q-item-section class="text-h6 text-weight-bold">Search</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <q-input color="grey" rounded class="q-ma-md" ref="tot" v-model="searchQuery" outlined placeholder="search loh">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-list separator bordered padding>
        <q-item clickable v-for="fayz in filteredDatas" @click="dnx(fayz.nickname, fayz.id)" :key="fayz.id"
          class="fayz q-py-md">
          <q-item-section avatar top>
            <img v-if="!fayz.image.includes('https')" class="dodemg" :src="fayz.image">
            <video class="dodemg" loop autoplay muted v-else :src="fayz.image"></video>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-subtitle1 column">
              <div><strong>{{ fayz.nickname }}</strong></div>
              <span class="text-grey-7">{{ fayz.name }}
              </span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
  <q-layout v-else>

  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch, watchEffect, computed } from 'vue'
import { useQuasar } from 'quasar'
import db from 'src/boot/firebase'
import { doc, collection, updateDoc, query, deleteDoc, addDoc, orderBy, onSnapshot } from "firebase/firestore";
const $q = useQuasar()
let correct = ref(false)
const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)
let tot = ref(null)
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
const openRightDrawer = () => {
  rightDrawerOpen.value = true
  if (window.innerWidth < 1000) {
    leftDrawerOpen.value = false
  }
  tot.value.focus()
}
import { useRouter } from 'vue-router'
const router = useRouter()
const exit = () => {
  confirm()
}

const confirm = () => {
  $q.dialog({
    title: 'Confirm',
    message: 'do you really want to exit',
    cancel: true,
    persistent: true
  }).onOk(() => {
    localStorage.removeItem('adminpass')
    location.reload()
  })
}
const datas = ref([

])
const searchQuery = ref('')

const filteredDatas = computed(() => {
  return datas.value.filter(fayz => {
    return fayz.nickname.toLowerCase().includes(searchQuery.value.toLowerCase()), fayz.name.toLowerCase().includes(searchQuery.value.toLowerCase());
  })
});

const prompt = () => {
  $q.dialog({
    title: 'Проверка на хакера',
    message: 'Введите пароль:',
    prompt: {
      model: '',
      type: 'text'
    },
    cancel: false,
    persistent: true
  }).onOk(data => {
    const lowerCaseData = data.toLowerCase();
    if (lowerCaseData === adminpass.value[0].admin) {
      correct.value = true;
      router.push('/admin')
      localStorage.setItem('adminpass', JSON.stringify(adminpass.value[0].admin))
    } else if (lowerCaseData === adminpass.value[0].fayz) {
      correct.value = true;
      router.push('/')
      localStorage.setItem('adminpass', JSON.stringify(adminpass.value[0].fayz))
    } else {
      prompt();
    }
  })
}
const adminpass = ref([])
$q.loading.show()
onMounted(() => {
  const q = query(collection(db, 'adminpass'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      let fayzChange = change.doc.data();
      fayzChange.id = change.doc.id
      if (change.type === 'added') {
        adminpass.value.unshift(fayzChange);
      }
      if (change.type === 'modified') {
        let index = adminpass.value.findIndex(fayz => fayz.id === fayzChange.id);
        Object.assign(adminpass.value[index], fayzChange);
      }
      if (change.type === 'removed') {
        let index = adminpass.value.findIndex(fayz => fayz.id === fayzChange.id);
        adminpass.value.splice(index, 1);
      }
    });
  });
})
let loc = ref('' || JSON.parse(localStorage.getItem('adminpass')))
let istin = computed(() => {
  return JSON.parse(localStorage.getItem('adminpass')) == 'lo' ? '/admin' : '/'
})
watch(adminpass.value, (newValue) => {
  if (newValue.length > 0) {
    $q.loading.hide()
    if (!loc.value) {
      prompt();
    } else if (loc.value == 'go') {
      correct.value = true;
      router.push(router.currentRoute.value.fullPath)
    } else if (loc.value == 'lo') {
      correct.value = true;
      if (!router.currentRoute.value.fullPath.includes('/messaget')) {
        router.push(router.currentRoute.value.fullPath.includes('/admin') ? router.currentRoute.value.fullPath : '/admin' + router.currentRoute.value.fullPath)
      }
      else {
        router.push(router.currentRoute.value.fullPath.includes('/admin'))
      }
    }
  }
});
const hco = computed(() => {
  return router.currentRoute.value.fullPath.includes('/admin') ? 'a' : ''
})
onMounted(() => {
  const q = query(collection(db, 'active'), orderBy('date'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      let dataChange = change.doc.data();
      dataChange.id = change.doc.id
      if (change.type === 'added') {
        datas.value.unshift(dataChange);
      }
      if (change.type === 'modified') {
        let index = datas.value.findIndex(fayz => fayz.id === dataChange.id);
        Object.assign(datas.value[index], dataChange);
      }
      if (change.type === 'removed') {
        let index = datas.value.findIndex(fayz => fayz.id === dataChange.id);
        datas.value.splice(index, 1);
      }
    });
  });
})
const dnx = (rou, id) => {
  let bem = ''
  if (id == 'M') {
    bem = 'MuhammadAmin'
  } else {
    bem = 'Fayzulloh'
  }
  router.push({ name: bem + hco.value, params: { id: id } })
}
</script>

<style lang="scss">
.iconLogo {
  margin: 7px 20px;
  max-width: 58px;
  width: 100%;
}

.sid {
  max-width: 65px;
  margin-top: 15px;
}

.header-icon {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  top: -10px;
}
</style>