<script lang="ts" setup>
import { getItem } from "~/utility/localStorageControl";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { IMessage } from "~/types";
import { BASE_URL } from "~/constants";

const router = useRouter();
const token = getItem("token");

if (!token) {
    router.push("/login");
}

const isOpen = ref(false);
const getId = ref<number | null>(null);

const state = reactive({
    message: "",
    messageUp: "",
});

const isModal = (val: boolean, id: number, message: string) => {
    isOpen.value = val;
    getId.value = id;
    state.messageUp = message;
};

const schema = z.object({
    message: z.string().min(2, "2ta harfdan ko'proq yozing"),
    messageUp: z.string().min(2, "2ta harfdan ko'proq yozing"),
});

type Schema = z.output<typeof schema>;

const { data, refresh, status } = await useFetch<IMessage[]>(`${BASE_URL}message/`, {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
});
const fetchMessages = async () => {
    try {
        await refresh();
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
};

if (!data.value) {
    fetchMessages();
}

const createPost = async (event: FormSubmitEvent<Schema>) => {
    event.preventDefault();
    try {
        if (event.data.message.length > 2) {
            const message = event.data.message;
            await $fetch(`${BASE_URL}message_create/`, {
                method: "POST",
                body: JSON.stringify({ message }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            state.message = "";
            await fetchMessages();
        }
    } catch (error) {
        console.error("Error creating post:", error);
    }
};

const deleteMessage = async (id: number) => {
    try {
        await $fetch(`${BASE_URL}message/${id}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        await fetchMessages();
    } catch (error) {
        console.error("Error deleting message:", error);
    }
};

const updateMessage = async (event: FormSubmitEvent<Schema>) => {
    event.preventDefault();
    if (!getId.value) return;

    try {
        await $fetch(`${BASE_URL}message_update/${getId.value}/`, {
            method: "PUT",
            body: JSON.stringify({ message: state.messageUp }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        await fetchMessages();
        isOpen.value = false;
    } catch (error) {
        console.error("Error updating message:", error);
    }
};
</script>

<template>
    <div class="container pt-24 h-screen">
        <div class="py-3 px-4 text-black h-full flex flex-col space-y-4 justify-between">
            <ul class="space-y-4 flex-1 overflow-y-auto scroll-container">
                <li class="bg-yellow-400 py-3 px-4 rounded-lg relative group" v-for="item in data" :key="item?.id">
                    <div class="flex gap-3">
                        <h4 class="font-bold">User {{ item?.user }}</h4>
                        <h4 class="font-bold">id: {{ item?.id }}</h4>
                    </div>
                    <div>
                        <p>{{ item?.message }}</p>
                    </div>
                    <div class="group-hover:flex hidden transition-all gap-2 absolute top-2 right-4">
                        <span
                            class="block px-2 py-1 rounded-md bg-blue-500 text-white w-fit cursor-pointer"
                            @click="isModal(true, item?.id, item?.message)"
                            >Update</span
                        >
                        <span
                            class="block px-2 py-1 rounded-md bg-red-500 text-white w-fit cursor-pointer"
                            @click="deleteMessage(item?.id)"
                            >Delete</span
                        >
                    </div>
                </li>
            </ul>

            <UForm :state="state" class="align-bottom flex w-full gap-4 pb-6" @submit="createPost">
                <UFormGroup name="message" class="flex-1">
                    <UInput v-model="state.message" class="!w-full" size="xl" placeholder="Xabar yuborish...." />
                </UFormGroup>
                <UButton type="submit" color="black">Submit</UButton>
            </UForm>
        </div>
    </div>

    <UModal v-model="isOpen" class="z-[999999999]">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Modal</h3>
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark-20-solid"
                        class="-my-1"
                        @click="isOpen = false"
                    />
                </div>
            </template>

            <UForm :state="state" class="align-bottom flex w-full gap-4 pb-6" @submit="updateMessage">
                <UFormGroup name="messageUp" class="flex-1">
                    <UInput v-model="state.messageUp" class="!w-full" size="xl" placeholder="Xabarni tahrirlash...." />
                </UFormGroup>
                <UButton type="submit">Update</UButton>
            </UForm>
        </UCard>
    </UModal>
</template>
