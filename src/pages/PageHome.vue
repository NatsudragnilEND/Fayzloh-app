<template>
  <q-page class="relative-position">
    <q-scroll-area class="full-width full-height absolute">
      <div class="q-py-lg q-px-md row items-center q-col-gutter-md">
        <div class="col">
          <q-input class="new-fayz" autogrow bottom-slots v-model="newFayzContent" placeholder="What do you need?"
            counter maxlength="280">
            <template v-slot:before v-if="fay">
              <img @click="pushim" v-if="!fay.image.includes('https')" class="dodemg" :src="fay.image">
              <video @click="pushim" class="dodemg" loop autoplay muted v-else :src="fay.image"></video>
            </template>

          </q-input>
          <div class="gapp">
            <label class="input-file">
              <input type="file" @change="handleFileUpload" accept="image/*, video/*">
              <span>Add file</span>
            </label>
          </div>
        </div>
        <div class="col col-shrink">
          <q-btn @click="addNewFayz" class="q-mb-lg"
            :disable="sendingMessage || (!newFayzContent && !newImage && !newVideo)" unelevated no-caps rounded
            color="primary" label="Fise" />
        </div>

      </div>
      <q-separator class="devidor" size="15px" color="grey-2" />
      <q-list separator>
        <transition-group appear enter-active-class="animated fadeIn slow" leave-active-class="animated fadeOut slow">
          <q-item clickable v-for="fayz in fayzs" :to="{ name: 'Message', params: { id: fayz.id } }" :key="fayz.id"
            class="fayz q-py-md">
            <q-item-section avatar top>
              <img v-if="!fayz.image.includes('https')" class="dodemg" :src="fayz.image">
              <video class="dodemg" loop autoplay muted v-else :src="fayz.image"></video>
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
                <q-btn color="grey" size="sm" icon="far fa-comment" flat round />
                <q-btn color="grey" size="sm" icon="fas fa-retweet" flat round />
                <div class="likes-value">
                  <q-btn :color="fayz.liked ? 'pink' : 'grey'" size="sm"
                    :icon="fayz.liked ? 'fas fa-heart' : 'far fa-heart'" @click.prevent="toggleLiked(fayz)" flat
                    round />
                  <div v-if="fayz.liked > 1">{{ fayz.liked }}</div>
                </div>

                <q-btn @click.prevent="deleteFayz(fayz)" color="grey" size="sm" icon="fas fa-trash" v-if="!fayz.admin"
                  flat round />
                <div v-else></div>
              </div>
            </q-item-section>


          </q-item>
        </transition-group>


      </q-list>
    </q-scroll-area>

  </q-page>
</template>

<script setup>
import db from 'src/boot/firebase'
import { ref, onMounted } from 'vue'
import { formatDistance } from 'date-fns'
import { doc, collection, updateDoc, query, deleteDoc, addDoc, orderBy, onSnapshot } from "firebase/firestore";
import { getStorage, ref as fire, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from 'vue-router'
const router = useRouter()
let Image = ref(null)
let newFayzContent = ref('')
const relativeDate = (value) => {
  return formatDistance(value, new Date());
};
import adm from '/images/logo.png'
import nadm from '/images/fayz.jpg'
let newImage = ref(null)
const fayzs = ref([])
let fullImage = ref(false)
let adminn = ref(false)
let newVideo = ref()
const storage = getStorage();
const handleVideoUpload = async (file) => {
  const storageRef = fire(storage, `videos/${file.name}`);
  await uploadBytes(storageRef, file)
  return await getDownloadURL(storageRef);
}
let sendingMessage = ref(false);
const toggleLiked = async (fayz) => {
  const likeRef = doc(db, "fayzs", fayz.id);
  await updateDoc(likeRef, {
    liked: fayz.Fayzulloh ? fayz.liked - 1 : fayz.liked + 1,
    Fayzulloh: !fayz.Fayzulloh
  });
}

setInterval(() => {
  localStorage.setItem('lastActiveF', Date.now());
}, 100);
const addNewFayz = async () => {
  if (newFayzContent.value !== '' || newImage.value || newVideo.value) {
    sendingMessage.value = true;
    let newFayz = {
      content: newFayzContent.value,
      date: Date.now(),
      liked: 0,
      image: adminn.value ? '/images/logo.png' : '',
      images: newImage.value,
      video: null,
      admin: adminn.value,
      nickname: fay.value.nickname,
      name: fay.value.name,
      MuhammadAmin: false,
      Fayzulloh: false
    }
    if (newVideo.value) {
      newFayz.video = await handleVideoUpload(newVideo.value);
    }
    if (!adminn.value) {
      const samsya = async () => {
        if (!fay.value.image) {
          console.log('zhdi');
          setTimeout(async () => {
            await samsya();
          }, 100);

        } else {
          newFayz.image = fay.value.image;
        }
      }
      await samsya();
    }
    const docRef = await addDoc(collection(db, 'fayzs'), newFayz);
    console.log('Document written with ID: ', docRef.id);
  } else {
    return null;
  }
  newFayzContent.value = ''
  newImage.value = null
  newVideo.value = null
  sendingMessage.value = false;
}

const deleteFayz = async (fayz) => {
  await deleteDoc(doc(db, 'fayzs', fayz.id));
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
onMounted(() => {
  const q = query(collection(db, 'fayzs'), orderBy('date'));
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
const fay = ref()

const datas = ref([])
onMounted(() => {
  const q = query(collection(db, 'active'), orderBy('date'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      let dataChange = change.doc.data();
      dataChange.id = change.doc.id
      if (change.type === 'added') {
        datas.value.unshift(dataChange);
        fay.value = datas.value[0]
      }
      if (change.type === 'modified') {
        let index = datas.value.findIndex(fayz => fayz.id === dataChange.id);
        Object.assign(datas.value[index], dataChange);
        if (index === 0) {
          fay.value = datas.value[0]
        }
      }
      if (change.type === 'removed') {
        let index = datas.value.findIndex(fayz => fayz.id === dataChange.id);
        datas.value.splice(index, 1);
        if (index === 0) {
          fay.value = datas.value[0]
        }
      }
    });
  });
})
const pushim = () => {
  router.push('/Fayzulloh')
}
</script>

<style lang="scss">
@import 'src/css/app.scss';

.new-fayz {
  textarea {
    font-size: 19px;
    line-height: 1.4 !important;
  }
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

.fayz:not(:first-child) {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
