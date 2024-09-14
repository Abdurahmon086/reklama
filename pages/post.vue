<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import type { FormSubmitEvent } from "#ui/types";

const optionsVal = [
    { label: "So'm", value: "som" },
    { label: "Y.E", value: "yevro" },
];

const state = reactive({
    title: "",
    content: "",
    address: "",
    street: "",
    price: "",
    select: undefined,
    type: "",
    contact: "",
    images: [] as File[],
});

const form = ref<HTMLFormElement>();

const imageUrls = ref<string[]>([]);

const computedImageUrls = computed(() => {
    return state.images.map((image) => URL.createObjectURL(image));
});

function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        state.images = Array.from(input.files);
        imageUrls.value = computedImageUrls.value;
    }
}

function clearForm() {
    imageUrls.value.forEach((url) => URL.revokeObjectURL(url));
    imageUrls.value = [];
    state.images = [];
    state.title = "";
    state.content = "";
    state.address = "";
    state.street = "";
    state.price = "";
    state.select = undefined;
    state.type = "";
    state.contact = "";
}

async function onSubmit(event: FormSubmitEvent<any>) {
    console.log(event.data);
}

const numericPrice = computed({
    get() {
        return state.price;
    },
    set(value) {
        state.price = value.replace(/\D/g, "");
    },
});

onBeforeUnmount(() => {
    imageUrls.value.forEach((url) => URL.revokeObjectURL(url));
});
</script>

<template>
    <div class="container">
        <div class="bg-slate-500 dark:bg-gray-800 my-36 py-10 px-5 h-full">
            <UForm ref="form" :state="state" class="space-y-4" @submit="onSubmit">
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
                    <UFormGroup name="select" label="Valyuta" size="xl" class="w-full">
                        <USelect v-model="state.select" :options="optionsVal" />
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
                <UFormGroup name="images" label="Images" size="xl">
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
