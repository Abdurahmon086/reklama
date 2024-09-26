<script lang="ts" setup>
import { BASE_URL } from "~/constants";
import type { IPost, IRegion } from "~/types";

const props = defineProps({
    data: {
        type: Object as () => IPost,
        required: true,
    },
});
const { data } = props;

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
</script>

<template>
    <div class="">
        <div class="rounded-2xl overflow-hidden text-black dark:text-white shadow-md">
            <div class="w-hull aspect-[1.7] relative">
                <img
                    src="https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg"
                    alt=""
                    class="h-full"
                />
            </div>
            <div class="py-2 px-3 bg-white dark:bg-gray-800">
                <div class="flex justify-between items-center">
                    <h3 class="font-bold text-3xl">
                        {{
                            data?.price_type == "Sum"
                                ? `${data?.price ? data?.price : 0} so'm`
                                : `${data?.price ? data?.price : 0} $`
                        }}
                    </h3>
                    <span
                        class="block py-1 px-2 rounded-3xl font-bold text-sm"
                        :class="
                            data.status == 'active' ? 'bg-green-200/10 text-green-600' : 'bg-red-200/10 text-red-600'
                        "
                        >{{ data.status }}</span
                    >
                </div>
                <h4 class="text-xl font-bold mb-2 mt-2">{{ data?.title }}</h4>
                <div
                    class="flex gap-2 items-center text-gray-500 dark:text-gray-400 mb-2"
                    :class="discounts?.re?.find((item) => item.value == data?.street) ? 'block' : 'hidden'"
                >
                    <UIcon name="i-gis-location-poi" class="w-5 h-5" />
                    <h5>{{ discounts?.re?.find((item) => item.value == data?.street)?.label }}</h5>
                </div>
                <p class="line-clamp-3 mb-2">{{ data?.contact }}</p>
            </div>
        </div>
    </div>
</template>
