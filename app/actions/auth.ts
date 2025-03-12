import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface AuthResponse {
    error: null | string,
    data: unknown | null,
    success: boolean
}

export async function signUp(formData: FormData): Promise<AuthResponse> {
    const supabase = await createClient();

    const { email, password, fullname } = Object.fromEntries(formData) as {
        email: string;
        password: string;
        fullname: string;
    };

    const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { fullname }, 
        },
    });

    return {
        error: error?.message || 'Error in signing up',
        data: signUpData,
        success: !error,
    };
}

export async function signIn(formData: FormData): Promise<AuthResponse> {
    const supabase = await createClient();

    const { email, password} = Object.fromEntries(formData) as {
        email: string;
        password: string;
    };

    const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    return {
        error: error?.message || 'Error in signing you in!',
        data: signInData,
        success: !error,
    };
}

export async function signOut() {
    const supabase = await createClient();

    await supabase.auth.signOut();
    redirect('/sign-in');
}