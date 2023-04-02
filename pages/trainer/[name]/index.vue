<script setup>
const router = useRouter();
const config = useRuntimeConfig();
const route = useRoute()
const trainerName = route.params.name;

const { data: trainer, refresh } = await useFetch(
  () => 
  `${config.backendOrigin}/api/trainer/${trainerName}`
);

const onSubmit = async () => {
    const response =    await fetch(`${config.backendOrigin}/api/trainer/${trainerName}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: trainerName,
    }),
  });

  if (!response.ok) return;
  router.push(`/`);
};

const onRelease = async (pokemonId) => {
  const response = await fetch(
    `${config.backendOrigin}/api/trainer/${route.params.name}/pokemon/${pokemonId}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) return;
  await refresh();
  onCloseRelease();
};

const { dialog, onOpen, onClose } = useDialog();
const { dialog: releaseDialog, onOpen: onOpenRelease,onClose: onCloseRelease,} = useDialog();
</script>

<template>
<div>
    <h1>トレーナー情報</h1>
    <div class="trainer-info">
        <img src="/avatar.png" height="60" width="60">
        <span style="font-size:25">{{ $route.params.name }}</span>
    </div>
    <button @click="onOpen(true)">マサラタウンにかえる</button>
    <p></p>
    <button type="button" onclick="history.back()" >戻る</button>
    
    <h2>てもちポケモン</h2>
    <CatchButton :to="`/trainer/${$route.params.name}/pokemon`">ポケモンをつかまえる</CatchButton>

    <div style="padding: 10px; margin-bottom: 10px;width:500px ; border: 5px solid #333333; border-radius: 5px;">
      <GamifyItem v-for="pokemon in trainer.pokemons" :key="pokemon.id">
        <img :src="pokemon.sprites.front_default" />
        <span class="pokemon-name">{{ pokemon.nickname || pokemon.name }}</span>
        <GamifyButton @click="onOpenNickname(pokemon)"
          >ニックネームをつける</GamifyButton>
        <GamifyButton @click="onOpenRelease(pokemon)"
          >はかせにおくる</GamifyButton>
      </GamifyItem>
    </div>

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
    <GamifyDialog
      v-if="releaseDialog"
      id="confirm-release"
      title="かくにん"
      :description="`ほんとうに ${
        releaseDialog.nickname || releaseDialog.name
      } を はかせに おくるんだな！ この そうさは とりけせないぞ！`"
      @close="onCloseRelease"
    >
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="onCloseRelease">いいえ</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onRelease(releaseDialog.id)">はい</GamifyButton>
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
