import { error } from 'console';
'use server'
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function getSignedStorageUrl(filePath : String) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: urlData, error } = await supabaseAdmin.storage.from("training_data").createSignedUploadUrl(`${user?.id}/${new Date().getTime()}_${filePath}`)
    
    return {
        signedUrl: urlData?.signedUrl || '',
        error: error?.message || null
    }
}

export async function fetchModels() {
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();

    const {data, error, count} = await supabase.from('models').select('*', {count: "exact"}).eq('user_id', user?.id).order('created_at', { ascending: false });

    return {
        error: error?.message || null,
        success: !error,
        data: data || null,
        count: count || 0
    }
}

export async function deleteModel(id: number, model_id: string, model_version: string) {
    const supabase = await createClient();

    //Deleting model from Replicate
    if(model_version){
        try {
            const response = await fetch(`https://api.replicate.com/v1/models/kishginthjaffna/${model_id}/versions/${model_version}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            if(!response.ok){
                    throw new Error('Failed to delete model from Replicate')
            }

        } catch (error) {
            console.log('Failed to delete model version from replicate', error);

            return {
                error: 'Failed to delete model version from replicate',
                success: false
            }
            
        }
    }

    if(model_id){
        try {
            const response = await fetch(`https://api.replicate.com/v1/models/kishginthjaffna/${model_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            if(!response.ok){
                    throw new Error('Failed to delete model from Replicate')
            }

        } catch (error) {
            console.log('Failed to delete model from replicate', error);

            return {
                error: 'Failed to delete model from replicate',
                success: false
            }
            
        }
    }

    //Deleting model from Supabase
    const {error} = await supabase.from('models').delete().eq('id', id);

    return {
        error: error?.message || 'Failed to delete model from database',
        success: !error
    }
}