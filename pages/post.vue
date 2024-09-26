<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import { BASE_URL } from "~/constants";
import type { IRegion } from "~/types";
import { getItem } from "~/utility/localStorageControl";

const toast = useToast();
const router = useRouter();
const token = getItem("token");
const imageUrls = ref<string[]>([]);
const loading = ref<boolean>(false);

if (!token) {
    router.push("/login");
}

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
    const bodyData = {
        image_url: event.data.image_url ?? [],
        title: event.data.title ?? "",
        content: event.data.content ?? "",
        address: event.data.address.value ?? "",
        contact: event.data.contact ?? "",
        price: event.data.price ?? "",
        street: event.data.street.value ?? "",
        type: event.data.type.value ?? "",
    };
    loading.value = true;
    try {
        await $fetch(`${BASE_URL}adver_post/`, {
            method: "POST",
            body: JSON.stringify(bodyData),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                clearForm();
                toast.add({ title: "Success added!" });
            })
            .finally(() => (loading.value = false));
    } catch (err) {
        toast.add({ title: "Somethink error not send your post" });
        console.log("Post send", err);
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
    { label: "Y.E", value: "yevro" },
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

onBeforeUnmount(() => {
    imageUrls.value.forEach((url) => URL.revokeObjectURL(url));
});
</script>

<template>
    <div class="py-28 min-h-screen">
        <div class="container">
            <div class="bg-slate-500 dark:bg-gray-800 py-10 px-5 h-full">
                <UForm :state="state" class="space-y-4" @submit="onSubmit">
                    <UFormGroup name="title" label="Title" size="xl">
                        <UInput v-model="state.title" :disabled="loading" />
                    </UFormGroup>
                    <UFormGroup name="content" label="Content" size="xl">
                        <UTextarea v-model="state.content" :disabled="loading" />
                    </UFormGroup>
                    <div class="flex justify-between gap-6">
                        <UFormGroup name="address" label="Viloyat:" size="xl" class="w-full">
                            <UInputMenu v-model="state.address" :options="discounts?.re" :disabled="loading" />
                        </UFormGroup>
                        <UFormGroup name="street" label="Shahar:" size="xl" class="w-full">
                            <UInputMenu v-model="state.street" :options="cityOptions" :disabled="loading" />
                        </UFormGroup>
                    </div>
                    <div class="flex justify-between gap-6">
                        <UFormGroup name="type" label="Tur:" size="xl" class="w-full">
                            <UInputMenu v-model="state.type" :options="discounts?.ty" :disabled="loading" />
                        </UFormGroup>
                        <UFormGroup name="contact" label="Contact" size="xl" class="w-full">
                            <UInput v-model="state.contact" type="tel" :disabled="loading" />
                        </UFormGroup>
                    </div>
                    <div class="flex justify-between gap-6">
                        <UFormGroup name="price" label="Price" size="xl" class="w-full">
                            <UInput v-model="numericPrice" type="text" :disabled="loading" />
                        </UFormGroup>
                        <UFormGroup name="price_type" label="Valyuta" size="xl" class="w-full">
                            <USelect v-model="state.price_type" :options="optionsVal" :disabled="loading" />
                        </UFormGroup>
                    </div>
                    <UFormGroup name="image_url" label="Image" size="xl">
                        <input
                            type="file"
                            @change="handleFileChange"
                            multiple
                            accept="image/*"
                            class="mt-2"
                            :disabled="loading"
                        />
                        <div class="mt-4">
                            <div v-for="(url, index) in imageUrls" :key="index" class="inline-block mr-4">
                                <img :src="url" alt="Image preview" class="max-w-[350px] aspect-[1.7] object-cover" />
                            </div>
                        </div>
                    </UFormGroup>

                    <UButton type="submit" :disabled="loading"> Submit </UButton>

                    <UButton variant="outline" class="ml-2" @click="clearForm" :disabled="loading"> Clear </UButton>
                </UForm>
            </div>
        </div>
    </div>
</template>
