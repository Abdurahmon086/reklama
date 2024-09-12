<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const options = [
    { label: "Option 1", value: "option-1" },
    { label: "Option 2", value: "option-2" },
    { label: "Option 3", value: "option-3" },
];

const optionsVal = [
    { label: "So'm", value: "som" },
    { label: "Y.E", value: "yevro" },
];

const state = reactive({
    viloyat: undefined,
    shahar: undefined,
    tur: undefined,
    price: undefined,
    nextprice: undefined,
    select: undefined,
});

const schema = z.object({
    viloyat: z.any().refine((option) => option?.value === "option-2", {
        message: "Select Option 2",
    }),
    shahar: z.any().refine((option) => option?.value === "option-2", {
        message: "Select Option 2",
    }),
    tur: z.any().refine((option) => option?.value === "option-2", {
        message: "Select Option 2",
    }),
    price: z.number().max(2, { message: "Must be less than 2" }),
    nextprice: z.number().max(2, { message: "Must be less than 2" }),
    select: z.string(),
});

type Schema = z.infer<typeof schema>;

const form = ref();

async function onSubmit(event: FormSubmitEvent<Schema>) {
    console.log(event.data);
}
</script>
<template>
    <div class="w-full h-screen bg-blue-400 pt-5">
        <main class="container">
            <div class="grid grid-cols-4 rounded h-[800px]">
                <div class="col-span-1 bg-slate-500 py-3 px-4 h-full">
                    <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                        <UFormGroup name="viloyat" label="Viloyat:">
                            <UInputMenu v-model="state.viloyat" :options="options" />
                        </UFormGroup>
                        <UFormGroup name="shahar" label="Shahar:">
                            <UInputMenu v-model="state.shahar" :options="options" />
                        </UFormGroup>
                        <UFormGroup name="tur" label="Tur:">
                            <UInputMenu v-model="state.tur" :options="options" />
                        </UFormGroup>
                        <UFormGroup name="price" label="Boshlang'ich narx:">
                            <UInput v-model="state.price" type="number" />
                        </UFormGroup>
                        <UFormGroup name="nextprice" label="Tugaydigan narx:">
                            <UInput v-model="state.nextprice" type="number" />
                        </UFormGroup>
                        <UFormGroup name="select" label="Valyuta:">
                            <USelect v-model="state.select" :options="optionsVal" />
                        </UFormGroup>

                        <UButton type="submit"> Submit </UButton>

                        <UButton variant="outline" class="ml-2" @click="form.clear()"> Clear </UButton>
                    </UForm>
                </div>
                <div class="col-span-3 bg-red-50 w-full"></div>
            </div>
        </main>
    </div>
</template>
