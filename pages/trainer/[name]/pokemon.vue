<script setup>
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const trainerName = route.params.name;

const { data: pokemons } = await useFetch(
  () =>
    `https://pokeapi.co/api/v2/pokemon?offset=${0}&limit=${1281}`
);

const onCatch = async (pokemon) => {
  const response = await fetch(
    `${config.backendOrigin}/api/trainer/${trainerName}/pokemon/${pokemon.name}`,
    {
        method: "PUT",
    }
  );
  if (!response.ok) return;
  router.push(`/trainer/${route.params.name}`);
};

const { dialog, onOpen, onClose } = useDialog();
</script>

<template>
    <div>
        <h1>トレーナー情報</h1>
        <span style="font-size:25">{{ $route.params.name }}</span>
        <p></p>
    　　<button type="button" onclick="history.back()" >戻る</button>
        <div style="padding: 10px; margin-bottom: 10px;width:500px ; border: 5px solid #333333; border-radius: 5px;">
                <GamifyItem v-for="pokemon in pokemons.results" :key="pokemon.url">
                <span class="pokemon-name">{{ pokemon.name }}</span>
                <GamifyButton @click="onOpen(pokemon)">つかまえる</GamifyButton>
                </GamifyItem>
        </div>
        <GamifyDialog v-if="dialog" id="confirm-catch" title="かくにん" :description="`ほう！ ${dialog.name} にするんじゃな？`"
      @close="onClose"><GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="onClose">いいえ</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onCatch(dialog)">はい</GamifyButton>
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>
      
    </div>
    
</template>
