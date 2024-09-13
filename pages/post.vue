<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

// Define your options and state
const optionsVal = [
    { label: 'So\'m', value: 'som' },
    { label: 'Y.E', value: 'yevro' },
];

const state = reactive({
    viloyat: undefined,
    shahar: undefined,
    tur: undefined,
    price: undefined,
    nextprice: undefined,
    select: undefined,
    image: null as File | null, // Use null instead of undefined
});

const schema = z.object({
    viloyat: z.any().refine((option) => option?.value === 'option-2', {
        message: 'Select Option 2',
    }),
    shahar: z.any().refine((option) => option?.value === 'option-2', {
        message: 'Select Option 2',
    }),
    tur: z.any().refine((option) => option?.value === 'option-2', {
        message: 'Select Option 2',
    }),
    price: z.number().max(2, { message: 'Must be less than 2' }),
    nextprice: z.number().max(2, { message: 'Must be less than 2' }),
    select: z.string(),
});

type Schema = z.infer<typeof schema>;

const form = ref<HTMLFormElement>();

// Image preview URL
const imageUrl = computed(() => {
    if (state.image) {
        return URL.createObjectURL(state.image);
    }
    return '';
});

function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        state.image = input.files[0];
    }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    console.log(event.data);
}
</script>


<template>
    <div class="container">
        <div class="bg-slate-500 dark:bg-gray-800 my-36 py-10 px-5 h-full">
            <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
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
                        <UInput v-model="state.price" type="number" />
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
                    <UInput
                        v-model="state.image"
                        type="file"
                        size="xl"
                        icon="i-heroicons-folder"
                        @change="handleFileChange"
                    />
                    <div v-if="imageUrl" class="mt-4">
                        <img :src="imageUrl" alt="Image preview" class="max-w-full h-auto" />
                    </div>
                </UFormGroup>
                <UButton type="submit"> Submit </UButton>

                <UButton variant="outline" class="ml-2" @click="form.clear()"> Clear </UButton>
            </UForm>
        </div>
    </div>
</template>
