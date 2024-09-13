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

async function onSubmit(event: FormSubmitEvent<Schema>) {
    event.preventDefault();
    const { email, password } = event.data;
    console.log(email, password);

    if (email && password) {
        console.log(email, password);
        router.push("/");
    } else {
        toast.add({ title: "Please fill out both fields" });
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center ">
        <div class="dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 class="text-2xl font-bold mb-6 text-center ">Login</h2>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormGroup label="Email" name="email" size="lg">
                    <UInput v-model="state.email" variant="outline" />
                </UFormGroup>

                <UFormGroup label="Password" name="password" size="lg">
                    <UInput v-model="state.password" type="password" variant="outline" />
                </UFormGroup>

                <UButton type="submit" size="lg" block> Login </UButton>
                <p class="text-center mt-2 text-sm">
                    Hisobingiz yo'qmi? <NuxtLink to="/register" class="text-blue-500"> Register</NuxtLink>
                </p>
            </UForm>
        </div>
    </div>
</template>
