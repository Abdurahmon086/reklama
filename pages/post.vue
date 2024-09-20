<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import { BASE_URL } from "~/constants";
import { getItem } from "~/utility/localStorageControl";

const token = getItem("token");
const imageUrls = ref<string[]>([]);

const state = reactive({
    title: "",
    content: "",
    address: "",
    street: "",
    price: "",
    price_type: "",
    type: "",
    contact: "",
    image_url: [] as File[],
});

const computedImageUrls = computed(() => {
    return state.image_url.map((image) => URL.createObjectURL(image));
});

function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        state.image_url = Array.from(input.files);
        imageUrls.value = computedImageUrls.value;
    }
}

function clearForm() {
    imageUrls.value.forEach((url) => URL.revokeObjectURL(url));
    imageUrls.value = [];
    state.image_url = [];
    state.title = "";
    state.content = "";
    state.address = "";
    state.street = "";
    state.price = "";
    state.price_type = "";
    state.type = "";
    state.contact = "";
}

async function onSubmit(event: FormSubmitEvent<any>) {
    event.preventDefault();
    try {
        const { data, status } = await useFetch(`${BASE_URL}adver_post/`, {
            method: "POST",
            body: JSON.stringify(event.data),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(data, status);
    } catch (err) {
        console.error("Post send", err);
    }
}

const numericPrice = computed({
    get() {
        return state.price;
    },
    set(value) {
        state.price = value.replace(/\D/g, "");
    },
});

const optionsVal = [
    { label: "So'm", value: "som" },
    { label: "Y.E", value: "yevro" },
];

onBeforeUnmount(() => {
    imageUrls.value.forEach((url) => URL.revokeObjectURL(url));
});
</script>

<template>
    <div class="container">
        <div class="bg-slate-500 dark:bg-gray-800 my-36 py-10 px-5 h-full">
            <UForm :state="state" class="space-y-4" @submit="onSubmit">
                <UFormGroup name="title" label="Title" size="xl">
                    <UInput v-model="state.title" />
                </UFormGroup>
                <UFormGroup name="content" label="Content" size="xl">
                    <UTextarea v-model="state.content" />
                </UFormGroup>
                <div class="flex justify-between gap-6">
                    <UFormGroup name="address" label="Address" size="xl" class="w-full">
                        <UInput v-model="state.address" />
                    </UFormGroup>
                    <UFormGroup name="street" label="Street" size="xl" class="w-full">
                        <UInput v-model="state.street" />
                    </UFormGroup>
                </div>
                <div class="flex justify-between gap-6">
                    <UFormGroup name="price" label="Price" size="xl" class="w-full">
                        <UInput v-model="numericPrice" type="text" />
                    </UFormGroup>
                    <UFormGroup name="price_type" label="Valyuta" size="xl" class="w-full">
                        <USelect v-model="state.price_type" :options="optionsVal" />
                    </UFormGroup>
                </div>
                <div class="flex justify-between gap-6">
                    <UFormGroup name="type" label="Type" size="xl" class="w-full">
                        <UInput v-model="state.type" />
                    </UFormGroup>
                    <UFormGroup name="contact" label="Contact" size="xl" class="w-full">
                        <UInput v-model="state.contact" type="tel" />
                    </UFormGroup>
                </div>
                <UFormGroup name="image_url" label="Image" size="xl">
                    <input type="file" @change="handleFileChange" multiple accept="image/*" class="mt-2" />
                    <div class="mt-4">
                        <div v-for="(url, index) in imageUrls" :key="index" class="inline-block mr-4">
                            <img :src="url" alt="Image preview" class="max-w-[350px] aspect-[1.7] object-cover" />
                        </div>
                    </div>
                </UFormGroup>

                <UButton type="submit"> Submit </UButton>

                <UButton variant="outline" class="ml-2" @click="clearForm"> Clear </UButton>
            </UForm>
        </div>
    </div>
</template>
