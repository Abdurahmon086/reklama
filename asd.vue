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

const {
    data: discounts,
    status,
    refresh,
} = useAsyncData("cart-discount", async () => {
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
        return { region, type };
    } catch (err) {
        console.error("Error fetching data:", err);
        return { region: [], type: [] };
    }
});

const options = ref<{ label: string; value: number }[]>([]);
const optionsType = ref<{ label: string; value: number }[]>([]);
const cityOptions = ref<{ label: string; value: number }[]>([]);
const optionsVal = [
    { label: "So'm", value: "som" },
    { label: "Y.E", value: "yevro" },
];

onMounted(async () => {
    try {
        if (status.value === "idle") {
            await refresh();
        }
    } catch (err) {
        console.error(err);
    }
});

watch(
    () => discounts.value,
    (newVal) => {
        if (newVal) {
            options.value = newVal.region.map(({ id, name }) => ({ label: name, value: id })) ?? [];
            optionsType.value = newVal.type.map(({ id, name }) => ({ label: name, value: id })) ?? [];
        }
    },
    { immediate: true }
);

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