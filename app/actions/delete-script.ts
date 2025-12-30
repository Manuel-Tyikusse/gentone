"use server"

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function deleteScriptAction(id: string) {
  try {
    const { error } = await supabase
      .from('scripts')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    // Isso limpa o cache e atualiza a lista de histórico instantaneamente
    revalidatePath('/dashboard/history');
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}