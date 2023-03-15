<script setup>
const router = useRouter();
const config = useRuntimeConfig();
const route = useRoute()
const trainerName = route.params.name;

const onSubmit = async () => {
    const response =    await fetch(`${config.backendOrigin}/api/trainer/${trainerName}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: $route.params.name,
    }),
  });
  alert("okk");


  if (!response.ok) return;
};


const { dialog, onOpen, onClose } = useDialog();
</script>

<template>
<div>
    <h1>トレーナー情報</h1>
    <div class="trainer-info">
        <img src="/avatar.png" height="60" width="60">
        <span style="font-size:25">{{ $route.params.name }}</span>
    </div>
    <button @click="onOpen(true)">マサラタウンにかえる</button>

    <h2>てもちポケモン</h2>
    <button><span id="buttonImage"></span>ポケモンをつかまえる</button>

    <GamifyDialog
      v-if="dialog"
      id="confirm-submit"
      title="かくにん"
      :description="`本当にマサラタウンにかえるんだな！？このそうさはとりけせないぞ！`"
      @close="onClose">
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="onClose">いいえ</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onSubmit">はい</GamifyButton>
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>

</div>
</template>


<style scoped>
#buttonImage {
  background-image:url('/favicon.ico');
  display:inline-block;
  margin-top:2px;
  width:48px;
  height:45px;
}
</style>