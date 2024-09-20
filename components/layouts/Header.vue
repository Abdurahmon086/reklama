<script setup lang="ts">
import { BASE_URL } from "~/constants";
import type { IUser } from "~/types";
import { getItem, removeItem } from "~/utility/localStorageControl";

const router = useRouter();
let token = ref(getItem("token"));

const countries = ["Uzbek", "Russin"];
const country = ref(countries[0]);
const data = ref<IUser | null>(null);

if (token.value) {
    $fetch<IUser | null>(`${BASE_URL}user/`, {
        headers: {
            Authorization: `Bearer ${token.value}`,
        },
    })
        .then((res) => {
            data.value = res;
        })
        .catch((err) => {
            console.error("Error fetching user:", err);
            router.push("/login");
            data.value = null;
        });
}

const items = computed(() => [
    [
        {
            label: data.value?.username || "Unknown User",
            avatar: {
                src: "https://avatars.githubusercontent.com/u/739984?v=4",
            },
        },
    ],
    [
        {
            label: "Edit",
            icon: "i-heroicons-pencil-square-20-solid",
            shortcuts: ["E"],
            click: () => {
                console.log("Edit");
            },
        },
        {
            label: "Duplicate",
            icon: "i-heroicons-document-duplicate-20-solid",
            shortcuts: ["D"],
            disabled: true,
        },
    ],
    [
        {
            label: "Archive",
            icon: "i-heroicons-archive-box-20-solid",
        },
        {
            label: "Move",
            icon: "i-heroicons-arrow-right-circle-20-solid",
        },
    ],
    [
        {
            label: "Logout",
            icon: "i-mi-log-out",
            click: () => {
                removeItem("token");
                token.value = "";
                data.value = null;
                router.push("/login");
            },
        },
    ],
]);
</script>

<template>
    <div class="z-[999999999] bg-black py-3 absolute top-0 left-0 w-full">
        <div class="container mx-auto">
            <div class="flex justify-between items-center">
                <NuxtLink to="/" class="text-white text-3xl font-bold"> Logo </NuxtLink>
                <div class="text-white flex gap-4 items-center pr-1">
                    <NuxtLink to="/login">Login</NuxtLink>
                    <NuxtLink to="/register">Register</NuxtLink>
                    <USelect v-model="country" :options="countries" />
                    <ColorScheme>
                        <USelect v-model="$colorMode.preference" :options="['system', 'light', 'dark']" />
                    </ColorScheme>
                    <UDropdown :items="items" :popper="{ arrow: true }">
                        <UAvatar :alt="data?.username" size="sm" />
                    </UDropdown>
                </div>
            </div>
        </div>
    </div>
</template>
