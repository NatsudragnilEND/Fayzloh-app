<template>
  <q-item to="/" color="primary" class="back">
    ←
  </q-item>
  <div v-if="message">
    <q-list separator>
      <q-item class="fayz q-py-md">
        <q-item-section avatar top>
          <img @click="pushim" v-if="!message.image.includes('https')" class="dodemg" :src="message.image">
          <video @click="pushim" class="dodemg" loop autoplay muted v-else :src="message.image"></video>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-subtitle1 column">
            <strong>{{ message.nickname }}</strong>
            <span class=" text-grey-7">{{ message.name }}
              &bull;
              {{ relativeDate(message.date) }}

            </span>
          </q-item-label>
          <q-item-label v-if="message.content" class="text-body1 fayz-content">
            {{ message.content }}</q-item-label>
          <q-item-label v-if="message.video" class="text-body1 maha fayz-content"><video controls class="maha"
              :src="message.video"></video></q-item-label>
          <q-item-label v-if="message.images" class="text-body1 fayz-content">
            <img class="maha" :src="message.images" alt=""></q-item-label>
          <div class="fayz-icons row justify-between q-mt-sm">
            <q-btn color="grey" size="sm" icon="far fa-comment" flat round />
            <q-btn color="grey" size="sm" icon="fas fa-retweet" flat round />
            <div class="likes-value">
              <q-btn :color="message.liked ? 'pink' : 'grey'" size="sm"
                :icon="message.liked ? 'fas fa-heart' : 'far fa-heart'" @click="toggleLiked" flat round />
              <div v-if="message.liked > 1">{{ message.liked }}</div>
            </div>

            <q-btn @click="deleteFayz" color="grey" size="sm" icon="fas fa-trash" v-if="message.admin" flat round />
            <div v-else></div>
          </div>
        </q-item-section>
      </q-item>
      <div v-if="message.MuhammadAmin || message.Fayzulloh">liked: <span>{{ message.MuhammadAmin ? 'MuhammadAmin' : ''
          }}</span><span v-if="message.MuhammadAmin && message.Fayzulloh">,</span> <span>{{
    message.Fayzulloh ?
      'Fayzulloh' : '' }}</span></div>
    </q-list>
  </div>
  <q-scroll-area class="full-height flav absolute">
    <div class="q-py-lg row items-center">
      <div class="col col-5" :class="{ 'col-10': buf }">
        <q-input class="new-fayz" style="height: 80px;" autogrow bottom-slots v-model="newFayzContent"
          placeholder="Отвечай на слова." counter maxlength="280">
          <template v-slot:before>
            <q-avatar>
              <img :src="nadm">
            </q-avatar>
          </template>
        </q-input>
        <div class="gapp">
          <label class="input-file">
            <input type="file" @change="handleFileUpload" accept="image/*, video/*">
            <span>Add file</span>
          </label>
        </div>
      </div>
      <div class="col col-2">
        <q-btn @click="addNewFayz" class="q-mr-xlg"
          :disable="sendingMessage || (!newFayzContent && !newImage && !newVideo)" unelevated no-caps rounded
          color="primary" label="Fise" />
      </div>
    </div>
    <q-separator class="devidor" size="15px" color="grey-2" />
    <q-list>
      <transition-group appear enter-active-class="animated fadeIn slow" leave-active-class="animated fadeOut slow">
        <q-item clickable="false" v-for="fayz in fayzs" :key="fayz.id">
          <div class="fayz q-py-md" v-if="fayz.num == String(routeParams.id)">
            <q-item-section avatar top>
              <q-avatar size="xl">
                <q-img :src="fayz.image" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1 column">
                <strong>{{ fayz.nickname }}</strong>
                <span class=" text-grey-7">{{ fayz.name }}
                  &bull;
                  {{ relativeDate(fayz.date) }}

                </span>
              </q-item-label>
              <q-item-label v-if="fayz.content" class="text-body1 fayz-content">
                {{ fayz.content }}</q-item-label>
              <q-item-label v-if="fayz.video" @click.prevent class="text-body1 maha fayz-content"><video controls
                  class="maha" :src="fayz.video"></video></q-item-label>
              <q-item-label v-if="fayz.images" class="text-body1 fayz-content">
                <img class="maha" :src="fayz.images" alt=""></q-item-label>
              <div class="fayz-icons row justify-between q-mt-sm">
                <q-btn color="grey" size="sm" icon="fas fa-retweet" flat round />
                <div class="likes-value">
                  <q-btn :color="fayz.liked ? 'pink' : 'grey'" size="sm"
                    :icon="fayz.liked ? 'fas fa-heart' : 'far fa-heart'" @click.prevent="toggleLikedtu(fayz)" flat
                    round />
                  <div v-if="fayz.liked > 1">{{ fayz.liked }}</div>
                </div>

                <q-btn @click.prevent="deleteFayztu(fayz)" color="grey" size="sm" icon="fas fa-trash" v-if="!fayz.admin"
                  flat round />
                <div v-else></div>
              </div>
            </q-item-section>
          </div>



        </q-item>
      </transition-group>


    </q-list>
  </q-scroll-area>

</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { formatDistance } from 'date-fns';
import { useRouter } from 'vue-router';

const message = ref(null);
const router = useRouter();

const relativeDate = (value) => {
  return formatDistance(value, new Date());
};

const routeParams = router.currentRoute.value.params;

import db from 'src/boot/firebase';
import { doc, collection, getDoc, updateDoc, query, deleteDoc, addDoc, orderBy, onSnapshot } from "firebase/firestore";
import { getStorage, ref as fire, uploadBytes, getDownloadURL } from "firebase/storage";
let newFayzContent = ref('')
let sendingMessage = ref(false)
let newImage = ref(null)
const fayzs = ref([])
let fullImage = ref(false)
let adminn = ref(false)
let newVideo = ref()
import adm from '/images/logo.png'
import nadm from '/images/fayz.jpg'
const storage = getStorage();
const handleVideoUpload = async (file) => {
  const storageRef = fire(storage, `videos/${file.name}`);
  await uploadBytes(storageRef, file)
  return await getDownloadURL(storageRef);
}

setInterval(() => {
  localStorage.setItem('lastActiveF', Date.now());
}, 100);

const addNewFayz = async () => {
  if (newFayzContent.value !== '' || newImage.value || newVideo.value) {
    sendingMessage.value = false;
    let newFayz = {
      content: newFayzContent.value,
      date: Date.now(),
      liked: 0,
      image: adminn.value ? '/images/logo.png' : '/images/fayz.jpg',
      images: newImage.value,
      video: null,
      admin: adminn.value,
      nickname: adminn.value ? 'MuhammadAmin' : 'Fayzulloh',
      name: adminn.value ? '@Natsu_Dragnil_END' : '@Kenma',
      MuhammadAmin: false,
      Fayzulloh: false,
      num: String(routeParams.id),
    }
    if (newVideo.value) {
      newFayz.video = await handleVideoUpload(newVideo.value);
    }


    const docRef = await addDoc(collection(db, 'fayzstu'), newFayz);
    console.log('Document written with ID: ', docRef.id);
  } else {
    return null;
  }
  newFayzContent.value = ''
  newImage.value = null
  newVideo.value = null
  sendingMessage.value = false;
}
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = async () => {
      if (file.type.startsWith('image')) {
        newVideo.value = null;
        newImage.value = reader.result;
      } else if (file.type.startsWith('video')) {
        newImage.value = null;
        newVideo.value = await handleVideoUpload(newVideo.value = event.target.files[0]);
      }
    }
    reader.readAsDataURL(file)
  }
}
onMounted(async () => {
  const docRef = doc(db, 'fayzs', routeParams.id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    message.value = docSnap.data();
  } else {
    console.log('No such document!');
  }
  console.log(message.value);
});

const toggleLiked = async () => {
  if (message.value) {
    const likeRef = doc(db, "fayzs", routeParams.id);
    await updateDoc(likeRef, {
      liked: message.value.Fayzulloh ? message.value.liked - 1 : message.value.liked + 1,
      Fayzulloh: !message.value.Fayzulloh
    });
  }
}

const deleteFayz = async () => {
  if (message.value) {
    await deleteDoc(doc(db, 'fayzs', routeParams.id));
  }
}
const toggleLikedtu = async (fayz) => {
  if (!fayz.liked || isNaN(fayz.liked)) {
    fayz.liked = 0;
  }
  const newLikedValue = fayz.Fayzulloh ? fayz.liked - 1 : fayz.liked + 1;
  const likeReff = doc(db, "fayzstu", fayz.id);
  await updateDoc(likeReff, {
    liked: newLikedValue,
    Fayzulloh: !fayz.Fayzulloh
  });
}

const deleteFayztu = async (fayz) => {
  if (message.value) {
    await deleteDoc(doc(db, 'fayzstu', fayz.id));
  }
}
onMounted(() => {
  const q = query(collection(db, 'fayzs'), orderBy('date'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      let fayzChange = change.doc.data();
      fayzChange.id = change.doc.id
      if (change.type === 'added') {
      }
      if (change.type === 'modified') {
        Object.assign(message.value, fayzChange);
      }
      if (change.type === 'removed') {
        const querySnapshot = await getDocs(query(collection(db, 'fayzstu'), where('num', '==', String(routeParams.id))));
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        router.push('/admin')
      }
    });
  });
})
onMounted(() => {
  const q = query(collection(db, 'fayzstu'), orderBy('date'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      let fayzChange = change.doc.data();
      fayzChange.id = change.doc.id
      if (change.type === 'added') {
        fayzs.value.unshift(fayzChange);
      }
      if (change.type === 'modified') {
        let index = fayzs.value.findIndex(fayz => fayz.id === fayzChange.id);
        Object.assign(fayzs.value[index], fayzChange);
      }
      if (change.type === 'removed') {
        let index = fayzs.value.findIndex(fayz => fayz.id === fayzChange.id);
        fayzs.value.splice(index, 1);
      }
    });
  });
})
let buf = ref(false);
watchEffect(() => {
  if (window.innerWidth < 1000) buf.value = true;
  else buf.value = false;
})
</script>

<style lang="scss">
@import 'src/css/app.scss';

.new-fayz {
  textarea {
    font-size: 19px;
    line-height: 1.4 !important;
  }

  max-width: 600px;
}

.devidor {
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: rgb(203, 203, 203);
}



.fayz-content {
  white-space: pre-line;
}

.likes-value {
  position: relative;

  div {
    position: absolute;
    top: -5px;
    right: -1px;
  }
}

.fayz-icons {
  margin-left: -5px;
}
</style>