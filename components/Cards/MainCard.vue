<script lang="ts" setup>
import type { IPost } from "~/types";

const props = defineProps({
    data: {
        type: Object as () => IPost,
        required: true,
    },
});
const { data } = props;
</script>

<template>
    <div class="">
        <div class="rounded-2xl overflow-hidden text-black dark:text-white shadow-md">
            <div class="w-hull aspect-[1.7] relative" >
                <img :src="`${data?.image_url}.jpg`" :alt="data?.title" class="h-full" v-if="data?.image_url"/>
                <div class="w-full h-full bg-blue-400 blur-sm" v-else></div>
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
                </div>
                <h4 class="text-xl font-bold mb-2 mt-2">{{ data?.title }}</h4>
                <p class="line-clamp-3 mb-2">{{ data?.contact }}</p>
            </div>
        </div>
    </div>
</template>
