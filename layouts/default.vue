<script setup lang="ts">
const router = useRouter();
const loading = ref(true);

onMounted(() => {
    const tokenString = localStorage.getItem("token");
    if (tokenString) {
        loading.value = false;
        try {
            const token = JSON.parse(tokenString);
            if (!token) {
                router.push("/login");
            }
        } catch (error) {
            console.error("Error parsing token from localStorage:", error);
            router.push("/login");
        }
    } else {
        router.push("/login");
        loading.value = false;
    }
});
</script>

<template>
    <div v-if="!loading">
        <LayoutsHeader />
        <slot />
    </div>
    <div v-else><LoadingM /></div>
</template>
