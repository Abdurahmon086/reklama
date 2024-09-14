<script setup lang="ts">
const countries = ["Uzbek", "Russin"];
const country = ref(countries[0]);
</script>

<template>
    <div class="z-[999999999] bg-black py-3 absolute top-0 left-0 w-full">
        <div class="container mx-auto">
            <div class="flex justify-between items-center">
                <NuxtLink to="/" class="text-white text-3xl font-bold"> Logo </NuxtLink>
                <div class="text-white flex gap-4 items-center pr-1">
                    <NuxtLink to="/login">Login</NuxtLink>
                    <NuxtLink to="/register">Register</NuxtLink>
                    <NuxtLink to="/login">Logout</NuxtLink>
                    <USelect v-model="country" :options="countries" />
                    <ColorScheme>
                        <USelect v-model="$colorMode.preference" :options="['system', 'light', 'dark']" />
                    </ColorScheme>
                </div>
            </div>
        </div>
    </div>
</template>
