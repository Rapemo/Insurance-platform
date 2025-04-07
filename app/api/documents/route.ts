import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/storage-js';

// Initialize storage client
const storage = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    const { type, id } = Object.fromEntries(new URL(request.url).searchParams);

    if (!type || !id) {
      return NextResponse.json({ error: 'Type and ID are required' }, { status: 400 });
    }

    const { data: documents, error } = await supabase
      .from(`${type}_documents`)
      .select('*')
      .eq(`${type}_id`, id);

    if (error) throw error;
    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const id = formData.get('id') as string;
    const documentName = formData.get('documentName') as string;

    if (!file || !type || !id || !documentName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload file to storage
    const { data: storageData, error: storageError } = await storage
      .from('documents')
      .upload(`${type}/${id}/${documentName}`, file);

    if (storageError) throw storageError;

    // Create document record
    const { data: document, error: dbError } = await supabase
      .from(`${type}_documents`)
      .insert({
        document_name: documentName,
        document_url: storageData?.path,
        [`${type}_id`]: id,
        user_id: 'user_id_here' // Replace with actual user ID
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json(document);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, type } = Object.fromEntries(new URL(request.url).searchParams);

    if (!id || !type) {
      return NextResponse.json({ error: 'ID and type are required' }, { status: 400 });
    }

    // Delete from storage
    const { data: document, error: dbError } = await supabase
      .from(`${type}_documents`)
      .select('document_url')
      .eq('id', id)
      .single();

    if (dbError) throw dbError;

    const { error: storageError } = await storage
      .from('documents')
      .remove([document.document_url]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: deleteError } = await supabase
      .from(`${type}_documents`)
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
