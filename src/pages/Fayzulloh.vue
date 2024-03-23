<template>
  <div @click="rut" color="primary" class="backti">
    ←
  </div>
  <q-list class="q-ml-md lflex" padding>
    <q-item v-if="fayz" class="mag">
      <img v-if="!fayz.image.includes('https')" class="dodimga" :src="fayz.image">
      <video class="dodimga" loop autoplay muted v-else :src="fayz.image"></video>
    </q-item>
    <q-item v-if="fayz" class="fayz q-py-md">
      <q-item-section avatar top @click="uploadImage">
        <div class="image-wrapper" @mouseover="showCameraIcon = true" @mouseleave="showCameraIcon = false">
          <Transition appear enter-active-class="animated fadeIn slow" leave-active-class="animated fadeOut slow">
            <q-icon v-show="showCameraIcon" class="camera-icon" name="camera_alt" />
          </Transition>
          <img class="dodemg" v-if="!fayz.image.includes('https')" :src="fayz.image">
          <video class="dodemg" loop autoplay muted v-else :src="fayz.image"></video>
        </div>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-subtitle1 column">
          <div><strong>{{ fayz.nickname }}</strong></div>
          <span class="text-grey-7">{{ fayz.name }}
          </span>
        </q-item-label>
      </q-item-section>
    </q-item>
    <button v-if="dnx" @click="uploadImage" class="bit">Change pfp <q-icon class="qicon" name="camera_alt" /></button>
    <q-input v-if="dnx" standout="bg-teal text-white" class="mai" v-model="changedNick" label="nick-name" />
    <q-input v-if="dnx" standout="bg-teal text-white" class="mai" v-model="changedName" label="nick-name" />
  </q-list>
  <input v-if="dnx" type="file" @change="handleFileUpload" style="display: none;" ref="imageInput"
    accept="image/*, video/*">
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()
const rut = () => {
  router.go(-1);
}
import { ref, onMounted, watch, watchEffect, computed } from 'vue'
import db from 'src/boot/firebase'
import { doc, collection, updateDoc, query, deleteDoc, addDoc, orderBy, onSnapshot } from "firebase/firestore";
import { getStorage, ref as fire, uploadBytes, getDownloadURL } from "firebase/storage";
const fayz = ref()
let showCameraIcon = ref(false);
const datas = ref([])
onMounted(() => {
  const q = query(collection(db, 'active'), orderBy('date'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      let dataChange = change.doc.data();
      dataChange.id = change.doc.id
      if (change.type === 'added') {
        datas.value.unshift(dataChange);
        fayz.value = datas.value[0]
      }
      if (change.type === 'modified') {
        let index = datas.value.findIndex(fayz => fayz.id === dataChange.id);
        console.log('modified', dataChange);
        Object.assign(datas.value[index], dataChange);
        if (index === 0) {
          fayz.value = datas.value[0]
        }
      }
      if (change.type === 'removed') {
        let index = datas.value.findIndex(fayz => fayz.id === dataChange.id);
        datas.value.splice(index, 1);
        if (index === 0) {
          fayz.value = datas.value[0]
        }
      }
    });
  });
})
const imageInput = ref(null)
const storage = getStorage();
const handleVideoUpload = async (file) => {
  const storageRef = fire(storage, `videos/${file.name}`);
  await uploadBytes(storageRef, file)
  return await getDownloadURL(storageRef);
}
let dnx = computed(() => {
  if (router.currentRoute.value.fullPath.includes('/admin')) {
    return false
  } else {
    return true
  }
})
const uploadImage = () => {
  if (dnx) imageInput.value.click();
  else console.log('dnx')
}
let newVideo = ref()
let newImage = ref()
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
  toggleLiked()
}
let changedNick = ref('')
watchEffect(() => {
  if (fayz.value) {
    changedNick.value = fayz.value.nickname
  }
})
watchEffect(() => {
  if (fayz.value && changedNick.value !== fayz.value.nickname) {
    const imageRef = doc(db, "active", fayz.value.id);
    updateDoc(imageRef, {
      nickname: changedNick.value
    }).then(() => {
      fayz.value.nickname = changedNick.value;
    }).catch(error => {
      console.error("Error updating nickname:", error);
    });
  }
});
let changedName = ref('')
watchEffect(() => {
  if (fayz.value) {
    changedName.value = fayz.value.name
  }
})
watchEffect(() => {
  if (fayz.value && changedName.value !== fayz.value.name) {
    const imageRef = doc(db, "active", fayz.value.id);
    updateDoc(imageRef, {
      name: changedName.value
    }).then(() => {
      fayz.value.name = changedName.value;
    }).catch(error => {
      console.error("Error updating nickname:", error);
    });
  }
});

const toggleLiked = async () => {
  if (newVideo.value || newImage.value) {
    const imageRef = doc(db, "active", 'Fayz');
    await updateDoc(imageRef, {
      image: newVideo.value || newImage.value,
    });
  } else {
    console.log('zhdi');
    setInterval(async () => {
      await newVideo.value
      toggleLiked()
    }, 1000);
  }
}
</script>

<style lang="scss">
.image-wrapper {
  position: relative;
  display: inline-block;
  transition: .3s;
}

.camera-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 24px;
  display: block;
  z-index: 10000;
  transition: .3s;
  cursor: pointer;
}

.bit {
  background-color: #2196F3;
  /* Blue color */
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0d8ae3;
  }

  .qicon {
    margin-left: 5px;
  }
}

.dodemg:hover,
.camera-icon {
  transition: .3s;
}
</style>