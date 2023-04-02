<script setup>
const {data: trainers} = await useTrainers()
</script>

<template>
    <div>
    <h1>つづきからはじめる。</h1>
    <GamifyList>
        <GamifyItem v-for="trainer in trainers" :key="trainer">
            <NuxtLink :to="`/trainer/${trainer}`">{{ trainer }}</NuxtLink>
        </GamifyItem>
    </GamifyList>
    <button type="button" onclick="history.back()" >戻る</button>
    </div>
</template>
