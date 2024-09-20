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
        },
    ],
    [
        {
            label: data.value?.phone_number.toString() || "",
            icon: "i-ion-ios-telephone",
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
                router.push("/");
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
                    <USelect v-model="country" :options="countries" />
                    <ColorScheme>
                        <USelect v-model="$colorMode.preference" :options="['system', 'light', 'dark']" />
                    </ColorScheme>
                    <template v-if="!data">
                        <NuxtLink to="/login">Login</NuxtLink>
                        <NuxtLink to="/register">Register</NuxtLink>
                    </template>
                    <template v-else>
                        <UDropdown :items="items" :popper="{ arrow: true }">
                            <UAvatar :alt="data?.username" size="sm" />
                        </UDropdown>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
