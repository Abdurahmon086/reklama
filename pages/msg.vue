<script lang="ts" setup>
import { getItem } from "~/utility/localStorageControl";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { IMessage } from "~/types";

const token = getItem("token");

const schema = z.object({
    message: z.string().min(2, "2ta harfdan ko'proq yozing"),
});

type Schema = z.output<typeof schema>;

const state = reactive({
    message: "",
});

const { data, refresh } = await useLazyFetch<IMessage[]>("http://127.0.0.1:8000/api/v1/message/", {
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

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    event.preventDefault();
    try {
        await createPost(event.data.message);
        state.message = "";
        await fetchMessages();
    } catch (error) {
        console.error("Error creating post:", error);
    }
};

const createPost = async (message: string) => {
    try {
        await useLazyFetch("http://127.0.0.1:8000/api/v1/message_create/", {
            method: "POST",
            body: JSON.stringify({ message }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error("Error creating post:", error);
    }
};

const deleteMessage = async (id: number) => {
    try {
        await useLazyFetch(`http://127.0.0.1:8000/api/v1/message/${id}/`, {
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

const updateMessage = async (id: number, updatedMessage: string) => {
    try {
        await useLazyFetch(`http://127.0.0.1:8000/api/v1/message_update/${id}/`, {
            method: "PUT",
            body: JSON.stringify({ message: updatedMessage }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        await fetchMessages();
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
                        <span class="block px-2 py-1 rounded-md bg-blue-500 text-white w-fit cursor-pointer"
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
            <UForm :state="state" class="align-bottom flex w-full gap-4 pb-6" @submit="onSubmit">
                <UFormGroup name="message" class="flex-1">
                    <UInput v-model="state.message" class="!w-full" size="xl" placeholder="Xabar yuborish...." />
                </UFormGroup>
                <UButton type="submit">Submit</UButton>
            </UForm>
        </div>
    </div>
</template>

<style lang="css" scoped></style>
