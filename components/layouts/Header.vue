<script setup lang="ts">
const countries = ["Uzbek", "Russin"];

const country = ref(countries[0]);
</script>

<template>
    <div class="bg-black py-3">
        <div class="container mx-auto">
            <div class="flex justify-between items-center">
                <NuxtLink to="/" class="text-white text-3xl font-bold"> Logo </NuxtLink>
                <div class="text-white flex gap-4 items-center" >
                    <h4>Login</h4>
                    <h4>Register</h4>
                    <USelect v-model="country" :options="countries" />
                    <h4>Logout</h4>
                </div>
            </div>
        </div>
    </div>
</template>
