<script lang="ts" setup>
definePageMeta({
    layout: "login",
});

import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const schema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive({
    email: undefined,
    password: undefined,
});

const router = useRouter();
const toast = useToast();
const loading = ref(false);

const register = async (email: string, password: string) => {
    try {
        loading.value = true;
        const { status } = await useFetch("http://127.0.0.1:8000/api/v1/user/create", {
            method: "POST",
            body: {
                username: email,
                password,
            },
        });
        if (status.value == "success") {
            router.push("/");
        } else {
            toast.add({ title: "Login failed. Please check your credentials." });
        }
    } finally {
        loading.value = false;
    }
};

async function onSubmit(event: FormSubmitEvent<Schema>) {
    event.preventDefault();
    const { email, password } = event.data;

    if (email && password) {
        register(email, password);
        router.push("/");
    } else {
        toast.add({ title: "Please fill out both fields" });
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center">
        <div class="dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormGroup label="Email" name="email" size="lg">
                    <UInput v-model="state.email" />
                </UFormGroup>

                <UFormGroup label="Password" name="password" size="lg">
                    <UInput v-model="state.password" type="password" />
                </UFormGroup>

                <UButton :disabled="loading" type="submit" size="lg" block class="relative">
                    <span v-if="!loading">Register</span>
                    <span v-else>
                        <Loading />
                    </span>
                </UButton>
                <p class="text-center mt-2 text-sm">
                    Hisobingiz yo'qmi? <NuxtLink to="/login" class="text-blue-500"> Login</NuxtLink>
                </p>
            </UForm>
        </div>
    </div>
</template>
