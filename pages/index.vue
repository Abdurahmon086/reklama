<script setup lang="ts">
import { z } from "zod";
import { getItem } from "~/utility/localStorageControl";
import { BASE_URL } from "~/constants";
import type { IRegion } from "~/types";
import type { FormSubmitEvent } from "#ui/types";

const token = getItem("token");

const state = reactive({
    viloyat: "",
    shahar: "",
    tur: "",
    price: "",
    nextprice: "",
    select: "",
});

const schema = z.object({
    price: z.number(),
    nextprice: z.number(),
    select: z.string(),
});

type Schema = z.infer<typeof schema>;

const formclear = () => {
    state.viloyat = "";
    state.shahar = "";
    state.tur = "";
    state.price = "";
    state.nextprice = "";
    state.select = "";
};

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        console.log(event.data);
    } catch (error) {
        console.error("Form submission error:", error);
    }
}

const { data: discounts } = await useAsyncData("cart-discount", async () => {
    try {
        const [region, type] = await Promise.all([
            $fetch<IRegion[]>(`${BASE_URL}get_region/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
            $fetch<IRegion[]>(`${BASE_URL}adver_type/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        ]);
        const re = region.map(({ id, name }) => ({ label: name, value: id })) ?? [];
        const ty = type.map(({ id, name }) => ({ label: name, value: id })) ?? [];

        return { re, ty };
    } catch (err) {
        console.error("Error fetching data:", err);
        return { region: [], type: [] };
    }
});

const optionsVal = [
    { label: "So'm", value: "som" },
    { label: "Y.E", value: "yevro" },
];

const cityOptions = ref<{ label: string; value: number }[]>([]);

watch(
    () => state.viloyat,
    async (newVal: any) => {
        if (newVal) {
            try {
                const cities = await $fetch<IRegion[]>(`${BASE_URL}get_street/${newVal.value}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                cityOptions.value = cities.map(({ name, id }) => ({
                    label: name,
                    value: id,
                }));
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        }
    }
);
</script>

<template>
    <div class="w-full h-screen bg-blue-400 dark:bg-gray-900 pt-24">
        <main class="container">
            <div class="grid grid-cols-4 rounded h-[800px]">
                <div class="col-span-1 bg-slate-500 dark:bg-gray-800 py-3 px-4 h-full">
                    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                        <UFormGroup name="viloyat" label="Viloyat:">
                            <UInputMenu v-model="state.viloyat" :options="discounts?.re" />
                        </UFormGroup>
                        <UFormGroup name="shahar" label="Shahar:">
                            <UInputMenu v-model="state.shahar" :options="cityOptions" />
                        </UFormGroup>
                        <UFormGroup name="tur" label="Tur:">
                            <UInputMenu v-model="state.tur" :options="discounts?.ty" />
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

                        <UButton type="submit">Submit</UButton>
                        <UButton variant="outline" class="ml-2" @click="formclear">Clear</UButton>
                    </UForm>
                </div>
                <div class="col-span-3 dark:bg-gray-600 w-full py-3 px-4 overflow-y-auto scroll-container bg-slate-200">
                    <div class="grid grid-cols-3 gap-4">
                        <CardsMainCard v-for="n in 10" :key="n" />
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style>
.scroll-container::-webkit-scrollbar {
    width: 8px;
}

.scroll-container::-webkit-scrollbar-thumb {
    background-color: #9ca3af;
    border-radius: 6px;
}
</style>
