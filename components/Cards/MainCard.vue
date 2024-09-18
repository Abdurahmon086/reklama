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
        <div class="rounded-md overflow-hidden">
            <div class="w-hull aspect-[1.7] relative">
                <img
                    src="https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg"
                    alt=""
                    class="h-full"
                />
            </div>
            <div class="py-2 px-3 bg-slate-500 dark:bg-gray-800">
                <h4 class="text-xl font-bold mb-2">{{ data?.title }}</h4>
                <p class="line-clamp-3 mb-2">{{ data?.contact }}</p>
                <p class="font-bold">{{ data?.price_type == "Sum" ? `${data?.price} so'm` : `${data?.price} $` }}</p>
            </div>
        </div>
    </div>
</template>
