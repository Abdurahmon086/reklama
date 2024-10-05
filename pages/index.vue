<script setup lang="ts">
import { getItem } from "~/utility/localStorageControl";
import { BASE_URL } from "~/constants";
import type { IPost, IRegion } from "~/types";
import type { FormSubmitEvent } from "#ui/types";

const token = getItem("token");

const data = ref<IPost[]>([]);

const state = reactive({
    address: "",
    street: "",
    type: "",
    price: "",
    nextprice: "",
    price_type: "",
});

const formclear = () => {
    state.address = "";
    state.street = "";
    state.type = "";
    state.price = "";
    state.nextprice = "";
    state.price_type = "";
    data.value = [];
};

async function onSubmit(event: FormSubmitEvent<any>) {
    event.preventDefault();

    const qeuryData = {
        address: event.data.address.value ?? "",
        nextprice: event.data.nextprice ?? "",
        price: event.data.price ?? "",
        price_type: event.data.price_type ?? "",
        street: event.data.street.value ?? "",
        type: event.data.type.value ?? "",
    };
    const queryParams = new URLSearchParams(qeuryData as any).toString();

    try {
        const filter = await $fetch<IPost[]>(`${BASE_URL}filter/?${queryParams}`).then((res) => res);

        data.value = filter;
    } catch (error) {
        console.error("Form submission error:", error);
    }
}

const { data: randomD1 } = useFetch<IPost[]>(`${BASE_URL}random_adver/`);

const { data: discounts } = await useAsyncData("cart-discount", async () => {
    try {
        const [region, type] = await Promise.all([
            $fetch<IRegion[]>(`${BASE_URL}get_region/`),
            $fetch<IRegion[]>(`${BASE_URL}adver_type/`),
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
    { label: "So'm", value: "Sum" },
    { label: "Y.E", value: "Dollar" },
];

const cityOptions = ref<{ label: string; value: number }[]>([]);

watch(
    () => state.address,
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
    <div class="w-full h-screen pt-24">
        <main class="container">
            <div class="grid grid-cols-4 rounded h-[800px]">
                <div class="col-span-1 bg-slate-500 dark:bg-gray-800 py-3 px-4 h-full">
                    <UForm :state="state" class="space-y-4" @submit="onSubmit">
                        <UFormGroup name="address" label="Viloyat:">
                            <UInputMenu v-model="state.address" :options="discounts?.re" />
                        </UFormGroup>
                        <UFormGroup name="street" label="Shahar:">
                            <UInputMenu v-model="state.street" :options="cityOptions" />
                        </UFormGroup>
                        <UFormGroup name="type" label="Tur:">
                            <UInputMenu v-model="state.type" :options="discounts?.ty" />
                        </UFormGroup>
                        <UFormGroup name="price" label="Boshlang'ich narx:">
                            <UInput v-model="state.price" type="number" />
                        </UFormGroup>
                        <UFormGroup name="nextprice" label="Tugaydigan narx:">
                            <UInput v-model="state.nextprice" type="number" />
                        </UFormGroup>
                        <UFormGroup name="price_type" label="Valyuta:">
                            <USelect v-model="state.price_type" :options="optionsVal" />
                        </UFormGroup>

                        <UButton type="submit">Submit</UButton>
                        <UButton variant="outline" class="ml-2" @click="formclear">Clear</UButton>
                    </UForm>
                </div>
                <div class="col-span-3 dark:bg-gray-600 w-full py-3 px-4 overflow-y-auto scroll-container bg-slate-200">
                    <div class="grid grid-cols-3 gap-4">
                        <CardsMainCard
                            v-for="item in data.length > 0 ? data : randomD1"
                            :key="item.created_at"
                            :data="item"
                        />
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
