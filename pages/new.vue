<script setup>
const router = useRouter();
const config = useRuntimeConfig();
const trainerName = ref("");
const safeTranerName = computed(() => trimAvoidCharacters(trainerName.value));
const valid = computed(() => trainerName.value.length > 0);
const onSubmit = async () => {
  const response = await fetch(`${config.backendOrigin}/api/trainer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: trainerName.value,
    }),
  });
  if (!response.ok) return;
  router.push(`/trainer/${trainerName.value}`);
};

const { dialog, onOpen, onClose } = useDialog();
</script>

<template>
  <div>
    <h1>あたらしくはじめる</h1>
    <p>では はじめに きみの なまえを おしえて もらおう！</p>
    <form @submit.prevent>
      <p>とくていの もじは とりかれるぞ</p>   
      <input id="" v-model="trainerName" type="text"/>
      <button :disabled="!valid" @click="onOpen(true)" >けってい</button>
    </form>
    <GamifyDialog
      v-if="dialog"
      id="confirm-submit"
      title="かくにん"
      :description="`ふむ・・・ きみは ${safeTranerName} と いうんだな！`"
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
    <button type="button" onclick="history.back()" >戻る</button>
  </div>
</template>

<style scoped>
form {
  border-radius: 0.5rem;
  border: solid 4px #555;
  padding: 1.5rem 3rem;
}

form > :not(:last-child) {
  display: block;
  margin-bottom: 1rem;
}

.item > label,
.item > span {
  display: block;
  margin-bottom: 0.25rem;
}
.item > span {
  font-size: 0.875rem;
}
</style>
